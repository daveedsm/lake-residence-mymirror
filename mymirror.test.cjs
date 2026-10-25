'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {createApp}=require('./mymirror-server.cjs'),{destination,sanitizeConfig}=require('./mymirror-config.cjs'),defaults=require('./mymirror-defaults.json');
test('destination validation prevents active-content and off-site internal URLs',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,test','http://example.com'])assert.throws(()=>destination(url));
 for(const url of ['//evil.test','/\\evil.test','https://evil.test'])assert.throws(()=>destination(url,'internal'));
 assert.equal(destination('+972 50-1234567','telephone'),'tel:+972 50-1234567');assert.equal(destination('owner@example.com','email'),'mailto:owner@example.com');assert.equal(destination('/myapp/','internal'),'/myapp/');assert.equal(destination('https://wa.me/972501234567','whatsapp'),'https://wa.me/972501234567');assert.throws(()=>destination('https://evil.test','whatsapp'));
});
test('shared settings preserve editable destinations and reject bad limits',()=>{const raw=structuredClone(defaults);raw.services.gym={...raw.services.gym,type:'telephone',url:'+972501234567',enabled:false,order:4};raw.shops[0].hours='08:00–18:00';raw.shops[0].featured=true;const c=sanitizeConfig(raw);assert.equal(c.services.gym.url,'tel:+972501234567');assert.equal(c.services.gym.enabled,false);assert.equal(c.shops[0].hours,'08:00–18:00');assert.equal(c.shops[0].featured,true);raw.rooftop.maxDurationHours=0;assert.throws(()=>sanitizeConfig(raw));});
test('server authorization, shared configuration, booking concurrency, privacy and persistence',async t=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mymirror-test-')),origin='http://127.0.0.1:4173',salt=crypto.randomBytes(16).toString('hex'),password=crypto.randomBytes(24).toString('base64'),adminHash=salt+':'+crypto.scryptSync(password,salt,64).toString('hex');
 let app=createApp({dataDir:dir,adminHash,testOrigin:origin});await new Promise(r=>app.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+app.address().port+'/myapp';
 const call=async(p,method='GET',body,cookie)=>{const r=await fetch(base+p,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,headers:r.headers,data:await r.json()};};
 try{
  assert.equal((await call('/api/admin/config','PUT',defaults)).status,401);assert.equal((await call('/api/admin/bookings')).status,401);
  assert.equal((await call('/api/admin/login','POST',{username:'owner',password:'wrong'})).status,401);
  const login=await call('/api/admin/login','POST',{username:'owner',password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];assert.match(login.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Strict/);
  const next=structuredClone(defaults);next.services.gym={...next.services.gym,type:'telephone',url:'+972501234567',titleHe:'חדר כושר',enabled:true};next.shops[0].hours='08:00–18:00';assert.equal((await call('/api/admin/config','PUT',next,cookie)).status,200);assert.equal((await call('/api/config')).data.services.gym.type,'telephone');
  const day=new Date(Date.now()+3*86400000).toISOString().slice(0,10),booking={name:'Private resident',apartment:'12',note:'Private event',guests:3,start:day+'T10:00:00+02:00',end:day+'T11:00:00+02:00'};
  const race=await Promise.all([call('/api/rooftop/bookings','POST',booking),call('/api/rooftop/bookings','POST',booking)]);assert.deepEqual(race.map(x=>x.status).sort(),[201,409]);const saved=race.find(x=>x.status===201).data;
  const publicRows=(await call('/api/rooftop/availability')).data;assert.equal(publicRows.length,1);for(const key of ['name','apartment','note','cancelToken','cancelHash'])assert.equal(publicRows[0][key],undefined);
  assert.equal((await call('/api/rooftop/bookings/'+saved.id,'DELETE')).status,403);
  assert.equal((await call('/api/admin/bookings/'+saved.id,'PATCH',{status:'confirmed'},cookie)).status,200);
  const cancel=await fetch(base+'/api/rooftop/bookings/'+saved.id,{method:'DELETE',headers:{Origin:origin,'X-Booking-Token':saved.cancelToken}});assert.equal(cancel.status,200);
  assert.equal((await call('/api/rooftop/availability')).data.length,0);
  next.rooftop.blockedDates=[day];assert.equal((await call('/api/admin/config','PUT',next,cookie)).status,200);assert.equal((await call('/api/rooftop/bookings','POST',booking)).status,400);
  const evil=structuredClone(next);evil.services.gym.type='website';evil.services.gym.url='javascript:alert(1)';assert.equal((await call('/api/admin/config','PUT',evil,cookie)).status,400);
  const cross=await fetch(base+'/api/admin/config',{method:'PUT',headers:{Origin:'https://evil.test','Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(next)});assert.equal(cross.status,403);
  assert.equal((await fetch(base+'/apartment-cover-1.webp')).status,200);assert.equal((await fetch(base+'/mymirror-admin-v2.js')).status,200);assert.equal((await fetch(base+'/mymirror-config.cjs')).status,404);
  await new Promise(r=>app.close(r));app=createApp({dataDir:dir,adminHash,testOrigin:origin});await new Promise(r=>app.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+app.address().port+'/myapp';assert.deepEqual((await call('/api/config')).data.rooftop.blockedDates,[day]);
 }finally{await new Promise(r=>app.close(r));await fs.rm(dir,{recursive:true,force:true});}
});
