(() => {
  if (window.__lakeWebsiteHeader) return;
  window.__lakeWebsiteHeader=true;
  const style=document.createElement('style');
  style.textContent=`
  .lake-brand-header-row{position:relative;padding-right:66px!important}
  .lake-brand-header-row>a[aria-label="\u05d4\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4"],.lake-brand-header-row>.lake-account-trigger{display:none!important}
  #lake-site-menu{position:absolute;right:15px;top:50%;transform:translateY(-50%);z-index:70;direction:rtl}
  #lake-site-menu>summary{display:flex;align-items:center;justify-content:center;width:38px;height:38px;list-style:none;cursor:pointer;border:0!important;background:transparent!important;color:inherit;box-shadow:none!important}
  #lake-site-menu>summary::-webkit-details-marker{display:none}
  #lake-site-menu>summary svg{width:25px;height:25px}
  #lake-site-menu nav{position:absolute;right:0;top:45px;display:grid;gap:3px;min-width:228px;padding:8px;background:#f5f3ec;color:#25373d;border:0;box-shadow:0 9px 25px #061f3225;border-radius:9px}
  #lake-site-menu:not([open]) nav{display:none}
  #lake-site-menu nav a{display:flex;align-items:center;gap:11px;min-height:43px;padding:8px 10px;border:0!important;background:transparent;text-decoration:none;color:inherit;font-size:14px}
  #lake-site-menu nav a:hover{background:#e9e5da}
  #lake-site-menu nav svg{width:21px;height:21px;flex:none;color:#a17e3d}
  header button[data-href^="/checkout"]{border:0!important;box-shadow:none!important;background:transparent!important}
  header button[data-href^="/checkout"] svg{color:#a17e3d}
  @media(max-width:600px){.lake-brand-header-row{padding-right:58px!important;gap:9px!important}#lake-site-menu{right:10px}}
  `;
  document.head.append(style);
  const icons={
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    key:'<circle cx="15" cy="8" r="5"/><path d="m11 12-8 8v-4h4v-4h4"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  };
  const svg=k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[k]+'</svg>';
  function render(){
    const row=document.querySelector('.lake-brand-header-row');
    if(!row||row.querySelector('#lake-site-menu'))return;
    const english=document.documentElement.lang==='en'||Array.from(row.querySelectorAll('button')).some(x=>x.textContent.trim()==='HE');
    const d=document.createElement('details');d.id='lake-site-menu';
    d.innerHTML='<summary aria-label="'+(english?'Account and app menu':'\u05ea\u05e4\u05e8\u05d9\u05d8 \u05d7\u05e9\u05d1\u05d5\u05df \u05d5\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4')+'">'+svg('menu')+'</summary><nav aria-label="'+(english?'Account and app':'\u05d7\u05e9\u05d1\u05d5\u05df \u05d5\u05d0\u05e4\u05dc\u05d9\u05e7\u05e6\u05d9\u05d4')+'"><a href="/myapp">'+svg('key')+'<span>MyMirror</span></a><a href="/account">'+svg('user')+'<span>'+(english?'Sign in / Register':'\u05db\u05e0\u05d9\u05e1\u05d4 / \u05d4\u05e8\u05e9\u05de\u05d4')+'</span></a></nav>';
    row.append(d);
    document.querySelectorAll('header a[href="/app"]').forEach(a=>a.href='/myapp');
  }
  render();
  new MutationObserver(render).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{const m=document.getElementById('lake-site-menu');if(m&&!m.contains(e.target))m.open=false});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.getElementById('lake-site-menu');if(m)m.open=false}});
})();