'use strict';
const defaults=require('./mymirror-defaults.json');
const clean=(s,n=200)=>String(s??'').trim().slice(0,n);
const types=['website','store','booking','whatsapp','telephone','email','internal','api'];
function destination(value,type='website'){
 const v=clean(value,2000);if(!v)return '';
 if(!types.includes(type))throw Error('Choose a supported destination type');
 if(type==='telephone'){const phone=v.replace(/^tel:/i,'');if(!/^\+?[0-9() .-]{5,30}$/.test(phone))throw Error('Enter a valid telephone number');return 'tel:'+phone;}
 if(type==='email'){const email=v.replace(/^mailto:/i,'');if(!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email))throw Error('Enter a valid email address');return 'mailto:'+email;}
 if(type==='internal'){if(!v.startsWith('/')||v.startsWith('//')||/[\\\r\n]/.test(v)||/[%](?:2f|5c|0a|0d)/i.test(v))throw Error('Internal pages must start with a single /');const u=new URL(v,'https://mymirror.invalid');if(u.origin!=='https://mymirror.invalid')throw Error('Invalid internal page');return u.pathname+u.search+u.hash;}
 if(type==='api')return require('./mymirror-referrals.cjs').endpoint(v).href;
 const u=new URL(v);if(u.protocol!=='https:'||u.username||u.password)throw Error('Website and booking links must use HTTPS');
 if(type==='whatsapp'&&!['wa.me','api.whatsapp.com','www.whatsapp.com','chat.whatsapp.com'].includes(u.hostname))throw Error('Use a WhatsApp link such as https://wa.me/972...');
 return u.href;
}
function tokenEnv(value){const v=clean(value,120);if(v&&!/^MYMIRROR_SERVICE_[A-Z0-9_]+$/.test(v))throw Error('API token variable must start with MYMIRROR_SERVICE_ and contain uppercase letters, digits or underscores');return v;}
function sanitizeConfig(raw){
 const c=structuredClone(defaults),input=raw.services||{};c.services={};
 const keys=[...new Set([...Object.keys(defaults.services),...Object.keys(input)])];if(keys.length>60)throw Error('Add up to 60 services');
 keys.forEach((key,i)=>{if(!/^[a-z][a-z0-9-]{0,49}$/.test(key)||key==='concierge')throw Error('Invalid service identifier');const p=input[key]||defaults.services[key]||{},base=defaults.services[key]||{};const title=clean(p.title||base.title,100);if(!title)throw Error('Each service needs a title');const type=p.type||'website',homeType=p.homeType||'website';c.services[key]={title,titleHe:clean(p.titleHe,100),description:clean(p.description,300),descriptionHe:clean(p.descriptionHe,300),provider:clean(p.provider,120),type,url:destination(p.url,type),apiTokenEnv:tokenEnv(p.apiTokenEnv),homeApiTokenEnv:tokenEnv(p.homeApiTokenEnv),homeProvider:clean(p.homeProvider,120),homeType,homeUrl:destination(p.homeUrl,homeType),enabled:p.enabled!==false,order:Number.isFinite(+p.order)?+p.order:i,group:['wellness','nearby','home'].includes(p.group)?p.group:(['spa','gym','pool','trainer'].includes(key)?'wellness':'nearby')};});
 if(!Array.isArray(raw.shops)||raw.shops.length>60)throw Error('Add up to 60 shops');
 const ids=new Set();c.shops=raw.shops.map((s,i)=>{const id=clean(s.id,80)||'shop-'+i;if(ids.has(id))throw Error('Shop identifiers must be unique');ids.add(id);const name=clean(s.name,120);if(!name)throw Error('Each shop needs a name');const type=s.type||'store';if(type==='api')throw Error('Configure API referrals on the Shops service, not an individual store');return{id,name,nameHe:clean(s.nameHe,120),category:clean(s.category,100),categoryHe:clean(s.categoryHe,100),description:clean(s.description,500),descriptionHe:clean(s.descriptionHe,500),hours:clean(s.hours,200),hoursHe:clean(s.hoursHe,200),image:destination(s.image),mapUrl:destination(s.mapUrl),type,url:destination(s.url,type),enabled:s.enabled!==false,featured:!!s.featured,order:Number.isFinite(+s.order)?+s.order:i};});
 const r=raw.rooftop||{};c.rooftop={enabled:r.enabled!==false,title:'Rooftop',instructions:clean(r.instructions,1500),instructionsHe:clean(r.instructionsHe,1500),maxGuests:Number(r.maxGuests),startHour:Number(r.startHour),endHour:Number(r.endHour),maxDurationHours:Number(r.maxDurationHours??8),advanceDays:Number(r.advanceDays??180),blockedDates:[...new Set(r.blockedDates||[])]};
 const roof=c.rooftop;if(!Number.isInteger(roof.maxGuests)||roof.maxGuests<1||roof.maxGuests>200||!Number.isInteger(roof.startHour)||!Number.isInteger(roof.endHour)||roof.startHour<0||roof.endHour>24||roof.startHour>=roof.endHour||!Number.isFinite(roof.maxDurationHours)||roof.maxDurationHours<0.5||roof.maxDurationHours>24||!Number.isInteger(roof.advanceDays)||roof.advanceDays<1||roof.advanceDays>365||roof.blockedDates.length>366||roof.blockedDates.some(d=>!/^\d{4}-\d{2}-\d{2}$/.test(d)||new Date(d).toISOString().slice(0,10)!==d))throw Error('Check rooftop hours, dates, capacity and booking limits');
 c.version=Date.now();return c;
}
module.exports={destination,sanitizeConfig};
