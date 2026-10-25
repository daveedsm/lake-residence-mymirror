'use strict';
const https=require('node:https'),dns=require('node:dns/promises'),net=require('node:net');
const blocked=new net.BlockList();
for(const [ip,bits] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',3]])blocked.addSubnet(ip,bits,'ipv4');
const global6=new net.BlockList();global6.addSubnet('2000::',3,'ipv6');
blocked.addSubnet('2001::',23,'ipv6');blocked.addSubnet('2001:db8::',32,'ipv6');blocked.addSubnet('2002::',16,'ipv6');
function publicAddress(ip){const family=net.isIP(ip);return family===4?!blocked.check(ip,'ipv4'):family===6&&global6.check(ip,'ipv6')&&!blocked.check(ip,'ipv6');}
function endpoint(value){const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443')||u.hash)throw Error('API endpoints must use HTTPS on port 443 without credentials or a fragment');const host=u.hostname.replace(/^\[|\]$/g,'');if(net.isIP(host)&&!publicAddress(host))throw Error('API endpoints must use a public internet address');if(host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||!host.includes('.'))throw Error('Use a public API hostname');return u;}
async function dispatch(url,payload,token='',options={}){
 const u=endpoint(url),host=u.hostname.replace(/^\[|\]$/g,'');const rows=net.isIP(host)?[{address:host,family:net.isIP(host)}]:await (options.lookup||dns.lookup)(host,{all:true,verbatim:true});
 if(!rows.length||rows.some(r=>!publicAddress(r.address)))throw Error('API address is not public');
 const chosen=rows[0],data=Buffer.from(JSON.stringify(payload));
 return new Promise((resolve,reject)=>{const req=https.request(u,{method:'POST',lookup:(_host,_options,cb)=>cb(null,chosen.address,chosen.family),headers:{'Content-Type':'application/json','Content-Length':data.length,'Idempotency-Key':payload.requestId,...(token?{Authorization:'Bearer '+token}:{})}},res=>{res.resume();res.on('end',()=>{if(res.statusCode>=200&&res.statusCode<300)resolve();else reject(Error('Provider did not accept the request'));});});req.setTimeout(10000,()=>req.destroy(Error('Provider timed out')));req.on('error',reject);req.end(data);});
}
module.exports={endpoint,publicAddress,dispatch};
