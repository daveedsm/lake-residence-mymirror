const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname;
http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://local');
 if(u.pathname.startsWith('/mystay-ui/')){
  const name=u.pathname.slice(11);
  if(!/^(?:main[.]js|website-header[.]js|images[.]json|[a-zA-Z0-9_-]+[.](?:png|webp|jpe?g))$/.test(name)){res.writeHead(404).end();return}
  const p=path.join(root,name);if(!fs.existsSync(p)){res.writeHead(404).end();return}
  res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.json')?'application/json':name.endsWith('.png')?'image/png':name.endsWith('.webp')?'image/webp':'image/jpeg');
  res.setHeader('Cache-Control','no-cache');fs.createReadStream(p).pipe(res);return;
 }
 if(!['/','/mystay','/mystay/'].includes(u.pathname)){res.writeHead(404).end();return}
 const headers={...req.headers};delete headers.host;delete headers.connection;delete headers['accept-encoding'];
 const upstream=await fetch('https://agam-life.daveedsm.chatgpt.site'+req.url,{method:req.method,headers,redirect:'manual'});
 const type=upstream.headers.get('content-type')||'';
 for(const [k,v]of upstream.headers){if(!['content-length','content-encoding','transfer-encoding','connection'].includes(k))res.setHeader(k,v)}
 res.statusCode=upstream.status;
 if(req.method==='HEAD'){res.end();return}
 if(type.includes('text/html')){
  let html=await upstream.text();
  if(u.pathname==='/'){
   html=html.replace('</head>','<script src="/mystay-ui/website-header.js?v=20261122" defer></script></head>');
  }else{
   html=html.replace(/<head([^>]*)>/i,'<head$1>'+fs.readFileSync(path.join(root,'lake-first-paint.html'),'utf8'));
   html=html.replace('</head>','<style id="mystay-first-paint">'+fs.readFileSync(path.join(root,'header.css'),'utf8')+'</style><script src="/mystay-ui/main.js?v=20261122" defer></script></head>');
  }
  res.setHeader('Cache-Control','no-store');res.end(html)
 }else res.end(Buffer.from(await upstream.arrayBuffer()));
}catch(e){console.error(e.message);res.writeHead(502,{'Content-Type':'text/plain'}).end('Page temporarily unavailable')}}).listen(8092,'0.0.0.0');