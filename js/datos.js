/* EVALUX · conexión con la base de datos (Supabase) */
const CFG=Object.assign({},window.EVALUX_CONFIG||{});
// Arregla la dirección si se pegó con partes de más (/rest/v1/, espacios o la dirección del panel de Supabase)
(function(){let u=String(CFG.SUPABASE_URL||'').trim();const m=u.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);if(m)u='https://'+m[1]+'.supabase.co';
 if(u&&!/^https?:\/\//i.test(u))u='https://'+u;try{if(u)u=new URL(u).origin}catch(_){}CFG.SUPABASE_URL=u;CFG.SUPABASE_ANON_KEY=String(CFG.SUPABASE_ANON_KEY||'').trim()})();
const configurado=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY&&!/PEGUE|xxxx/i.test(CFG.SUPABASE_URL+CFG.SUPABASE_ANON_KEY));
// La sesión se guarda solo en esta pestaña: al cerrar el navegador hay que volver a entrar.
const CLAVE_SESION='evalux-sesion';
const almacen=(()=>{try{const x=window.sessionStorage;x.setItem('ev-p','1');x.removeItem('ev-p');return x}catch(e){return undefined}})();
const sb=configurado&&window.supabase?window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY,{auth:{storage:almacen,storageKey:CLAVE_SESION,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}):null;
const BUCKET='evalux-imagenes';

async function q(p){const {data,error}=await p;if(error)throw new Error(error.message);return data}
const rpc=(fn,args={})=>q(sb.rpc(fn,args));
// Trae todas las filas, de 1000 en 1000
async function todas(armar){let desde=0,out=[];for(;;){const d=await q(armar().range(desde,desde+999));out=out.concat(d||[]);if(!d||d.length<1000)return out;desde+=1000}}
async function usuarios(body){const {data,error}=await sb.functions.invoke('usuarios',{body});
 if(error){let msg=error.message;try{const j=await error.context.json();if(j&&j.error)msg=j.error}catch(_){}
  if(/Failed to send|not found|404|Function not found/i.test(msg))msg='No se encontró la función «usuarios» en Supabase. Revise el paso 5 de la guía de instalación.';throw new Error(msg)}
 if(data&&data.error)throw new Error(data.error);return data}

/* ---------- Convertir datos de la base al formato de las pantallas ---------- */
const aDocente=p=>({id:p.id,nombres:p.nombres,apellidos:p.apellidos,tipodoc:p.tipo_doc||'CC',doc:p.documento||'',correo:p.email,cel:p.celular||'',sede:p.sede||'',fac:p.facultad||'',prog:p.programa||'',asig:p.asignaturas||[],vinc:p.vinculacion||'',estado:p.activo?'Activo':'Restringido',primer:!!p.debe_cambiar_clave});
const aEstudiante=p=>({id:p.id,nombre:[p.nombres,p.apellidos].filter(Boolean).join(' '),correo:p.email,codigo:p.codigo||'',prog:p.programa||'',fac:p.facultad||'',semestre:p.semestre||''});
function aPregunta(p){const b={id:p.id,tipo:p.tipo,valor:+p.valor,enun:p.enunciado||'',imgs:p.imagenes||[]};
 if(p.tipo==='sel'){const o=p.opciones||[];return{...b,opts:o.map(x=>x.t||''),optImgs:o.map(x=>x.img||''),ok:+p.correcta||0}}
 if(p.tipo==='com')return{...b,resp:p.respuestas||[]};
 const pr=p.pares||[];return{...b,pares:pr.map(x=>[x.a||'',x.b||'']),parImgs:pr.map(x=>x.img||'')}}
function aServidor(q){const b={tipo:q.tipo,valor:+q.valor||1,enunciado:q.enun||'',imagenes:q.imgs||[]};
 if(q.tipo==='sel')return{...b,opciones:q.opts.map((t,j)=>({t,img:q.optImgs[j]||''})),correcta:q.ok};
 if(q.tipo==='com')return{...b,respuestas:q.resp};
 return{...b,pares:q.pares.map((p,j)=>({a:p[0],b:p[1],img:q.parImgs[j]||''}))}}
const aAviso=a=>({id:a.id,de:a.autor_id,autor:a.autor,para:a.para==='docentes'?'docentes':a.grupo_id,titulo:a.titulo,texto:a.texto,fecha:a.creado_en});
const aIntento=i=>({id:i.id,estudiante:i.estudiante_id,estado:i.estado,respuestas:i.eval||i.respuestas||{},puntos:i.puntos||null,adv:i.advertencias,incidentes:(i.incidentes||[]).map(x=>[hora(x.h),x.t]),nota:i.nota==null?null:+i.nota,buenas:i.buenas,progreso:i.respondidas||0,entregado:i.entregado_en,extra:i.minutos_extra||0});

/* ---------- Marca de la institución (nombre, color y logo) ---------- */
function leerMarca(a){S.marca={institucion:a.institucion||'',color:a.color||'#2B3A8C',logo_url:a.logo_url||'',contacto:a.contacto||''};aplicarMarca()}
function aplicarMarca(){const c=/^#[0-9a-f]{6}$/i.test(S.marca.color||'')?S.marca.color:'#2B3A8C';document.documentElement.style.setProperty('--brand-base',c);
 const m=document.querySelector('meta[name=theme-color]');m&&m.setAttribute('content',c);document.title=S.marca.institucion?`Evalux · ${S.marca.institucion}`:'Evalux · Exámenes en línea'}
// Antes de entrar: la pantalla de ingreso ya muestra la institución
async function cargarMarca(){try{const r=await q(sb.from('ajustes').select('*').eq('id',1));if(r&&r[0])leerMarca(r[0])}catch(_){}}

/* ---------- Cargar lo que necesita cada rol ---------- */
async function cargarComun(){
 const [aj,facs,progs,avs,t]=await Promise.all([q(sb.from('ajustes').select('*').eq('id',1)),q(sb.from('facultades').select('*').order('orden')),todas(()=>sb.from('programas').select('*').order('nombre')),todas(()=>sb.from('avisos').select('*').order('creado_en',{ascending:false})),rpc('hora_servidor')]);
 const a=aj&&aj[0];if(a){S.cfg={periodo:a.periodo,aprueba:+a.aprueba,inactividad:a.inactividad,advertencias:a.advertencias,maxImgs:a.max_imgs};leerMarca(a)}
 S.FAC={};S.facId={};(facs||[]).forEach(f=>{S.FAC[f.nombre]=[];S.facId[f.nombre]=f.id});
 progs.forEach(p=>{const f=(facs||[]).find(x=>x.id===p.facultad_id);if(f)S.FAC[f.nombre].push(p.nombre)});
 S.avisos=avs.map(aAviso);
 if(t)S.off=new Date(t).getTime()-Date.now();
}
async function cargarAdmin(){
 const [ds,res,act]=await Promise.all([todas(()=>sb.from('perfiles').select('*').eq('rol','docente').order('creado_en',{ascending:false})),rpc('resumen_admin'),q(sb.from('actividad').select('*').order('id',{ascending:false}).limit(12))]);
 S.docentes=ds.map(aDocente);S.resumen=res||{};S.actividad=act||[];
 S.examCountByDoc=S.resumen.por_docente||{};S.conNotas=S.resumen.con_notas||{};
}
async function cargarDocente(){
 await rpc('finalizar_vencidos');
 const me=S.yo.id;
 const [gs,ge,ests,exs,eg,ps,its,bk]=await Promise.all([
  todas(()=>sb.from('grupos').select('*').eq('docente_id',me).order('creado_en')),
  todas(()=>sb.from('grupo_estudiantes').select('*')),
  todas(()=>sb.from('perfiles').select('*').eq('rol','estudiante').order('nombres')),
  todas(()=>sb.from('examenes').select('*').eq('docente_id',me).order('creado_en',{ascending:false})),
  todas(()=>sb.from('examen_grupos').select('*')),
  todas(()=>sb.from('preguntas').select('*').order('posicion')),
  todas(()=>sb.from('intentos').select('*')),
  todas(()=>sb.from('banco').select('*').eq('docente_id',me).order('creado_en',{ascending:false}))]);
 S.estudiantes=ests.map(aEstudiante);
 S.grupos=gs.map(g=>({id:g.id,docente:g.docente_id,asig:g.asignatura,codigo:g.codigo,periodo:g.periodo,est:ge.filter(x=>x.grupo_id===g.id).map(x=>x.estudiante_id).filter(id=>S.estudiantes.some(s=>s.id===id))}));
 S.examenes=exs.map(e=>({id:e.id,docente:e.docente_id,titulo:e.titulo,asig:e.asignatura,inst:e.instrucciones||'',apertura:e.apertura||'',dur:e.duracion_min,estado:e.estado,grupos:eg.filter(x=>x.examen_id===e.id).map(x=>x.grupo_id),preg:ps.filter(p=>p.examen_id===e.id).map(aPregunta)}));
 S.intentos={};its.forEach(i=>{S.intentos[i.examen_id+'|'+i.estudiante_id]=aIntento(i)});
 S.banco=bk.map(b=>({...b.datos,id:b.id,tipo:b.tipo,asig:b.asignatura,docente:b.docente_id,usos:b.usos}));
}
async function cargarIntentosDe(exId){const its=await todas(()=>sb.from('intentos').select('*').eq('examen_id',exId));
 Object.keys(S.intentos).filter(k=>k.startsWith(exId+'|')).forEach(k=>delete S.intentos[k]);its.forEach(i=>{S.intentos[i.examen_id+'|'+i.estudiante_id]=aIntento(i)})}
async function cargarEstudiante(){
 const me=S.yo.id;
 const [xs,gs,ge,pr]=await Promise.all([rpc('mis_examenes'),todas(()=>sb.from('grupos').select('*')),todas(()=>sb.from('grupo_estudiantes').select('*').eq('estudiante_id',me)),rpc('mi_progreso')]);
 S.grupos=gs.map(g=>({id:g.id,asig:g.asignatura,codigo:g.codigo,periodo:g.periodo,est:ge.some(x=>x.grupo_id===g.id)?[me]:[]}));
 S.examenes=(xs||[]).map(e=>({id:e.id,titulo:e.titulo,asig:e.asig,inst:e.inst||'',apertura:e.apertura,dur:e.dur+(e.extra||0),durBase:e.dur,extra:e.extra||0,finTodos:e.fin_todos||null,estado:'programado',n:e.n,docenteNombre:e.docente,grupos:[]}));
 S.intentos={};(xs||[]).forEach(e=>{if(e.estado)S.intentos[e.id+'|'+me]={estado:e.estado,nota:e.nota==null?null:+e.nota,buenas:e.buenas,total:e.total}});
 S.progreso=(pr||[]).map(p=>({...p,nota:+p.nota,prom:p.prom==null?null:+p.prom}));
}
async function cargarTodo(){
 await cargarComun();
 if(S.role==='admin')await cargarAdmin();
 if(S.role==='docente')await cargarDocente();
 if(S.role==='estudiante')await cargarEstudiante();
}

/* ---------- Imágenes ---------- */
async function subirImagen(file){
 const c=await comprimir(file);
 try{const ruta=`${S.yo.id}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${c.ext}`;
  const {error}=await sb.storage.from(BUCKET).upload(ruta,c.blob,{contentType:c.tipo,upsert:false});
  if(error)throw error;return sb.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl}
 catch(e){console.warn('No se pudo subir a la carpeta de imágenes; se guarda dentro de la pregunta',e);
  const p=await comprimir(file,900,.78);return p.url}}
