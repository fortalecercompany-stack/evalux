/* EVALUX · navegación, ingreso, avisos, carga desde Excel y eventos */
const NAV={admin:[['inicio','Inicio','home'],['docentes','Docentes','users'],['facultades','Facultades','school'],['reportes','Reportes','chart'],['avisos','Avisos','mega'],['config','Configuración','gear']],
 docente:[['inicio','Inicio','home'],['grupos','Grupos','group'],['examenes','Exámenes','exam'],['banco','Banco','bank'],['reportes','Reportes','chart'],['avisos','Avisos','mega']],
 estudiante:[['inicio','Mis exámenes','exam'],['progreso','Mi progreso','trend'],['avisos','Avisos','mega']]};
// Menú de escritorio: algunas secciones se agrupan en menús desplegables (estilo banca en línea)
const NAVG={admin:[['inicio','Inicio','home'],['g-personas','Personas','users',[['docentes','Docentes','users','c1','Registrar, editar o restringir docentes'],['facultades','Facultades y programas','school','c3','La lista oficial de pregrado']]],['reportes','Reportes','chart'],['avisos','Avisos','mega'],['config','Configuración','gear']],
 docente:[['inicio','Inicio','home'],['g-grupos','Grupos','group',[['grupos','Mis grupos','group','c1','Estudiantes por asignatura'],['cierre','Cerrar semestre','archive','cbad','Respaldo en Excel y limpieza del periodo']]],['g-examenes','Exámenes','exam',[['examenes','Mis exámenes','exam','c2','Programar, vigilar y calificar'],['banco','Banco de preguntas','bank','c4','Preguntas guardadas para reutilizar'],['@ex-new','Crear examen','plus','cc','Empezar uno nuevo ahora']]],['reportes','Reportes','chart'],['avisos','Avisos','mega']],
 estudiante:NAV.estudiante};
const ddHijo=([v,l,i,c,d])=>`<button class="dd-it" role="menuitem" ${v[0]==='@'?`data-act="${v.slice(1)}"`:`data-act="nav" data-v="${v}"`}><span class="chipi ${c}">${ic(i,'sm')}</span><span><b>${esc(l)}</b><small>${esc(d)}</small></span></button>`;
function menuTabs(cur){return NAVG[S.role].map(([k,l,i,h])=>{if(!h)return `<button class="tab" data-act="nav" data-v="${k}" ${cur===k?'aria-current="page"':''}>${esc(l)}</button>`;
 const act=h.some(x=>x[0]===cur);return `<div class="nv"><button class="tab" data-act="navdd" aria-haspopup="true" aria-expanded="false" ${act?'aria-current="page"':''}>${esc(l)}${ic('chevD','sm')}</button><div class="dd" role="menu"><div class="dd-in">${h.map(ddHijo).join('')}</div></div></div>`}).join('')+'<span class="ind" aria-hidden="true"></span>'}
const doc=()=>aDocente(S.yo);
const est=()=>aEstudiante(S.yo);
function yo(){if(S.role==='admin')return{n:[S.yo.nombres,S.yo.apellidos].join(' ').trim(),r:'Administrador'};if(S.role==='docente'){const d=doc();return{n:d.nombres.split(' ')[0]+' '+d.apellidos.split(' ')[0],r:'Docente'}}const s=est();return{n:corto(s.nombre),r:'Estudiante · '+s.codigo}}
const misAvisos=()=>S.avisos;
function notifs(){const n=misAvisos().slice(0,12).map(a=>({id:a.id,icon:'mega',c:'cc',t:a.titulo,s:hace(a.fecha),go:'avisos'}));
 if(S.role==='docente')misEx().filter(e=>estadoExamen(e)==='en curso').forEach(e=>n.unshift({id:'x'+e.id+presentados(e),icon:'clock',c:'c2',t:e.titulo+' está en curso',s:presentados(e)+' estudiantes han entrado',go:'sala',ex:e.id}));
 if(S.role==='estudiante')exDeEst().filter(e=>estadoExamen(e)==='en curso'&&!miIntento(e)).forEach(e=>n.unshift({id:'x'+e.id,icon:'exam',c:'c2',t:e.titulo+' está disponible',s:'Termina a las '+hora(cierre(e)),go:'inicio'}));
 return n}
const leidosKey=()=>'evalux-leidos-'+(S.yo&&S.yo.id);
function cargarLeidos(){try{S.leidos=new Set(JSON.parse(localStorage.getItem(leidosKey())||'[]'))}catch(_){S.leidos=new Set()}}
function guardarLeidos(){try{localStorage.setItem(leidosKey(),JSON.stringify([...S.leidos].slice(-200)))}catch(_){}}

function render(){const app=$('#app');
 if(!configurado){app.innerHTML=vSinConexion();return}
 if(!S.role){app.innerHTML=vLogin();return}
 if(S.primer){app.innerHTML=vPrimer();return}
 if(S.exam){app.innerHTML=vExam();pintarMarca();return}
 const u=yo(),V={admin:{inicio:vAdminInicio,docentes:vDocentes,facultades:vFacultades,reportes:vAdminReportes,avisos:vAvisos,config:vConfig},docente:{inicio:vDocInicio,grupos:vGrupos,examenes:vExamenes,editor:vEditor,resultados:vResultados,sala:vSala,banco:vBanco,reportes:vDocReportes,avisos:vAvisos,cierre:vCierre},estudiante:{inicio:vEstInicio,resultado:vEstResultado,revision:vRevision,progreso:vProgreso,avisos:vAvisos}};
 const cur=['editor','resultados','sala'].includes(S.view)?'examenes':['resultado','revision'].includes(S.view)?'inicio':S.view,curD=cur==='cierre'?'grupos':cur,nt=S.cargando?0:notifs().filter(x=>!S.leidos.has(x.id)).length;
 const vista=V[S.role][S.view]||V[S.role].inicio;
 app.innerHTML=`<header class="top"><div class="top-in"><button class="logo" data-act="nav" data-v="inicio" aria-label="Ir al inicio">${MARK(36)}<span>Eval<b>ux</b></span>${S.marca.institucion?`<span class="inst">${esc(S.marca.institucion)}</span>`:''}</button>
 <nav class="tabs" aria-label="Secciones">${menuTabs(cur)}</nav><span class="spacer"></span>
 <button class="iconbtn" data-act="bell" aria-label="Notificaciones${nt?', '+nt+' sin leer':''}" aria-expanded="${S.pop==='bell'}">${ic('bell')}${nt?`<span class="dot">${nt}</span>`:''}</button>
 <button class="me" data-act="menu" aria-label="Menú de la cuenta" aria-expanded="${S.pop==='menu'}">${avatar(u.n)}<span style="text-align:left"><span class="n" style="display:block">${esc(u.n)}</span><span class="r">${esc(u.r)}</span></span></button>${S.pop&&S.pop!=='ayuda'?vPop():''}</div></header>
 <main id="main">${S.cargando?vCargando():vista()}</main>
 <nav class="dock" aria-label="Secciones">${NAV[S.role].map(([k,l,i])=>`<button data-act="nav" data-v="${k}" ${curD===k?'aria-current="page"':''}>${ic(i)}${esc(l)}</button>`).join('')}</nav>
 <button class="fab" data-act="ayuda" aria-expanded="${S.pop==='ayuda'}" aria-label="Ayuda rápida">${ic(S.pop==='ayuda'?'x':'help')}<span>Ayuda</span></button>${S.pop==='ayuda'?vAyuda():''}`;
 if(S.view==='editor'&&!S.cargando)actualizarResumen();
}
const vCargando=()=>`${hero('','Un momento…','Estamos trayendo su información.')}<div class="bento">${[1,2,3,4].map(()=>'<div class="card tile s3 skel"></div>').join('')}<div class="card s12 skel" style="min-height:220px"></div></div>`;
function vSinConexion(){return `<div class="login">${ladoMarca()}<section class="login-form"><div class="login-box"><h1>Falta conectar la base de datos</h1><p class="muted">Abra el archivo <b>config.js</b> y pegue la dirección y la llave publicable de su proyecto de Supabase, como indica la guía de instalación.</p></div></section></div>`}
function vPop(){if(S.pop==='menu'){const r=S.role;return `<div class="pop" role="menu"><div style="display:flex;gap:12px;align-items:center;padding:10px 12px">${avatar(yo().n,44)}<div style="min-width:0"><b>${esc(yo().n)}</b><div class="small muted" style="overflow-wrap:anywhere">${esc(S.yo.email)}</div></div></div>
 <button class="it" data-act="perfil" role="menuitem"><span class="chipi cb">${ic('user','sm')}</span><span><b>Mi perfil</b><br><span class="small muted">Sus datos${r!=='estudiante'?' y contraseña':''}</span></span></button>
 <button class="it" data-act="tema" role="menuitem"><span class="chipi c4">${ic('eye','sm')}</span><span><b>Cambiar tema</b><br><span class="small muted">Claro u oscuro</span></span></button>
 <button class="it" data-act="logout" role="menuitem"><span class="chipi cbad">${ic('logout','sm')}</span><span><b>Cerrar sesión</b><br><span class="small muted">También se cierra sola tras ${S.cfg.inactividad} min sin uso</span></span></button></div>`}
 const n=notifs();return `<div class="pop"><h4>Notificaciones</h4>${n.length?n.map(x=>`<button class="it" data-act="notif" data-go="${x.go}" data-ex="${x.ex||''}" data-id="${x.id}"><span class="chipi ${x.c}">${ic(x.icon,'sm')}</span><span style="min-width:0"><b>${esc(x.t)}</b><br><span class="small muted">${esc(x.s)}</span></span></button>`).join(''):'<p class="empty small">No tiene notificaciones.</p>'}</div>`}
// Ayuda rápida: botón flotante con preguntas frecuentes que se despliegan
const AYUDA={admin:[['¿Cómo registro a un docente?','En <b>Personas › Docentes</b> pulse <b>Registrar docente</b>, o cargue varios con Excel. Su contraseña inicial es su número de documento.','docentes'],
 ['Un docente olvidó su contraseña','Búsquelo en Docentes y use <b>Restablecer contraseña</b>. Vuelve a ser su documento y al entrar crea una nueva.','docentes'],
 ['¿Cómo pongo el nombre y el logo de mi institución?','En <b>Configuración › Su institución</b>. Se ve desde la pantalla de ingreso.','config'],
 ['¿Por qué no veo las notas de los estudiantes?','Por privacidad, el administrador solo ve cifras generales. Cada docente ve las notas de sus grupos.','reportes']],
 docente:[['¿Cómo creo y programo un examen?','En <b>Exámenes › Crear examen</b>. Escriba las preguntas o tráigalas del banco o de Excel, elija los grupos, la fecha y la duración, y pulse <b>Programar</b>.','examenes'],
 ['Un estudiante necesita más tiempo','Abra los <b>Resultados</b> o la <b>Sala en vivo</b> del examen, toque al estudiante y use <b>Darle más tiempo</b>. Sirve aunque no haya entrado.','examenes'],
 ['¿Cómo subo preguntas desde Excel?','En el editor del examen pulse <b>Importar desde Excel</b> y descargue la plantilla. Llénela y súbala.','examenes'],
 ['Terminó el semestre, ¿qué hago?','En <b>Grupos › Cerrar semestre</b>: descargue el respaldo de notas y borre exámenes, grupos y estudiantes del periodo.','cierre']],
 estudiante:[['¿Cuál es mi contraseña?','Su código estudiantil. No cambia.'],
 ['Se fue el internet en pleno examen','Siga respondiendo: sus respuestas se guardan en el equipo y se envían cuando vuelva la conexión. Puede volver a entrar mientras no se acabe el tiempo.'],
 ['¿Cuándo veo las respuestas correctas?','Su nota sale al entregar. Las respuestas correctas aparecen cuando termina el tiempo del examen para todos.'],
 ['¿Qué pasa si salgo de la ventana del examen?','La primera vez sale una advertencia. La segunda, el examen se cierra. Solo su docente puede habilitarlo de nuevo.']]};
function vAyuda(){const c=S.marca.contacto;return `<div class="ayuda-panel" role="dialog" aria-label="Ayuda rápida"><div class="ap-h"><b>¿En qué le ayudamos?</b><span class="small">Toque una pregunta para ver la respuesta.</span></div>
 <div class="ap-b">${(AYUDA[S.role]||[]).map(([q,r,v],i)=>`<details class="acc"${i===0?' open':''}><summary>${q}${ic('chevD','sm')}</summary><div class="acc-b"><p>${r}</p>${v?`<button class="btn sm" data-act="nav" data-v="${v}">Ir allí ${ic('arrowR','sm')}</button>`:''}</div></details>`).join('')}</div>
 ${c?`<div class="ap-f small">${ic('mega','sm')}<span>¿Necesita más ayuda? Escriba a <b>${esc(c)}</b></span></div>`:''}</div>`}
function go(v,extra){Object.assign(S,extra||{});S.view=v;S.pop=null;render();window.scrollTo({top:0})}
async function refrescar(v){try{await cargarTodo()}catch(e){toast(mensaje(e),'alert')}if(v)go(v);else render()}

/* ---------- ingreso ---------- */
// Lado izquierdo del ingreso: solo el escudo y el logo, sobre la franja de color que se mueve
const ladoMarca=()=>`<section class="login-lado"><i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i>${ESCUDO}<div class="brand-big">${MARK(46)}<span>Eval<b>ux</b></span></div></section>`;
function vLogin(){const m=S.marca;return `<div class="login">${ladoMarca()}
 <section class="login-form"><form class="login-box" data-form="login" novalidate>${m.institucion||m.logo_url?`<div class="inst-row">${m.logo_url?`<img src="${esc(m.logo_url)}" alt="">`:''}${m.institucion?`<span>${esc(m.institucion)}</span>`:''}</div>`:''}<div><div class="eyebrow">Bienvenido</div><h1 style="margin-top:6px">Ingresar</h1></div>
  <label class="field"><span>Correo institucional</span><input type="email" id="lg-correo" autocomplete="username" placeholder="nombre@uniguajira.edu.co"></label>
  <div class="field"><label for="lg-clave" class="lbl">Contraseña</label><span class="pwd"><input type="password" id="lg-clave" autocomplete="current-password"><button type="button" class="iconbtn" data-act="ver-clave" aria-label="Mostrar contraseña">${ic('eye','sm')}</button></span></div>
  <p class="err" id="lg-err" role="alert" hidden></p>
  <button class="btn pri big" type="submit" id="lg-btn">Ingresar ${ic('arrowR','sm')}</button>
  <button type="button" class="linkbtn small" data-act="olvide" style="align-self:flex-start">Olvidé mi contraseña</button>
  <div class="card ayuda-login"><span class="lbl">¿Cuál es mi contraseña?</span>
   <div class="row small" style="flex-wrap:nowrap;align-items:flex-start;gap:10px"><span class="chipi c3">${ic('exam','sm')}</span><span><b>Estudiantes:</b> su código estudiantil.</span></div>
   <div class="row small" style="flex-wrap:nowrap;align-items:flex-start;gap:10px"><span class="chipi c1">${ic('edit','sm')}</span><span><b>Docentes:</b> la primera vez, su número de documento. Luego, la que usted creó.</span></div>${m.contacto?`<div class="row small" style="flex-wrap:nowrap;align-items:flex-start;gap:10px"><span class="chipi cc">${ic('mega','sm')}</span><span>¿No logra entrar? Escriba a <b>${esc(m.contacto)}</b>.</span></div>`:''}</div>
  <a class="conozca" href="presentacion.html">Conozca Evalux para su institución ${ic('arrowR','sm')}</a>
 </form></section></div>`}
async function login(){const c=$('#lg-correo').value.trim().toLowerCase(),k=$('#lg-clave').value,e=$('#lg-err'),fail=m=>{e.textContent=m;e.hidden=false};
 if(!c||!k)return fail('Escriba su correo y su contraseña.');
 await ocupado($('#lg-btn'),async()=>{const {error}=await sb.auth.signInWithPassword({email:c,password:k});
  if(error){if(/banned/i.test(error.message))return fail('Su cuenta está restringida. Comuníquese con el administrador.');if(/Invalid login|credentials/i.test(error.message))return fail('El correo o la contraseña no coinciden. Revíselos e intente de nuevo.');return fail(mensaje(error))}
  await iniciarSesion()})}
async function iniciarSesion(){const {data}=await sb.auth.getSession(),ses=data&&data.session;if(!ses){S.role=null;render();return}
 let p=null;try{p=(await q(sb.from('perfiles').select('*').eq('id',ses.user.id)))[0]}catch(e){toast(mensaje(e),'alert')}
 if(!p||!p.activo){await sb.auth.signOut();S.role=null;render();const e=$('#lg-err');if(e){e.textContent=p?'Su cuenta está restringida. Comuníquese con el administrador.':'Su usuario existe pero no tiene cargo en Evalux. Pida ayuda al administrador.';e.hidden=false}return}
 S.yo=p;S.role=p.rol;S.view='inicio';S.primer=p.rol==='docente'&&p.debe_cambiar_clave;S.exam=null;S.editor=null;cargarLeidos();
 if(S.primer){render();return}
 S.cargando=true;render();try{await cargarTodo()}catch(e){toast(mensaje(e),'alert')}S.cargando=false;render();ultimo=Date.now()}
async function salir(msg){S.exam=null;S.editor=null;S.primer=false;S.pop=null;S.role=null;S.yo=null;closeModal();try{await sb.auth.signOut()}catch(_){}render();if(msg)toast(msg,'lock')}
function olvide(){modal({title:'Recuperar la contraseña',size:'sm',icon:['key','cc'],body:`<ul class="list">
 <li><span class="chipi c3">${ic('exam','sm')}</span><span><b>Estudiantes:</b> su contraseña es su <b>código estudiantil</b> y no cambia. Si no entra, revise con su docente que su correo y código estén bien escritos.</span></li>
 <li><span class="chipi c1">${ic('edit','sm')}</span><span><b>Docentes:</b> pida al administrador de Evalux que <b>restablezca su contraseña</b>. Volverá a ser su número de documento y al entrar creará una nueva.</span></li></ul>`,foot:'<button class="btn pri" data-act="close">Entendido</button>'})}
function reglas(p,docu){return [[p.length>=8,'Al menos 8 caracteres'],[/[a-záéíóúñ]/i.test(p)&&/\d/.test(p),'Letras y números'],[p!==docu&&p.length>0,'Diferente a su documento']]}
function vPrimer(){const d=doc();return `<div class="login">${ladoMarca()}<section class="login-form"><form class="login-box" data-form="primer" novalidate>
 <div><h1>Bienvenido(a), ${esc(d.nombres.split(' ')[0])}</h1><p class="muted" style="margin-top:8px">Entró con la contraseña inicial, que es su número de documento. Para proteger su cuenta, cree ahora una contraseña propia.</p></div>
 <div class="field"><label for="pc-1" class="lbl">Contraseña nueva</label><input type="password" id="pc-1" autocomplete="new-password"></div><div class="meter" aria-hidden="true"><i id="pc-m" style="width:0"></i></div><div id="pc-r" style="display:flex;flex-direction:column;gap:4px"></div>
 <div class="field"><label for="pc-2" class="lbl">Repita la contraseña</label><input type="password" id="pc-2" autocomplete="new-password"></div><p class="err" id="pc-err" role="alert" hidden></p>
 <button class="btn pri" type="submit" id="pc-btn" style="min-height:50px">Guardar y entrar</button><button class="linkbtn small" type="button" data-act="logout" style="align-self:flex-start">Salir</button></form></section></div>`}
function pintarReglas(){const p=$('#pc-1').value,r=reglas(p,doc().doc),ok=r.filter(x=>x[0]).length;$('#pc-r').innerHTML=r.map(([b,t])=>`<div class="check ${b?'':'no'}">${ic(b?'checkc':'clock','sm')}<span class="small">${t}</span></div>`).join('');$('#pc-m').style.width=ok/3*100+'%';$('#pc-m').style.background=['var(--bad)','var(--warn)','var(--n3)','var(--ok)'][ok]}
async function guardarPrimer(){const p=$('#pc-1').value,p2=$('#pc-2').value,er=$('#pc-err');
 if(reglas(p,doc().doc).some(x=>!x[0])){er.textContent='La contraseña no cumple todas las reglas.';er.hidden=false;return}if(p!==p2){er.textContent='Las dos contraseñas no coinciden.';er.hidden=false;return}
 await ocupado($('#pc-btn'),async()=>{const {error}=await sb.auth.updateUser({password:p});if(error)throw error;await rpc('clave_cambiada');S.yo.debe_cambiar_clave=false;S.primer=false;
  S.cargando=true;render();await cargarTodo();S.cargando=false;render();toast('Contraseña creada. ¡Bienvenido(a) a Evalux!','key')})}

/* ---------- perfil ---------- */
function perfil(){const r=S.role,d=r==='docente'?doc():null,s=r==='estudiante'?est():null;
 const filas=r==='docente'?[['Documento',d.tipodoc+' '+d.doc],['Correo',d.correo],['Sede',d.sede],['Programa',d.prog],['Asignaturas',d.asig.join(', ')],['Vinculación',d.vinc]]:r==='estudiante'?[['Código',s.codigo],['Correo',s.correo],['Programa',s.prog],['Facultad',s.fac],['Semestre',s.semestre+'.°']]:[['Correo',S.yo.email],['Rol','Administrador del sistema']];
 modal({title:'Mi perfil',icon:['user','cb'],body:`<div class="person">${avatar(yo().n,56)}<div><h3>${esc(r==='docente'?d.nombres+' '+d.apellidos:r==='estudiante'?s.nombre:yo().n)}</h3><span class="small muted">${esc(yo().r)}</span></div></div>
 <ul class="list">${filas.map(([k,v])=>`<li><span class="small muted" style="width:120px;flex:none">${k}</span><b style="min-width:0;overflow-wrap:anywhere">${esc(v)}</b></li>`).join('')}</ul>
 ${r==='estudiante'?`<div class="card" style="box-shadow:none;background:var(--brand-soft);color:var(--brand);border:0">${ic('key','sm')} Su contraseña es su código. Si alguien más la conoce, avísele a su docente.</div>`:`<fieldset class="fs"><legend>Cambiar contraseña</legend><div class="form-grid"><label class="field"><span>Contraseña actual</span><input type="password" id="pf-a" autocomplete="current-password"></label><label class="field"><span>Contraseña nueva</span><input type="password" id="pf-n" autocomplete="new-password"><small class="hint">8 caracteres o más, con letras y números.</small></label></div><p class="err" id="pf-err" hidden></p></fieldset>`}`,
 foot:`<button class="btn" data-act="close">Cerrar</button>${r!=='estudiante'?'<button class="btn pri" data-act="pf-save">Cambiar contraseña</button>':''}`})}
async function cambiarClave(btn){const a=$('#pf-a').value,n=$('#pf-n').value,er=$('#pf-err'),fail=m=>{er.textContent=m;er.hidden=false};
 if(reglas(n,S.yo.documento||'').some(x=>!x[0]))return fail('La nueva debe tener 8 caracteres, letras y números, y ser diferente a su documento.');
 await ocupado(btn,async()=>{const {error:e1}=await sb.auth.signInWithPassword({email:S.yo.email,password:a});if(e1)return fail('La contraseña actual no coincide.');
  const {error}=await sb.auth.updateUser({password:n});if(error)return fail(mensaje(error));closeModal();toast('Contraseña cambiada','key')})}

/* ---------- avisos ---------- */
function vAvisos(){const av=misAvisos().slice().sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)),puede=S.role!=='estudiante'&&(S.role==='admin'||misGrupos().length>0);
 return `${hero('Comunicación','Avisos',S.role==='admin'?'Envíe mensajes a todos los docentes.':S.role==='docente'?'Envíe mensajes a sus grupos. Los estudiantes los ven al entrar.':'Mensajes de sus docentes.',puede?`<button class="btn pri" data-act="aviso-new">${ic('plus','sm')}Nuevo aviso</button>`:'','mega')}
 <div class="grid2">${av.map(a=>{const para=a.para==='docentes'?'Todos los docentes':grupoTxt(a.para)||'Un grupo';
  return `<article class="card" style="display:flex;flex-direction:column;gap:10px"><div class="row" style="flex-wrap:nowrap"><span class="chipi ${a.para==='docentes'?'c1':'cc'}">${ic('mega')}</span><div style="flex:1;min-width:0"><h3>${esc(a.titulo)}</h3><span class="small muted">${esc(a.autor)} · ${hace(a.fecha)}</span></div>${(S.role==='admin'||a.de===S.yo.id)?`<button class="btn sm icon ghost danger" data-act="aviso-del" data-id="${a.id}" aria-label="Eliminar aviso">${ic('trash','sm')}</button>`:''}</div><p style="white-space:pre-line">${esc(a.texto)}</p><span class="chip" style="align-self:flex-start">${ic('users','sm')}${esc(para)}</span></article>`}).join('')||`<div class="card empty">${ic('mega','lg')}No hay avisos por ahora.</div>`}</div>`}
function formAviso(){const opts=S.role==='admin'?'<option value="docentes">Todos los docentes</option>':misGrupos().map(g=>`<option value="${g.id}">${esc(g.asig)} · Grupo ${esc(g.codigo)}</option>`).join('');
 modal({title:'Nuevo aviso',icon:['mega','cc'],body:`<label class="field"><span>Para</span><select id="av-para">${opts}</select></label><label class="field"><span>Título</span><input type="text" id="av-t" maxlength="80" placeholder="Examen el jueves"></label><label class="field"><span>Mensaje</span><textarea id="av-x" maxlength="500" placeholder="Escriba el mensaje"></textarea></label><p class="err" id="av-err" hidden></p>`,foot:`<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="aviso-save">${ic('mega','sm')}Publicar aviso</button>`})}
async function guardarAviso(btn){const tt=$('#av-t').value.trim(),x=$('#av-x').value.trim(),er=$('#av-err'),v=$('#av-para').value;if(!tt||!x){er.textContent='Escriba el título y el mensaje.';er.hidden=false;return}
 await ocupado(btn,async()=>{await q(sb.from('avisos').insert({autor_id:S.yo.id,autor:yo().n,para:v==='docentes'?'docentes':'grupo',grupo_id:v==='docentes'?null:v,titulo:tt,texto:x}));closeModal();await refrescar('avisos');toast('Aviso publicado','mega')})}

/* ---------- carga masiva desde Excel ---------- */
const BULK={
 docentes:{titulo:'Cargar docentes desde Excel',cols:['Nombres','Apellidos','Tipo de documento','Documento','Correo institucional','Celular','Sede','Facultad','Programa','Asignaturas','Vinculación'],
  ejemplo:['Milena','Cotes Ariza','CC','1123998877','mcotes@uniguajira.edu.co','3014455667','Villanueva','Ciencias Económicas y Administrativas','Administración de Empresas','Mercadeo; Emprendimiento','Ocasional'],nota:'Varias asignaturas se separan con punto y coma (;). La sede debe ser una de: '+SEDES.join(', ')+'.',
  validar(r,todas){const e=[];if(!r['Nombres']||!r['Apellidos'])e.push('Faltan nombres o apellidos');if(!/^[0-9A-Za-z]{5,12}$/.test(r['Documento']||''))e.push('Documento inválido');if(!RX_MAIL.test(r['Correo institucional']||''))e.push('Correo inválido');if(!SEDES.includes(r['Sede']))e.push('Sede no existe');if(!S.FAC[r['Facultad']])e.push('Facultad no existe');else if(!S.FAC[r['Facultad']].includes(r['Programa']))e.push('Programa no es de esa facultad');if(!r['Asignaturas'])e.push('Sin asignaturas');if(S.docentes.some(d=>d.doc===r['Documento']))e.push('Ya existe');if(todas.filter(x=>x['Documento']===r['Documento']).length>1)e.push('Documento repetido en el archivo');return e},
  persona:r=>({nombres:r['Nombres'],apellidos:r['Apellidos'],tipo_doc:r['Tipo de documento']||'CC',documento:r['Documento'],email:r['Correo institucional'].toLowerCase(),celular:r['Celular'],sede:r['Sede'],facultad:r['Facultad'],programa:r['Programa'],asignaturas:r['Asignaturas'].split(';').map(s=>s.trim()).filter(Boolean),vinculacion:r['Vinculación']||'Catedrático'}),
  async enviar(ps){const r=await usuarios({accion:'crear_docentes',personas:ps});closeModal.bloq=false;closeModal();await refrescar('docentes');credenciales(`${r.creados.length} docente${r.creados.length===1?'':'s'} registrado${r.creados.length===1?'':'s'}`,r.creados,r.errores)}},
 estudiantes:{titulo:'Cargar estudiantes desde Excel',cols:['Nombres y apellidos','Correo institucional','Código','Programa','Semestre','Facultad'],
  ejemplo:['Paola Andrea Ramírez Freyle','pramirez@uniguajira.edu.co','2024110512','Ingeniería de Sistemas','3','Ingeniería'],nota:'La facultad se llena sola según el programa. Si un estudiante ya tiene cuenta (mismo correo y código), solo se agrega al grupo.',
  validar(r,todas){const e=[];if(!r['Nombres y apellidos'])e.push('Falta el nombre');if(!RX_MAIL.test(r['Correo institucional']||''))e.push('Correo inválido');if(!/^\d{6,15}$/.test(r['Código']||''))e.push('Código inválido (6 a 15 números)');const s=+r['Semestre'];if(!(s>=1&&s<=12))e.push('Semestre de 1 a 12');if(!facDe(r['Programa']))e.push('Programa no existe');const x=S.estudiantes.find(z=>z.codigo===r['Código']);if(x&&norm(x.correo)!==norm(r['Correo institucional']))e.push('Código ya usado con otro correo');if(todas.filter(z=>z['Código']===r['Código']).length>1)e.push('Código repetido en el archivo');return e},
  persona:r=>({nombres:r['Nombres y apellidos'],email:r['Correo institucional'].toLowerCase(),codigo:r['Código'],programa:r['Programa'],semestre:+r['Semestre']}),
  async enviar(ps){const r=await usuarios({accion:'agregar_estudiantes',grupo_id:S.grupoSel,personas:ps});closeModal.bloq=false;closeModal();await refrescar('grupos');
   if(r.errores.length)modal({title:'Carga terminada',icon:['upload','c3'],body:`<p><b>${r.agregados.length}</b> estudiante${r.agregados.length===1?'':'s'} agregado${r.agregados.length===1?'':'s'} al grupo.</p><div class="issues"><b>No se pudieron agregar:</b><ul>${r.errores.map(e=>`<li>${esc(e.persona)}: ${esc(e.error)}</li>`).join('')}</ul></div>`,foot:'<button class="btn pri" data-act="close">Listo</button>'});
   else toast(`${r.agregados.length} estudiante${r.agregados.length===1?'':'s'} agregado${r.agregados.length===1?'':'s'} al grupo`,'upload')}},
};
function abrirBulk(tipo){const b=BULK[tipo];S.bulk={tipo,filas:[]};
 modal({title:b.titulo,icon:['upload','c3'],body:`<ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px"><li>Descargue la plantilla y llénela, una persona por fila.</li><li>Súbala aquí y revise la vista previa.</li><li>Importe las filas listas; las que tengan errores se muestran para corregirlas.</li></ol>
 <div class="tbl-wrap" style="box-shadow:none"><table><thead><tr>${b.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody><tr>${b.ejemplo.map(c=>`<td class="small">${esc(c)}</td>`).join('')}</tr></tbody></table></div>
 <p class="small muted">${esc(b.nota)}</p>
 <button type="button" class="btn sm" data-act="bulk-plantilla" style="align-self:flex-start">${ic('file','sm')}Descargar plantilla de Excel</button>
 <label class="drop" data-drop-file><span class="chipi c3">${ic('file')}</span><span><b>Arrastre el archivo aquí o toque para elegirlo</b><br><span class="small muted">Excel o CSV</span></span><input type="file" id="bulk-file" accept=".xlsx,.xls,.csv" class="sr"></label>
 <div id="bulk-prev"></div>`,foot:`<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="bulk-go" id="bulk-go">${ic('upload','sm')}Importar</button>`});}
function plantillaBulk(){const b=BULK[S.bulk.tipo];if(typeof XLSX==='undefined'){toast('No se pudo preparar el Excel. Revise su internet.','alert');return}
 const ws=XLSX.utils.aoa_to_sheet([b.cols,b.ejemplo]);ws['!cols']=b.cols.map(()=>({wch:26}));const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Plantilla');
 if(S.bulk.tipo==='estudiantes'||S.bulk.tipo==='docentes'){const lista=Object.keys(S.FAC).flatMap(f=>S.FAC[f].map(p=>({Facultad:f,Programa:p})));XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(lista),'Programas válidos')}
 XLSX.writeFile(wb,`Plantilla ${S.bulk.tipo} Evalux.xlsx`)}
function previewBulk(rows){const b=BULK[S.bulk.tipo];const limpias=rows.map(r=>{const o={};b.cols.forEach(c=>{const k=Object.keys(r).find(x=>norm(x)===norm(c));o[c]=String(k?r[k]:'').trim()});return o}).filter(o=>Object.values(o).some(Boolean));
 if(S.bulk.tipo==='estudiantes')limpias.forEach(o=>{if(!o['Facultad'])o['Facultad']=facDe(o['Programa'])});
 S.bulk.filas=limpias.map(o=>({r:o,e:b.validar(o,limpias)}));const ok=S.bulk.filas.filter(f=>!f.e.length).length,bad=S.bulk.filas.length-ok;
 $('#bulk-prev').innerHTML=S.bulk.filas.length?`<div class="row"><span class="pill p-ok"><i></i>${ok} lista${ok===1?'':'s'}</span>${bad?`<span class="pill p-bad"><i></i>${bad} con errores (no se importan)</span>`:''}</div>
 <div class="tbl-wrap" style="max-height:260px;overflow:auto;margin-top:10px;box-shadow:none"><table><thead><tr><th>Fila</th>${b.cols.slice(0,3).map(c=>`<th>${esc(c)}</th>`).join('')}<th>Revisión</th></tr></thead><tbody>${S.bulk.filas.map((f,i)=>`<tr><td class="mono">${i+2}</td>${b.cols.slice(0,3).map(c=>`<td class="small">${esc(f.r[c])}</td>`).join('')}<td>${f.e.length?`<span class="pill p-bad"><i></i>${esc(f.e.join(' · '))}</span>`:'<span class="pill p-ok"><i></i>Lista</span>'}</td></tr>`).join('')}</tbody></table></div>`:'<p class="err">El archivo no tiene filas con datos. Revise que la primera fila tenga los títulos de la plantilla.</p>';
 $('#bulk-go').innerHTML=`${ic('upload','sm')}Importar ${ok} fila${ok===1?'':'s'}`}
function leerArchivo(file){const rd=new FileReader();rd.onload=ev=>{try{if(typeof XLSX==='undefined')throw 0;const wb=XLSX.read(new Uint8Array(ev.target.result),{type:'array'});previewBulk(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:'',raw:false}))}catch(e){$('#bulk-prev').innerHTML='<p class="err">No se pudo leer el archivo. Verifique que sea Excel o CSV.</p>'}};rd.readAsArrayBuffer(file)}
async function importarBulk(btn){const b=BULK[S.bulk.tipo],ok=S.bulk.filas.filter(f=>!f.e.length);if(!ok.length){toast('No hay filas listas para importar','alert');return}
 await ocupado(btn,async()=>{btn.innerHTML=`${ic('clock','sm')}Importando ${ok.length}… no cierre la ventana`;closeModal.bloq=true;try{await b.enviar(ok.map(f=>b.persona(f.r)))}finally{closeModal.bloq=false}})}

/* ---------- eventos ---------- */
function imgSrc(key){const t=key[0],[i,j]=key.slice(1).split('-').map(Number),q=S.editor.preg[i];return t==='q'?q.imgs[j]:t==='o'?q.optImgs[j]:q.parImgs[j]}
let ultimo=Date.now();
document.addEventListener('click',ev=>{ultimo=Date.now();
 const t=ev.target.closest('[data-act]');
 if(S.pop&&!ev.target.closest('.pop')&&!ev.target.closest('.ayuda-panel')&&!(t&&['bell','menu','ayuda'].includes(t.dataset.act))){S.pop=null;render();if(!t)return}
 if(!t)return;const a=t.dataset.act,id=t.dataset.id;
 if(t.getAttribute('aria-disabled')==='true'){ev.preventDefault();return}
 if(a==='modal-bg'){if(ev.target===t&&!closeModal.bloq)closeModal();return}
 const E=S.editor,qi=+t.dataset.q,sucio=()=>{S.editorSucio=true};
 const acts={
  close:()=>{if(!closeModal.bloq)closeModal()},'lb-close':()=>$('#lb-root').innerHTML='',
  'ver-clave':()=>{const i=$('#lg-clave');i.type=i.type==='password'?'text':'password';t.setAttribute('aria-label',i.type==='password'?'Mostrar contraseña':'Ocultar contraseña')},
  olvide,
  logout:()=>salir('Sesión cerrada'),
  nav:()=>{if(S.view==='editor'&&S.editorSucio&&t.dataset.v!=='editor'){confirmar('Salir sin guardar','Tiene cambios sin guardar en el examen. ¿Salir de todas formas?','Salir',()=>{S.editor=null;S.editorSucio=false;go(t.dataset.v)});return}go(t.dataset.v)},
  'ed-volver':()=>{if(S.editorSucio){confirmar('Salir sin guardar','Tiene cambios sin guardar en el examen. ¿Salir de todas formas?','Salir',()=>{S.editor=null;S.editorSucio=false;go('examenes')});return}S.editor=null;go('examenes')},
  ayuda:()=>{S.pop=S.pop==='ayuda'?null:'ayuda';render()},
  navdd:()=>{const n=t.closest('.nv'),ab=!n.classList.contains('open');document.querySelectorAll('.nv.open').forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});if(ab){n.classList.add('open');t.setAttribute('aria-expanded','true')}},
  bell:()=>{S.pop=S.pop==='bell'?null:'bell';if(S.pop){notifs().forEach(n=>S.leidos.add(n.id));guardarLeidos()}render()},menu:()=>{S.pop=S.pop==='menu'?null:'menu';render()},
  notif:()=>{if(t.dataset.go==='sala')abrirSala(t.dataset.ex);else go(t.dataset.go)},
  perfil:()=>{S.pop=null;render();perfil()},
  tema:()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('evalux-tema',r.dataset.theme)}catch(_){}S.pop=null;render()},
  'pf-save':()=>cambiarClave(t),
  'doc-new':()=>formDocente(),'doc-edit':()=>formDocente(id),'doc-save':()=>guardarDocente(t),
  'doc-toggle':()=>cambiarEstadoDocente(id),'doc-reset':()=>restablecerDocente(id),
  'doc-del':()=>eliminarDocente(id),'doc-bulk':()=>abrirBulk('docentes'),'f-estado':()=>{S.fEstado=t.dataset.v;go('docentes')},
  'asig-add':()=>{const i=$('#fd-asig-in'),v=i.value.trim();if(v&&!S.formAsig.some(x=>norm(x)===norm(v)))S.formAsig.push(v);i.value='';i.focus();pintarAsig()},
  'asig-del':()=>{S.formAsig.splice(+t.dataset.i,1);pintarAsig()},
  'fac-new':()=>modal({title:'Agregar facultad',size:'sm',icon:['school','c4'],body:'<label class="field"><span>Nombre de la facultad</span><input type="text" id="nf" maxlength="90"></label>',foot:'<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="fac-save">Agregar</button>'}),
  'fac-save':()=>{const v=$('#nf').value.trim();if(!v)return;if(S.FAC[v]){toast('Esa facultad ya existe','alert');return}ocupado(t,async()=>{await q(sb.from('facultades').insert({nombre:v,orden:Object.keys(S.FAC).length+1}));closeModal();await refrescar('facultades');toast('Facultad agregada')})},
  'xls-admin':excelAdmin,'xls-res':excelResultados,'xls-rep':excelReportes,
  'bulk-go':()=>importarBulk(t),'bulk-plantilla':plantillaBulk,
  'aviso-new':formAviso,'aviso-save':()=>guardarAviso(t),
  'aviso-del':()=>confirmar('Eliminar aviso','¿Eliminar este aviso? Nadie lo verá más.','Eliminar',()=>ocupado(null,async()=>{await q(sb.from('avisos').delete().eq('id',id));await refrescar('avisos');toast('Aviso eliminado','trash')})),
  'grp-sel':()=>{S.grupoSel=id;S.fEst='';go('grupos')},'grp-new':formGrupo,'grp-save':()=>guardarGrupo(t),
  'grp-del':()=>{const g=S.grupos.find(x=>x.id===S.grupoSel),usado=S.examenes.some(e=>e.grupos.includes(g.id)&&bloqueado(e));
   if(usado){modal({title:'No se puede eliminar',size:'sm',icon:['alert','c2'],body:'<p>Este grupo ya presentó exámenes. Si lo elimina se perderían sus notas.</p>',foot:'<button class="btn pri" data-act="close">Entendido</button>'});return}
   confirmar('Eliminar grupo',`¿Eliminar <b>${esc(g.asig)} · Grupo ${esc(g.codigo)}</b>? Los estudiantes conservan su cuenta.`,'Eliminar',()=>ocupado(null,async()=>{await q(sb.from('grupos').delete().eq('id',g.id));S.grupoSel=null;await refrescar('grupos');toast('Grupo eliminado','trash')}))},
  'est-new':formEstudiante,'est-save':()=>guardarEstudiante(t),'est-bulk':()=>abrirBulk('estudiantes'),
  'est-quitar':()=>{const s=estDe(id);confirmar('Quitar del grupo',`¿Quitar a <b>${esc(s.nombre)}</b> de este grupo? Su cuenta y sus notas se conservan.`,'Quitar',()=>ocupado(null,async()=>{await q(sb.from('grupo_estudiantes').delete().eq('grupo_id',S.grupoSel).eq('estudiante_id',id));await refrescar('grupos');toast('Estudiante quitado del grupo')}))},
  'ex-new':()=>abrirEditor(null),'ex-edit':()=>abrirEditor(id),'ex-filtro':()=>{S.exFiltro=t.dataset.v;go('examenes')},
  'ex-dup':()=>duplicarExamen(id),
  'ex-del':()=>{const e=S.examenes.find(x=>x.id===id);confirmar('Eliminar examen',`¿Eliminar <b>${esc(e.titulo)}</b>? Nadie lo ha presentado todavía.`,'Eliminar',()=>ocupado(null,async()=>{await rpc('eliminar_examen',{p_id:id});await refrescar('examenes');toast('Examen eliminado','trash')}))},
  'ex-res':()=>go('resultados',{exSel:id}),'ex-sala':()=>abrirSala(id),'sala-act':()=>ocupado(t,async()=>{await cargarIntentosDe(S.exSel);render()}),
  seat:()=>detalleSeat(id),'rep-g':()=>go('reportes',{repGrupo:id}),
  rehab:()=>rehabilitar(id,t),
  'dar-tiempo':()=>darTiempo(id,t),'ex-del-notas':()=>borrarConNotas(id),
  'ci-respaldo':()=>{respaldoPeriodo(S.cierre.periodo);S.cierre.respaldo=true;render()},'ci-borrar':()=>cerrarSemestre(t),
  'q-xls':abrirImportarPreguntas,'qx-plantilla':plantillaPreguntas,'qx-go':agregarImportadas,
  color:()=>{S.marca.color=t.dataset.v;aplicarMarca();document.querySelectorAll('.swatches button').forEach(b=>b.setAttribute('aria-pressed',b===t))},
  'logo-del':()=>{S.marca.institucion=$('#cf-inst').value;S.marca.contacto=$('#cf-contacto').value;S.marca.logo_url='';render();toast('Logo quitado. Pulse Guardar configuración para confirmar.','image')},
  'b-filtro':()=>{S.bFiltro=t.dataset.v;go('banco')},'b-ver':()=>vistaPrevia(S.banco.find(b=>b.id===id)),
  'b-del':()=>confirmar('Quitar del banco','¿Quitar esta pregunta del banco? Los exámenes que ya la usan no cambian.','Quitar',()=>ocupado(null,async()=>{await q(sb.from('banco').delete().eq('id',id));await refrescar('banco');toast('Pregunta quitada del banco','trash')})),
  'bk-open':traerBanco,
  'bk-add':()=>{const ids=[...document.querySelectorAll('[data-bk]:checked')].map(x=>x.dataset.bk);if(!ids.length){toast('Marque al menos una pregunta','alert');return}
   ids.forEach(b=>{const o=S.banco.find(x=>x.id===b);const c=datosPregunta(o);c.id=uid('q');E.preg.push(c);o.usos++;sb.from('banco').update({usos:o.usos}).eq('id',o.id).then(()=>{})});sucio();closeModal();render();toast(ids.length+' pregunta'+(ids.length>1?'s':'')+' agregada'+(ids.length>1?'s':''),'bank')},
  'q-banco':()=>{const q0=E.preg[qi];if(!q0.enun.trim()){toast('Escriba el enunciado antes de guardarla','alert');return}
   ocupado(t,async()=>{const c=datosPregunta(q0);const r=await q(sb.from('banco').insert({docente_id:S.yo.id,asignatura:E.asig,tipo:c.tipo,datos:c,usos:1}).select().single());S.banco.unshift({...c,id:r.id,asig:r.asignatura,docente:r.docente_id,usos:r.usos});toast('Pregunta guardada en el banco','bank')})},
  'q-add':()=>{E.preg.push(nuevaPregunta(t.dataset.t));sucio();render();const qs=document.querySelectorAll('.q');qs[qs.length-1].scrollIntoView({behavior:'smooth',block:'center'})},
  'q-del':()=>confirmar('Eliminar pregunta',`¿Eliminar la pregunta ${qi+1}?`,'Eliminar',()=>{E.preg.splice(qi,1);sucio();render()}),
  'q-up':()=>{[E.preg[qi-1],E.preg[qi]]=[E.preg[qi],E.preg[qi-1]];sucio();render()},'q-down':()=>{[E.preg[qi+1],E.preg[qi]]=[E.preg[qi],E.preg[qi+1]];sucio();render()},
  'q-prev-view':()=>vistaPrevia(E.preg[qi]),
  'opt-add':()=>{E.preg[qi].opts.push('');E.preg[qi].optImgs.push('');sucio();render()},
  'opt-del':()=>{const q0=E.preg[qi],j=+t.dataset.j;q0.opts.splice(j,1);q0.optImgs.splice(j,1);if(q0.ok===j||q0.ok>=q0.opts.length)q0.ok=0;else if(q0.ok>j)q0.ok--;sucio();render()},
  'optimg-del':()=>{E.preg[qi].optImgs[+t.dataset.j]='';sucio();render()},'parimg-del':()=>{E.preg[qi].parImgs[+t.dataset.j]='';sucio();render()},
  'com-add':()=>{const q0=E.preg[qi],i=$('#cr-'+q0.id),v=i.value.trim();if(v&&!q0.resp.some(x=>norm(x)===norm(v)))q0.resp.push(v);sucio();render();$('#cr-'+q0.id).focus()},
  'com-del':()=>{E.preg[qi].resp.splice(+t.dataset.j,1);sucio();render()},
  'par-add':()=>{E.preg[qi].pares.push(['','']);E.preg[qi].parImgs.push('');sucio();render()},
  'par-del':()=>{E.preg[qi].pares.splice(+t.dataset.j,1);E.preg[qi].parImgs.splice(+t.dataset.j,1);sucio();render()},
  'img-del':()=>{E.preg[qi].imgs.splice(+t.dataset.j,1);sucio();render()},
  zoom:()=>zoom(imgSrc(t.dataset.src)),'zoom-src':()=>zoom(t.dataset.src),
  'ed-save':()=>guardarEditor(t.dataset.m,t),
  'est-start':()=>iniciarExamen(id),'est-rev':()=>abrirRevision(id,t),
  'exam-salir':()=>{S.exam=null;salirPantalla();refrescar('inicio')},
  'exam-go':()=>empezarExamen(t),
  'q-next':()=>{S.exam.i++;S.exam.sel=null;render()},'q-prev':()=>{S.exam.i--;S.exam.sel=null;render()},'q-go':()=>{S.exam.i=+t.dataset.k;S.exam.sel=null;render()},
  flag:()=>{const x=S.exam,q0=x.e.preg[x.orden[x.i]];x.flags=x.flags.includes(q0.id)?x.flags.filter(f=>f!==q0.id):[...x.flags,q0.id];marcarGuardado();render()},
  fs:()=>{const x=S.exam;x.fs=Math.max(14,Math.min(26,(x.fs||18)+ +t.dataset.d));render()},
  'rel-left':()=>{const x=S.exam;x.sel=+t.dataset.i;render()},
  'rel-right':()=>{const x=S.exam,q0=x.e.preg[x.orden[x.i]],j=t.dataset.j,cur=Array.isArray(x.resp[q0.id])?x.resp[q0.id].slice():q0.izq.map(()=>'');
   if(x.sel==null){const who=cur.findIndex(v=>v===j);if(who>=0){cur[who]='';x.resp[q0.id]=cur;marcarGuardado();render()}else toast('Primero toque un elemento de la izquierda','link');return}
   cur.forEach((v,k)=>{if(v===j)cur[k]=''});cur[x.sel]=j;x.resp[q0.id]=cur;marcarGuardado();const nx=cur.findIndex(v=>v===''||v==null);x.sel=nx>=0?nx:null;render()},
  'aviso-ok':()=>{S.exam.aviso=false;render()},
  'exam-entregar':()=>{const x=S.exam,falt=x.e.preg.filter(q0=>!respondida(q0,x.resp[q0.id])).length,mk=x.flags.length;confirmar('Entregar examen',(falt?`Tiene <b>${falt}</b> pregunta${falt>1?'s':''} sin responder. `:'Respondió todas las preguntas. ')+(mk?`Dejó <b>${mk}</b> marcada${mk>1?'s':''} para revisar. `:'')+'Después de entregar no podrá cambiar sus respuestas.','Entregar',()=>entregar(false))},
 };
 if(acts[a]){ev.preventDefault();acts[a]()}});
async function abrirSala(id){S.exSel=id;go('sala');try{await cargarIntentosDe(id);if(S.view==='sala')render()}catch(e){toast(mensaje(e),'alert')}}
document.addEventListener('submit',ev=>{ev.preventDefault();const f=ev.target;
 if(f.dataset.form==='login')login();
 if(f.dataset.form==='primer')guardarPrimer();
 if(f.dataset.form==='cfg')guardarConfig(f.querySelector('button'));
 if(f.dataset.form==='prog-add'){const fac=f.dataset.f,v=f.querySelector('input').value.trim();if(!v)return;if(Object.values(S.FAC).flat().some(p=>norm(p)===norm(v))){toast('Ese programa ya existe','alert');return}
  ocupado(f.querySelector('button'),async()=>{await q(sb.from('programas').insert({facultad_id:S.facId[fac],nombre:v}));await refrescar('facultades');toast('Programa agregado')})}});
document.addEventListener('input',ev=>{ultimo=Date.now();const t=ev.target;
 if(t.id==='pc-1'){pintarReglas();return}
 if(['f-doc','f-est','f-banco'].includes(t.id)){const k={'f-doc':'fDoc','f-est':'fEst','f-banco':'fBanco'}[t.id],v={'f-doc':'docentes','f-est':'grupos','f-banco':'banco'}[t.id],p=t.selectionStart;S[k]=t.value;go(v);const n=$('#'+t.id);n.focus();n.setSelectionRange(p,p);return}
 const E=S.editor;if(E&&S.view==='editor'&&S.role==='docente'){S.editorSucio=true;if(t.dataset.ed){E[t.dataset.ed]=t.dataset.ed==='dur'?+t.value:t.value;if(t.dataset.ed==='titulo')$('#ed-h1').textContent=t.value||'Examen sin título'}
  const q0=E.preg[+t.dataset.q];if(q0){if('enun' in t.dataset)q0.enun=t.value;if(t.dataset.opt!=null)q0.opts[+t.dataset.opt]=t.value;if(t.dataset.par!=null)q0.pares[+t.dataset.par][+t.dataset.lado]=t.value;if('val' in t.dataset)q0.valor=+t.value}actualizarResumen()}
 if(S.exam&&t.dataset.resp&&t.type==='text'){S.exam.resp[t.dataset.resp]=t.value;marcarGuardado();const x=S.exam,n=x.e.preg.filter(p=>respondida(p,x.resp[p.id])).length,b=document.querySelectorAll('.qmap button')[x.i];b&&b.classList.toggle('done',t.value.trim()!=='');const pi=$('.prog i');pi&&(pi.style.width=n/x.e.preg.length*100+'%')}});
document.addEventListener('change',ev=>{const t=ev.target;
 if(t.id==='f-sede'){S.fSede=t.value;go('docentes')}
 if(t.id==='fd-fac')$('#fd-prog').innerHTML=optsProg(t.value);
 if(t.id==='fe-prog')$('#fe-fac').textContent='Facultad: '+facDe(t.value);
 if(t.id==='bulk-file'&&t.files[0])leerArchivo(t.files[0]);
 if(t.id==='qx-file'&&t.files[0])leerPreguntas(t.files[0]);
 if(t.id==='ci-per'){S.cierre={periodo:t.value,res:null,respaldo:false,banco:false};render()}
 if(t.id==='ci-sin'){S.cierre.respaldo=t.checked;render()}
 if(t.id==='ci-banco')S.cierre.banco=t.checked;
 if(t.id==='cf-logo'&&t.files[0]){const f=t.files[0];S.marca.institucion=$('#cf-inst').value;S.marca.contacto=$('#cf-contacto').value;ocupado(null,async()=>{toast('Subiendo logo…','upload');S.marca.logo_url=await subirImagen(f);render();toast('Logo listo. Pulse Guardar configuración para confirmar.','image')})}
 const E=S.editor;if(E&&S.view==='editor'&&S.role==='docente'){if(t.id==='ed-asig'){E.asig=t.value;E.grupos=[];S.editorSucio=true;render();return}if(t.dataset.grp){const g=t.dataset.grp;E.grupos=t.checked?[...E.grupos,g]:E.grupos.filter(x=>x!==g);S.editorSucio=true;actualizarResumen()}
  if(t.dataset.okset!=null){E.preg[+t.dataset.q].ok=+t.dataset.okset;S.editorSucio=true;render()}
  if(t.dataset.img!=null&&t.files.length){const q0=E.preg[+t.dataset.img],fs=[...t.files].slice(0,S.cfg.maxImgs-q0.imgs.length);S.editorSucio=true;subirImgs(fs,src=>{q0.imgs.push(src);render()}).then(n=>n&&toast(n>1?'Imágenes agregadas':'Imagen agregada','image'))}
  if(t.dataset.optimg!=null&&t.files[0]){S.editorSucio=true;subirImgs([t.files[0]],src=>{E.preg[+t.dataset.optimg].optImgs[+t.dataset.j]=src;render()}).then(n=>n&&toast('Imagen agregada','image'))}
  if(t.dataset.parimg!=null&&t.files[0]){S.editorSucio=true;subirImgs([t.files[0]],src=>{E.preg[+t.dataset.parimg].parImgs[+t.dataset.j]=src;render()}).then(n=>n&&toast('Imagen agregada','image'))}}
 if(S.exam&&t.dataset.resp&&t.type==='radio'){S.exam.resp[t.dataset.resp]=+t.value;marcarGuardado();render()}});
['dragover','dragenter'].forEach(n=>document.addEventListener(n,ev=>{const z=ev.target.closest&&ev.target.closest('[data-drop],[data-drop-file]');if(z){ev.preventDefault();z.classList.add('over')}}));
document.addEventListener('dragleave',ev=>{const z=ev.target.closest&&ev.target.closest('[data-drop],[data-drop-file]');z&&z.classList.remove('over')});
document.addEventListener('drop',ev=>{const z=ev.target.closest&&ev.target.closest('[data-drop],[data-drop-file]');if(!z)return;ev.preventDefault();z.classList.remove('over');const fs=[...ev.dataTransfer.files];
 if(z.dataset.dropFile!=null){fs[0]&&leerArchivo(fs[0]);return}const q0=S.editor.preg[+z.dataset.drop];S.editorSucio=true;subirImgs(fs.filter(f=>/^image\//.test(f.type)).slice(0,S.cfg.maxImgs-q0.imgs.length),src=>{q0.imgs.push(src);render()})});
document.addEventListener('keydown',ev=>{ultimo=Date.now();if(ev.key==='Escape'){if($('#lb-root').innerHTML)$('#lb-root').innerHTML='';else if($('#modal-root').innerHTML&&!closeModal.bloq)closeModal();else if(S.pop){S.pop=null;render()}}
 if(ev.key==='Enter'&&ev.target.id==='fd-asig-in'){ev.preventDefault();$('[data-act="asig-add"]').click()}
 if(ev.key==='Enter'&&ev.target.id&&ev.target.id.startsWith('cr-')){ev.preventDefault();ev.target.parentElement.querySelector('[data-act="com-add"]').click()}
 if(S.exam&&S.exam.fase==='examen'){const k=ev.key.toLowerCase();if((ev.ctrlKey||ev.metaKey)&&['c','x','p','s','a','u'].includes(k)){ev.preventDefault();toast('Esta acción está bloqueada durante el examen','lock')}if(ev.key==='PrintScreen'){ev.preventDefault();incidente('Intentó una captura de pantalla')}}});
['copy','cut','paste','contextmenu','dragstart'].forEach(n=>document.addEventListener(n,ev=>{if(S.exam&&S.exam.fase==='examen')ev.preventDefault()}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)incidente('Salió de la ventana del examen')});
['online','offline'].forEach(n=>addEventListener(n,()=>{if(S.exam&&navigator.onLine)enviarRespuestas();pintarRed()}));
window.addEventListener('beforeunload',ev=>{if(S.exam&&S.exam.fase==='examen'){S.exam.pend&&guardarLocal(S.exam);ev.preventDefault();ev.returnValue=''}else if(S.editorSucio){ev.preventDefault();ev.returnValue=''}});
setInterval(tick,1000);
setInterval(()=>{if(S.role&&!S.exam&&Date.now()-ultimo>S.cfg.inactividad*60000){salir('Su sesión se cerró por inactividad');return}
 if(S.exam&&S.exam.fase==='examen'&&(S.exam.pend||S.exam.incPend.length))enviarRespuestas();},15000);
setInterval(async()=>{if(S.role==='docente'&&S.view==='sala'&&!$('#modal-root').innerHTML&&!S.pop&&document.visibilityState==='visible'){try{await cargarIntentosDe(S.exSel);if(S.view==='sala')render()}catch(_){}}},20000);
setInterval(()=>{if(S.exam&&S.exam.fase==='examen')enviarRespuestas()},30000);

/* ---------- arranque ---------- */
(async function(){try{const t=localStorage.getItem('evalux-tema');if(t)document.documentElement.dataset.theme=t}catch(_){}
 if(!configurado){render();return}
 await cargarMarca();render();try{await iniciarSesion()}catch(e){console.error(e);render()}})();
