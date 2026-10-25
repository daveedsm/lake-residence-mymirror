'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {createApp}=require('./mymirror-server.cjs'),defaults=require('./mymirror-defaults.json'),{endpoint,publicAddress,dispatch}=require('./mymirror-referrals.cjs');
test('API destinations reject private networks, credentials, redirects targets and unsafe ports',async()=>{
 for(const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','172.17.0.1','192.168.1.1','100.64.0.1','::1','::ffff:127.0.0.1','fd00::1','2001:db8::1'])assert.equal(publicAddress(ip),false,ip);
 for(const ip of ['8.8.8.8','1.1.1.1','2606:4700:4700::1111'])assert.equal(publicAddress(ip),true,ip);
 for(const u of ['http://example.com','https://localhost/x','https://169.254.169.254/x','https://user:pass@example.com','https://example.com:8000/x'])assert.throws(()=>endpoint(u));
 await assert.rejects(dispatch('https://provider.example/webhook',{},'',{lookup:async()=>[{address:'127.0.0.1',family:4}]}),/not public/);
});
test('existing CRM administrator can sign in without creating or changing a password',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mm-crm-login-'));let role='admin';
 const app=createApp({dataDir:dir,testOrigin:'http://localhost',crmFetch:async(url,init)=>{const body=JSON.parse(init.body);assert.equal(url,'https://agam-life.daveedsm.chatgpt.site/api/crm/auth');assert.equal(body.name,'ExistingUser');assert.equal(body.action,'login');return new Response(JSON.stringify({ok:true,role}),{headers:{'Content-Type':'application/json','Set-Cookie':'crm_admin_session=test-session; Path=/; HttpOnly; Secure; SameSite=Strict'}});}});
 await new Promise(r=>app.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+app.address().port+'/myapp/api/admin/login';
 try{const send=()=>fetch(url,{method:'POST',headers:{Origin:'http://localhost','Content-Type':'application/json'},body:JSON.stringify({username:'ExistingUser',password:'test-only-input'})});let r=await send();assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/mm_owner=/);assert.match(r.headers.get('set-cookie'),/crm_admin_session=/);role='employee';r=await send();assert.equal(r.status,401);assert.equal(r.headers.get('set-cookie'),null);}finally{await new Promise(r=>app.close(r));await fs.rm(dir,{recursive:true,force:true});}
});
test('owner setup is private, single use and persists; every service has protected API configuration',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mm-api-')),origin='http://127.0.0.1:4180',token=crypto.randomBytes(32).toString('hex'),password=crypto.randomBytes(24).toString('base64');
 await fs.writeFile(path.join(dir,'owner-setup.json'),JSON.stringify({tokenHash:crypto.createHash('sha256').update(token).digest('hex'),expires:Date.now()+60000}));
 let count=0,received;let app=createApp({dataDir:dir,testOrigin:origin,sendReferral:async(url,data)=>{count++;received={url,data};}});await new Promise(r=>app.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+app.address().port+'/myapp/api';
 const call=async(p,method='GET',data,cookie,where=origin)=>{const r=await fetch(base+p,{method,headers:{Origin:where,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:r.status,headers:r.headers,data:await r.json()};};
 try{
  assert.equal((await call('/admin/config')).status,401);
  assert.equal((await call('/admin/setup','POST',{token:'wrong',password,confirmPassword:password})).status,403);
  assert.equal((await call('/admin/setup','POST',{token,password,confirmPassword:password})).status,201);
  assert.equal((await call('/admin/setup','POST',{token,password,confirmPassword:password})).status,409);
  const login=await call('/admin/login','POST',{username:'owner',password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];
  const c=structuredClone(defaults);assert.equal(Object.keys(c.services).length,12);c.services.trainer={...c.services.trainer,type:'api',url:'https://provider.example/private-path',apiTokenEnv:'',enabled:true};
  assert.equal((await call('/admin/config','PUT',c,cookie)).status,200);
  const publicC=(await call('/config')).data;assert.equal(publicC.services.trainer.url,'');assert.equal(publicC.services.trainer.apiTokenEnv,undefined);assert.equal(publicC.services.trainer.apiConfigured,true);
  assert.equal((await call('/admin/config','GET',null,cookie)).data.services.trainer.url,'https://provider.example/private-path');
  const payload={service:'trainer',requestId:crypto.randomUUID(),name:'Test resident',apartment:'175',contact:'example@example.com',message:'Training enquiry',consent:true};
  assert.equal((await call('/services/referrals','POST',payload,null,'https://evil.example')).status,403);
  assert.equal((await call('/services/referrals','POST',{...payload,consent:false})).status,400);
  assert.equal((await call('/services/referrals','POST',payload)).status,202);assert.equal((await call('/services/referrals','POST',payload)).status,202);assert.equal(count,1);
  assert.equal(received.data.resident.apartment,'175');assert.equal(received.data.resident.identityVerified,false);assert.equal(received.data.event,'service.referral.requested');
  assert.equal((await call('/services/referrals','POST',{...payload,message:'Changed'})).status,409);
  c.services.trainer.enabled=false;await call('/admin/config','PUT',c,cookie);assert.equal((await call('/services/referrals','POST',{...payload,requestId:crypto.randomUUID()})).status,409);
  await new Promise(r=>app.close(r));app=createApp({dataDir:dir,testOrigin:origin});await new Promise(r=>app.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+app.address().port+'/myapp/api';assert.equal((await call('/admin/status')).data.configured,true);assert.equal((await call('/admin/login','POST',{username:'owner',password})).status,200);
 }finally{await new Promise(r=>app.close(r));await fs.rm(dir,{recursive:true,force:true});}
});
