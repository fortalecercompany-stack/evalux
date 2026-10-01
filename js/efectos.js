/* EVALUX 1.2 · efectos de movimiento
   Todo es decorativo: si algo falla aquí, el programa sigue funcionando igual.
   - La barra superior se compacta al bajar.
   - Una línea coral se desliza hasta la sección activa del menú.
   - Las cifras de las tarjetas cuentan desde cero al abrir una sección.
   - Las tarjetas aparecen subiendo, en cascada, al entrar en pantalla.
   - Los botones dejan una onda donde se tocan.
   Quien tenga activado "reducir movimiento" en su equipo no ve animaciones. */
(function(){
  const quieto=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ultimaVista='',indPrev=null,obs=null;

  // Barra superior compacta al desplazarse
  const alBajar=()=>document.documentElement.classList.toggle('bajo',scrollY>24);
  addEventListener('scroll',alBajar,{passive:true});alBajar();

  // Menús desplegables: cerrar al tocar fuera
  document.addEventListener('click',ev=>{if(!ev.target.closest('.nv'))document.querySelectorAll('.nv.open').forEach(x=>{x.classList.remove('open');x.firstElementChild&&x.firstElementChild.setAttribute('aria-expanded','false')})});

  // Onda en los botones
  document.addEventListener('pointerdown',ev=>{if(quieto())return;const b=ev.target.closest('.btn,.tab,.dd-it,.fab');if(!b||b.getAttribute('aria-disabled')==='true')return;
    const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,o=document.createElement('span');o.className='onda';
    o.style.cssText=`width:${d}px;height:${d}px;left:${ev.clientX-r.left-d/2}px;top:${ev.clientY-r.top-d/2}px`;b.appendChild(o);setTimeout(()=>o.remove(),650)},{passive:true});

  // Línea que se desliza bajo la pestaña activa
  function indicador(){const tabs=document.querySelector('.top .tabs'),ind=tabs&&tabs.querySelector('.ind');if(!ind)return;
    const a=tabs.querySelector('.tab[aria-current="page"]');if(!a){ind.style.opacity=0;return}
    const ra=a.getBoundingClientRect(),rt=tabs.getBoundingClientRect(),x=ra.left-rt.left+12,w=ra.width-24;
    if(indPrev&&!quieto()){ind.style.transition='none';ind.style.transform=`translateX(${indPrev.x}px)`;ind.style.width=indPrev.w+'px';ind.offsetWidth;ind.style.transition=''}
    ind.style.opacity=1;ind.style.transform=`translateX(${x}px)`;ind.style.width=w+'px';indPrev={x,w}}

  // Cifras que cuentan
  function contar(el){const t=el.firstChild;if(!t||t.nodeType!==3)return;const txt=t.nodeValue.trim(),m=txt.match(/^(\d+)(?:,(\d))?$/);if(!m)return;
    const fin=parseFloat(m[1]+'.'+(m[2]||0)),dec=m[2]?1:0,t0=performance.now(),dur=900;
    const paso=n=>{const k=Math.min(1,(n-t0)/dur),e=1-Math.pow(1-k,3),v=fin*e;t.nodeValue=dec?v.toFixed(1).replace('.',','):String(Math.round(v));if(k<1)requestAnimationFrame(paso)};
    t.nodeValue=dec?'0,0':'0';requestAnimationFrame(paso)}

  // Aparición en cascada
  const SEL='main .card, main .ticket, main .tbl-wrap, main .q, main .seat, main .rev, main .add-tile';
  function aparecer(nueva){if(obs){obs.disconnect();obs=null}
    if(!nueva||quieto()||!('IntersectionObserver' in window))return;
    const els=[...document.querySelectorAll(SEL)];let i=0;
    obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const el=e.target;el.style.animationDelay=Math.min(i++,8)*55+'ms';el.classList.add('rv');obs&&obs.unobserve(el)}});i=0},{rootMargin:'0px 0px -30px 0px'});
    els.forEach(el=>obs.observe(el))}

  function tras(){const key=typeof S!=='undefined'?(S.role||'')+'|'+(S.view||'')+'|'+(S.exam?'x':'')+'|'+(S.cargando?'c':''):'';const nueva=key!==ultimaVista;ultimaVista=key;
    const h=document.querySelector('main>.hero:first-child');document.documentElement.classList.toggle('con-hero',!!h);
    if(h&&nueva)h.classList.add('entra');
    indicador();
    if(nueva&&!quieto())document.querySelectorAll('main .tile .v').forEach(contar);
    aparecer(nueva)}
  let pend=false;
  function programar(){if(pend)return;pend=true;requestAnimationFrame(()=>{pend=false;try{tras()}catch(e){}})}
  document.addEventListener('DOMContentLoaded',()=>{const app=document.getElementById('app');if(!app)return;new MutationObserver(m=>{if(m.some(r=>r.target===app))programar()}).observe(app,{childList:true});programar()});
  addEventListener('resize',()=>{indPrev=null;indicador()});
})();
