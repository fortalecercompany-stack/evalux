/* EVALUX · estado de la aplicación y utilidades */
const S={role:null,yo:null,view:'inicio',pop:null,off:0,cargando:false,
 cfg:{periodo:'',aprueba:3.0,inactividad:20,advertencias:2,maxImgs:3},
 FAC:{},facId:{},docentes:[],resumen:null,actividad:[],
 estudiantes:[],grupos:[],examenes:[],intentos:{},banco:[],avisos:[],progreso:[],
 exFiltro:'todos',bFiltro:'',repGrupo:null,editor:null,leidos:new Set(),marca:{institucion:'',color:'#2B3A8C',logo_url:'',contacto:''}};
const SEDES=['Riohacha (principal)','Maicao','Fonseca','Villanueva','Manaure/Uribia'];
const PAL=['var(--a1)','var(--a2)','var(--a3)','var(--a4)','var(--a5)','var(--coral)','var(--brand)'];
const PALHEX=['#2F6FB7','#D0672A','#178A6E','#7048C8','#B83280','#E0562F','#2B3A8C'];
const facDe=p=>Object.keys(S.FAC).find(f=>S.FAC[f].includes(p))||'';
const ahora=()=>new Date(Date.now()+S.off);
const addMin=(d,m)=>new Date(d.getTime()+m*60000);
let seq=100;const uid=p=>p+(++seq)+'-'+Math.random().toString(36).slice(2,6);
const svgURI=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
const clone=o=>JSON.parse(JSON.stringify(o));

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(s){return String(s||'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim().replace(/\s+/g,' ')}
const $=s=>document.querySelector(s);
const fmt=d=>d?new Date(d).toLocaleString('es-CO',{weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'—';
const fcorta=d=>new Date(d).toLocaleDateString('es-CO',{day:'numeric',month:'short'}).replace('.','');
const hora=d=>new Date(d).toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit'});
const mes=d=>new Date(d).toLocaleString('es-CO',{month:'short'}).replace('.','');
const hace=d=>{const m=Math.max(0,Math.round((ahora()-new Date(d))/60000));return m<1?'hace un momento':m<60?`hace ${m} min`:m<1440?`hace ${Math.round(m/60)} h`:`hace ${Math.round(m/1440)} día${Math.round(m/1440)===1?'':'s'}`};
const toLocalInput=d=>{if(!d)return '';const x=new Date(d),p=n=>String(n).padStart(2,'0');return `${x.getFullYear()}-${p(x.getMonth()+1)}-${p(x.getDate())}T${p(x.getHours())}:${p(x.getMinutes())}`};
const iniciales=n=>{const w=String(n||'?').split(' ').filter(Boolean);return (w.length>=3?[w[0],w[w.length-2]]:w.slice(0,2)).map(x=>x[0]).join('').toUpperCase()||'?'};
const corto=n=>{const w=String(n||'').split(' ');return w.length>=3?w[0]+' '+w[w.length-2]:String(n||'')};
const nota1=n=>(+n).toFixed(1).replace('.',',');
const avatar=(n,sz=36)=>{let h=0;for(const c of String(n||'?'))h=(h*7+c.charCodeAt(0))%PALHEX.length;return `<span class="avatar" style="width:${sz}px;height:${sz}px;background:${PALHEX[h]}" aria-hidden="true">${esc(iniciales(n))}</span>`};
function toast(msg,icon='checkc'){const r=$('#toast-root');r.innerHTML=`<div class="toast" role="status">${ic(icon,'sm')}${esc(msg)}</div>`;clearTimeout(toast.t);toast.t=setTimeout(()=>r.innerHTML='',4200)}
function seeded(str){let h=0;for(const c of String(str))h=(h*31+c.charCodeAt(0))|0;return()=>{h=(h*1103515245+12345)|0;return((h>>>16)&0x7fff)/0x7fff}}
function barajar(arr,seed){const r=seeded(seed),a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const cierre=e=>e.apertura?addMin(new Date(e.apertura),+e.dur):null;
function estadoExamen(e){if(e.estado==='borrador'||!e.apertura)return 'borrador';const a=new Date(e.apertura),c=cierre(e),n=ahora();if(n<a)return 'programado';if(n<c)return 'en curso';return 'cerrado'}
const intentosDe=e=>Object.keys(S.intentos).filter(k=>k.startsWith(e.id+'|')).map(k=>S.intentos[k]);
const presentados=e=>intentosDe(e).length;
const bloqueado=e=>presentados(e)>0;
const nPreg=e=>e.preg?e.preg.length:(e.n||0);
const PILL_EX={borrador:'p-mute',programado:'p-info','en curso':'p-hot live',cerrado:'p-ok'};
const TK_EX={borrador:'#5C6283',programado:'#2B3A8C','en curso':'#E0562F',cerrado:'#1F7A4D'};
const cap=s=>s?s[0].toUpperCase()+s.slice(1):'';
const TIPO={sel:['Selección múltiple','ty-sel'],com:['Completar','ty-com'],rel:['Relacionar','ty-rel']};
const PCOL=['#E0562F','#2F6FB7','#178A6E','#7048C8','#B83280','#D0672A','#2B3A8C','#1F7A4D'];
const NIV=['Bajo','Básico','Alto','Superior'];
const nivel=n=>n<S.cfg.aprueba?0:n<4?1:n<4.6?2:3;
const lvTag=n=>`<span class="lv lv${nivel(n)}">${NIV[nivel(n)]}</span>`;
const NIVCOL=['var(--n1)','var(--n2)','var(--n3)','var(--n4)'];
const RX_MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const promedio=v=>v.length?v.reduce((a,b)=>a+b,0)/v.length:null;
// Puntaje de una pregunta ya calificada (el servidor guarda la parte obtenida en "puntos")
function puntaje(q,r,it){if(it&&it.puntos&&it.puntos[q.id]!=null)return +it.puntos[q.id];
 if(q.tipo==='sel')return r===q.ok?1:0;if(q.tipo==='com')return (q.resp||[]).some(v=>norm(v)===norm(r))?1:0;if(q.tipo==='rel'&&Array.isArray(r))return q.pares.filter((p,i)=>r[i]===i).length/q.pares.length;return 0}
function comprimir(file,max=1280,cal=.85){return new Promise((ok,fail)=>{if(!/^image\//.test(file.type))return fail('El archivo no es una imagen.');if(file.size>8e6)return fail('La imagen pesa más de 8 MB.');
 const rd=new FileReader();rd.onerror=()=>fail('No se pudo leer la imagen.');rd.onload=()=>{if(file.type==='image/svg+xml'||file.type==='image/gif')return ok({url:rd.result,blob:file,tipo:file.type,ext:file.type==='image/gif'?'gif':'svg'});const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);const url=c.toDataURL('image/jpeg',cal);c.toBlob(b=>ok({url,blob:b,tipo:'image/jpeg',ext:'jpg'}),'image/jpeg',cal)};im.onerror=()=>fail('La imagen está dañada.');im.src=rd.result};rd.readAsDataURL(file)})}
function zoom(src){if(src)$('#lb-root').innerHTML=`<div class="lightbox" data-act="lb-close" role="dialog" aria-label="Imagen ampliada"><img src="${esc(src)}" alt="Imagen ampliada"></div>`}
function modal({title,body,foot,size='',icon}){$('#modal-root').innerHTML=`<div class="modal" data-act="modal-bg"><div class="dialog ${size}" role="dialog" aria-modal="true" aria-labelledby="mdl-t"><header>${icon?`<span class="chipi ${icon[1]||'cb'}">${ic(icon[0])}</span>`:''}<h2 id="mdl-t">${esc(title)}</h2><button class="btn ghost icon" data-act="close" aria-label="Cerrar">${ic('x')}</button></header><div class="body">${body}</div>${foot?`<footer>${foot}</footer>`:''}</div></div>`;
 const f=$('#modal-root .body input:not([type=file]):not([type=checkbox]):not([type=radio]),#modal-root .body select,#modal-root .body textarea,#modal-root footer .btn.pri');f&&f.focus();}
const closeModal=()=>$('#modal-root').innerHTML='';
function confirmar(title,msg,okText,fn){modal({title,size:'sm',icon:['alert','cbad'],body:`<p>${msg}</p>`,foot:`<button class="btn" data-act="close">Cancelar</button><button class="btn pri" id="cf-ok">${esc(okText)}</button>`});$('#cf-ok').onclick=()=>{closeModal();fn()}}
// Botón ocupado mientras se espera a la base de datos
async function ocupado(btn,fn){if(btn){if(btn.dataset.busy)return;btn.dataset.busy='1';btn.setAttribute('aria-busy','true');btn.classList.add('busy')}
 try{return await fn()}catch(e){toast(mensaje(e),'alert');console.warn(e)}finally{if(btn){delete btn.dataset.busy;btn.removeAttribute('aria-busy');btn.classList.remove('busy')}}}
function mensaje(e){const m=String((e&&e.message)||e||'');
 if(/Failed to fetch|NetworkError|Load failed/i.test(m))return 'No hay conexión con el servidor. Revise su internet e intente de nuevo.';
 if(/JWT|expired|session/i.test(m))return 'Su sesión venció. Salga y vuelva a entrar.';
 if(/permission denied|row-level security|violates row-level/i.test(m))return 'No tiene permiso para hacer esto.';
 return m||'Ocurrió un error. Intente de nuevo.'}
function descargarExcel(nombre,hojas){if(typeof XLSX==='undefined'){toast('No se pudo preparar el Excel. Revise su internet.','alert');return}
 const wb=XLSX.utils.book_new();hojas.forEach(([n,filas])=>XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(filas.length?filas:[{'Sin datos':''}]),n.slice(0,31)));
 XLSX.writeFile(wb,nombre.replace(/[\\/:*?"<>|]/g,'-')+'.xlsx');toast('Excel descargado','file')}
