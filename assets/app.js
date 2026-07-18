
(function(){
  var root=document.documentElement, saved=null;
  try{saved=localStorage.getItem('jl-theme');}catch(e){}
  if(saved) root.setAttribute('data-theme',saved);
  function toggle(){var cur=root.getAttribute('data-theme'); if(!cur){cur=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';} var next=cur==='dark'?'light':'dark'; root.setAttribute('data-theme',next); try{localStorage.setItem('jl-theme',next);}catch(e){}}
  document.addEventListener('click',function(e){var t=e.target.closest('[data-toggle-theme]'); if(t){e.preventDefault(); toggle();}});
  // Videos: la miniatura se cambia por el reproductor al hacer clic. Desde el disco
  // (file://) YouTube no deja reproducir dentro de la pagina, asi que se abre alla.
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-yt]'); if(!b) return;
    e.preventDefault();
    var id=b.getAttribute('data-yt');
    if(location.protocol==='file:'){ window.open('https://www.youtube.com/watch?v='+id,'_blank','noopener'); return; }
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';
    f.title='Video de YouTube'; f.allowFullscreen=true;
    f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    b.parentNode.replaceChild(f,b);
  });
  var grid=document.querySelector('[data-grid]'); if(!grid) return;
  var cards=Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
  var state={q:'',order:'recientes',dur:'todos',cat:'todas'};
  function durOf(m){m=+m; if(m<5) return 'corto'; if(m<=10) return 'medio'; return 'largo';}
  function matches(c){
    if(state.q && (c.dataset.title+' '+c.dataset.excerpt).toLowerCase().indexOf(state.q)<0) return false;
    if(state.dur!=='todos' && durOf(c.dataset.reading)!==state.dur) return false;
    if(state.cat!=='todas' && (' '+(c.dataset.themes||'')+' ').indexOf(' '+state.cat+' ')<0) return false;
    return true;
  }
  function apply(){
    var list=cards.slice();
    if(state.order==='az') list.sort(function(a,b){return (a.dataset.sort||a.dataset.title).localeCompare(b.dataset.sort||b.dataset.title,'es');});
    else if(state.order==='recientes') list.sort(function(a,b){return b.dataset.date.localeCompare(a.dataset.date);});
    else if(state.order==='menor') list.sort(function(a,b){return (+a.dataset.reading)-(+b.dataset.reading);});
    var shown=0;
    list.forEach(function(c){ var ok=matches(c); c.style.display=ok?'':'none'; if(ok) shown++; grid.appendChild(c); });
    var cnt=document.querySelector('[data-count]'); if(cnt) cnt.textContent=shown+' de '+cards.length+' artículos';
  }
  var s=document.querySelector('[data-search]'); if(s) s.addEventListener('input',function(){state.q=this.value.trim().toLowerCase(); apply();});
  document.addEventListener('click',function(e){
    var ft=e.target.closest('[data-filtros]');
    if(ft){ e.preventDefault(); var f=document.getElementById('filtros'); var open=f.classList.toggle('open'); ft.setAttribute('aria-expanded',open?'true':'false'); ft.textContent=open?'Ocultar filtros':'Filtros y temáticas'; return; }
    var rnd=e.target.closest('[data-random]');
    if(rnd){ e.preventDefault(); var vis=cards.filter(matches); if(vis.length){ var href=vis[Math.floor(Math.random()*vis.length)].getAttribute('href'); if(href) location.href=href; } return; }
    var map={'data-order':'order','data-dur':'dur','data-cat':'cat'};
    var b=e.target.closest('[data-order],[data-dur],[data-cat]'); if(!b) return;
    Object.keys(map).forEach(function(attr){
      if(b.hasAttribute(attr)){
        state[map[attr]]=b.getAttribute(attr);
        b.parentNode.querySelectorAll('['+attr+']').forEach(function(x){x.classList.remove('is-on');});
        b.classList.add('is-on');
      }
    });
    if(b.hasAttribute('data-cat')){
      var head=document.getElementById('theme-head'), cov=document.getElementById('theme-cover'), intro=document.getElementById('theme-intro');
      var it=b.getAttribute('data-intro')||'', cv=b.getAttribute('data-cover')||'';
      if(intro) intro.textContent=it;
      if(cov){ if(cv){ cov.src=cv; cov.style.display=''; } else { cov.removeAttribute('src'); cov.style.display='none'; } }
      if(head) head.style.display=(it||cv)?'':'none';
    }
    apply();
  });
  apply();
})();
