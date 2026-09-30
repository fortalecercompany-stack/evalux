/* EVALUX · pantallas del administrador */
const tile=(icon,c,l,v,s='',extra='')=>`<div class="card tile s3"><div class="top-r"><span class="l">${l}</span><span class="chipi ${c}">${ic(icon)}</span></div><div class="v">${v}</div>${s?`<div class="s">${s}</div>`:''}${extra}</div>`;
const saludo=()=>{const h=ahora().getHours();return h<12?'Buenos días':h<19?'Buenas tardes':'Buenas noches'};
const totalExamenes=()=>Object.values(S.examCountByDoc||{}).reduce((a,b)=>a+(+b),0);
const MESES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function vAdminInicio(){const act=S.docentes.filter(d=>d.estado==='Activo').length,ex=totalExamenes(),R=S.resumen||{};
 const porSede=SEDES.map(s=>[s,S.docentes.filter(d=>d.sede===s).length]),mx=Math.max(1,...porSede.map(x=>x[1]));
 const facs=Object.keys(S.FAC).map((f,i)=>({n:f,v:S.docentes.filter(d=>d.fac===f).length,c:PALHEX[i%PALHEX.length]})).filter(x=>x.v);
 const nProg=Object.values(S.FAC).flat().length;
 return `${hero('Panel del administrador',saludo(),`Periodo ${esc(S.cfg.periodo)} · ${act} docente${act===1?'':'s'} activo${act===1?'':'s'} · ${ex} ${ex===1?'examen creado':'exámenes creados'}`,`<button class="btn pri" data-act="doc-new">${ic('plus','sm')}Registrar docente</button><button class="btn" data-act="nav" data-v="reportes">${ic('chart','sm')}Ver reportes</button>`,'shield')}
 <div class="bento">${tile('users','c1','Docentes activos',act,`${S.docentes.length-act} restringido${S.docentes.length-act===1?'':'s'}`)}${tile('group','c3','Estudiantes',R.estudiantes||0,'cuentas únicas')}${tile('exam','c2','Exámenes',ex,'en todas las asignaturas')}${tile('school','c4','Programas',nProg,'en '+Object.keys(S.FAC).length+' facultades')}
 <div class="card s6"><div class="card-h"><span class="chipi c1">${ic('chart')}</span><h3>Docentes por facultad</h3></div>${facs.length?`<div class="row" style="gap:24px">${donut(facs,156,24,'docentes')}<ul class="list small" style="flex:1;min-width:180px">${facs.map(f=>`<li><i style="width:10px;height:10px;border-radius:3px;background:${f.c};flex:none"></i><span style="flex:1">${esc(f.n)}</span><b class="mono">${f.v}</b></li>`).join('')}</ul></div>`:`<div class="empty">${ic('users','lg')}Aún no hay docentes registrados.<button class="btn sm pri" data-act="doc-new">${ic('plus','sm')}Registrar el primero</button></div>`}</div>
 <div class="card s6"><div class="card-h"><span class="chipi c2">${ic('flag')}</span><h3>Docentes por sede</h3></div><div style="display:flex;flex-direction:column;gap:14px">${porSede.map(([s,n],i)=>hbar(esc(s),n/mx*100,PAL[i],n)).join('')}</div></div>
 <div class="card s12"><div class="card-h"><span class="chipi cc">${ic('clock')}</span><h3>Actividad reciente</h3></div>${S.actividad.length?`<ul class="list">
  ${S.actividad.map(a=>`<li><span class="chipi ${{exam:'c2',users:'c1',lock:'cbad',upload:'c3',key:'c4',trash:'cbad',checkc:'cok'}[a.icono]||'c1'}">${ic(a.icono||'exam','sm')}</span><span style="flex:1;min-width:0">${esc(a.usuario)} ${esc(a.accion)} <b>${esc(a.detalle)}</b></span><span class="small muted" style="white-space:nowrap">${hace(a.creado_en)}</span></li>`).join('')}</ul>`:'<p class="muted">Aquí verá lo que pase en Evalux: docentes registrados, exámenes programados y más.</p>'}</div></div>`}

function vAdminReportes(){const R=S.resumen||{},pm=R.por_mes||[],meses=pm.map(m=>MESES[+m.mes.slice(5)-1]),exm=pm.map(m=>+m.n);
 const vinc=['Planta','Ocasional','Catedrático'].map((v,i)=>({n:v,v:S.docentes.filter(d=>d.vinc===v).length,c:PALHEX[i]}));
 const top=S.docentes.map(d=>({d,n:+(S.examCountByDoc[d.id]||0)})).filter(x=>x.n).sort((a,b)=>b.n-a.n).slice(0,5);
 const esteMes=exm[exm.length-1]||0,antes=exm[exm.length-2]||0,dif=antes?Math.round((esteMes-antes)/antes*100):null;
 const fac=(R.por_facultad||[]).map(x=>[x.f||'Sin facultad',+x.p,+x.n]),pt=R.por_tipo||{};
 const prom=R.promedio!=null?+R.promedio:null;
 return `${hero('Reportes generales','Así se usa Evalux','Cifras de todo el sistema. Por privacidad, aquí no aparecen notas de estudiantes con nombre propio.',`<button class="btn" data-act="xls-admin">${ic('file','sm')}Descargar Excel</button>`,'chart')}
 <div class="bento">${tile('exam','c2','Exámenes este mes',esteMes,dif==null?'':`${dif>=0?'+':''}${dif} % frente al mes anterior`)}${tile('checkc','cok','Promedio general',prom!=null?nota1(prom):'—','escala 0,0 a 5,0')}${tile('group','c3','Estudiantes evaluados',R.evaluados||0,'al menos un examen')}${tile('alert','cbad','Sospechas de fraude',R.sospechas||0,'pendientes de revisar por los docentes')}
 <div class="card s7"><div class="card-h"><span class="chipi c1">${ic('chart')}</span><h3>Exámenes aplicados por mes</h3></div>${barrasV(exm,meses,PALHEX)}</div>
 <div class="card s5"><div class="card-h"><span class="chipi c4">${ic('users')}</span><h3>Docentes por vinculación</h3></div>${S.docentes.length?`<div class="row" style="gap:20px">${donut(vinc,150,22,'docentes')}<div class="legend" style="flex-direction:column;gap:8px">${vinc.map(v=>`<span style="--c:${v.c}">${v.n} · ${v.v}</span>`).join('')}</div></div>`:'<p class="muted">Aún no hay docentes.</p>'}</div>
 <div class="card s6"><div class="card-h"><span class="chipi c3">${ic('school')}</span><h3>Promedio por facultad</h3></div>${fac.length?`<div style="display:flex;flex-direction:column;gap:12px">${fac.map(([f,v,n])=>hbar(esc(f)+` <span class="muted">· ${n} notas</span>`,v/5*100,NIVCOL[nivel(v)],nota1(v))).join('')}</div>`:'<p class="muted">Aparece cuando haya exámenes calificados.</p>'}</div>
 <div class="card s6"><div class="card-h"><span class="chipi c2">${ic('star')}</span><h3>Docentes con más exámenes</h3></div>${top.length?`<ul class="list">${top.map((x,i)=>`<li><span class="mono muted" style="width:18px">${i+1}</span>${avatar(x.d.nombres+' '+x.d.apellidos,32)}<span style="flex:1;min-width:0"><b>${esc(x.d.nombres.split(' ')[0]+' '+x.d.apellidos.split(' ')[0])}</b><br><span class="small muted">${esc(x.d.prog)}</span></span><b class="mono">${x.n}</b></li>`).join('')}</ul>`:'<p class="muted">Aún no hay exámenes creados.</p>'}</div>
 <div class="card s12"><div class="card-h"><span class="chipi c4">${ic('grid')}</span><h3>Aciertos por tipo de pregunta</h3><span class="small muted">en todo el sistema</span></div>${Object.keys(pt).length?`<div style="display:flex;flex-direction:column;gap:14px">${['sel','com','rel'].filter(t=>pt[t]!=null).map(t=>hbar(`<span class="tag ${TIPO[t][1]}">${ic(t,'sm')}${TIPO[t][0]}</span>`,+pt[t],`var(--${t==='sel'?'a1':t==='com'?'a4':'a2'})`,Math.round(+pt[t])+' %')).join('')}</div>`:'<p class="muted">Aparece cuando haya exámenes calificados.</p>'}${R.calificados?`<p class="small muted" style="margin-top:12px">${R.aprobados} de ${R.calificados} exámenes presentados fueron aprobados (${Math.round(R.aprobados/R.calificados*100)} %).</p>`:''}</div></div>`}

function excelAdmin(){const R=S.resumen||{};
 descargarExcel('Evalux-reporte-general',[
  ['Resumen',[{'Periodo':S.cfg.periodo,'Docentes':S.docentes.length,'Docentes activos':S.docentes.filter(d=>d.estado==='Activo').length,'Estudiantes':R.estudiantes||0,'Estudiantes evaluados':R.evaluados||0,'Exámenes':totalExamenes(),'Promedio general':R.promedio!=null?+R.promedio:'','Exámenes calificados':R.calificados||0,'Aprobados':R.aprobados||0,'Sospechas':R.sospechas||0}]],
  ['Exámenes por mes',(R.por_mes||[]).map(m=>({'Mes':m.mes,'Exámenes':+m.n}))],
  ['Promedio por facultad',(R.por_facultad||[]).map(x=>({'Facultad':x.f||'Sin facultad','Promedio':+x.p,'Notas':+x.n}))],
  ['Docentes',S.docentes.map(d=>({'Nombres':d.nombres,'Apellidos':d.apellidos,'Documento':d.doc,'Correo':d.correo,'Celular':d.cel,'Sede':d.sede,'Facultad':d.fac,'Programa':d.prog,'Vinculación':d.vinc,'Asignaturas':d.asig.join('; '),'Estado':d.estado,'Exámenes':+(S.examCountByDoc[d.id]||0)}))]])}

function vDocentes(){const q=norm(S.fDoc||''),fs=S.fSede||'',fe=S.fEstado||'';
 const lista=S.docentes.filter(d=>(!fs||d.sede===fs)&&(!fe||d.estado===fe)&&(!q||norm(d.nombres+' '+d.apellidos+' '+d.doc+' '+d.correo+' '+d.prog+' '+d.asig.join(' ')).includes(q)));
 return `${hero('Administrador','Docentes','Registre, edite, restrinja o elimine docentes. Un docente restringido no puede entrar, pero sus exámenes y notas se conservan.',`<button class="btn pri" data-act="doc-new">${ic('plus','sm')}Registrar docente</button><button class="btn" data-act="doc-bulk">${ic('upload','sm')}Cargar desde Excel</button>`,'users')}
 <div class="row"><div style="position:relative;flex:1 1 280px"><input type="search" id="f-doc" placeholder="Buscar por nombre, documento, programa o asignatura" value="${esc(S.fDoc||'')}" aria-label="Buscar docentes" style="padding-left:42px"><span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted)">${ic('search','sm')}</span></div>
 <select id="f-sede" style="flex:0 1 210px" aria-label="Filtrar por sede"><option value="">Todas las sedes</option>${SEDES.map(s=>`<option ${s===fs?'selected':''}>${esc(s)}</option>`).join('')}</select>
 <div class="seg" role="group" aria-label="Filtrar por estado">${[['','Todos'],['Activo','Activos'],['Restringido','Restringidos']].map(([v,l])=>`<button data-act="f-estado" data-v="${v}" aria-pressed="${fe===v}">${l}</button>`).join('')}</div></div>
 <div class="tbl-wrap"><table><thead><tr><th>Docente</th><th>Documento</th><th>Sede · Programa</th><th>Asignaturas</th><th>Estado</th><th class="num">Acciones</th></tr></thead><tbody>
 ${lista.length?lista.map(d=>`<tr><td><div class="person">${avatar(d.nombres+' '+d.apellidos)}<div style="min-width:0"><b>${esc(d.nombres+' '+d.apellidos)}</b>${d.primer?' <span class="pill p-warn">Sin primer ingreso</span>':''}<div class="small muted">${esc(d.correo)}</div></div></div></td><td class="mono">${esc(d.tipodoc)} ${esc(d.doc)}</td><td>${esc(d.sede)}<div class="small muted">${esc(d.prog)}${d.vinc?' · '+esc(d.vinc):''}</div></td><td><div class="chips">${d.asig.map(a=>`<span class="chip">${esc(a)}</span>`).join('')}</div></td>
 <td><span class="pill ${d.estado==='Activo'?'p-ok':'p-bad'}"><i></i>${esc(d.estado)}</span></td>
 <td class="num"><div class="row" style="justify-content:flex-end;flex-wrap:nowrap;gap:4px"><button class="btn sm icon ghost" data-act="doc-edit" data-id="${d.id}" aria-label="Editar a ${esc(d.nombres)}" title="Editar">${ic('edit','sm')}</button><button class="btn sm icon ghost" data-act="doc-reset" data-id="${d.id}" aria-label="Restablecer la contraseña de ${esc(d.nombres)}" title="Restablecer contraseña">${ic('key','sm')}</button><button class="btn sm" data-act="doc-toggle" data-id="${d.id}">${ic(d.estado==='Activo'?'lock':'checkc','sm')}${d.estado==='Activo'?'Restringir':'Activar'}</button><button class="btn sm icon ghost danger" data-act="doc-del" data-id="${d.id}" aria-label="Eliminar a ${esc(d.nombres)}" title="Eliminar">${ic('trash','sm')}</button></div></td></tr>`).join(''):`<tr><td colspan="6"><div class="empty">${ic('users','lg')}${S.docentes.length?'No hay docentes que coincidan con la búsqueda.':'Aún no hay docentes. Regístrelos uno por uno o desde Excel.'}</div></td></tr>`}
 </tbody></table></div>`}
const optsFac=sel=>Object.keys(S.FAC).map(f=>`<option ${f===sel?'selected':''}>${esc(f)}</option>`).join('');
const optsProg=(fac,sel)=>(S.FAC[fac]||[]).map(p=>`<option ${p===sel?'selected':''}>${esc(p)}</option>`).join('');
function formDocente(id){const f0=Object.keys(S.FAC)[0]||'';const d=id?S.docentes.find(x=>x.id===id):{nombres:'',apellidos:'',tipodoc:'CC',doc:'',correo:'',cel:'',sede:SEDES[0],fac:f0,prog:(S.FAC[f0]||[])[0]||'',asig:[],vinc:'Planta',estado:'Activo'};S.formAsig=d.asig.slice();
 modal({title:id?'Editar docente':'Registrar docente',icon:['users','c1'],body:`<form id="fd" novalidate data-id="${id||''}" style="display:flex;flex-direction:column;gap:22px">
 <fieldset class="fs"><legend>Datos personales</legend><div class="form-grid">
 <label class="field"><span>Nombres</span><input type="text" id="fd-nombres" value="${esc(d.nombres)}" autocomplete="off"></label>
 <label class="field"><span>Apellidos</span><input type="text" id="fd-apellidos" value="${esc(d.apellidos)}" autocomplete="off"></label>
 <label class="field"><span>Tipo de documento</span><select id="fd-tipodoc">${[['CC','Cédula de ciudadanía'],['CE','Cédula de extranjería'],['PA','Pasaporte'],['PPT','Permiso por protección temporal']].map(([v,l])=>`<option value="${v}" ${v===d.tipodoc?'selected':''}>${l}</option>`).join('')}</select></label>
 <label class="field"><span>Número de documento</span><input type="text" inputmode="numeric" id="fd-doc" value="${esc(d.doc)}"><small class="hint">${id?'Cambiarlo no cambia la contraseña.':'Es su contraseña inicial; al entrar la primera vez debe cambiarla.'}</small></label>
 <label class="field"><span>Correo institucional</span><input type="email" id="fd-correo" value="${esc(d.correo)}" placeholder="nombre@uniguajira.edu.co"><small class="hint">Con este correo entra a Evalux.</small></label>
 <label class="field"><span>Celular (opcional)</span><input type="text" inputmode="tel" id="fd-cel" value="${esc(d.cel)}" placeholder="300 000 0000"></label></div></fieldset>
 <fieldset class="fs"><legend>Datos académicos</legend><div class="form-grid">
 <label class="field"><span>Sede</span><select id="fd-sede">${SEDES.map(s=>`<option ${s===d.sede?'selected':''}>${esc(s)}</option>`).join('')}</select></label>
 <label class="field"><span>Facultad</span><select id="fd-fac">${optsFac(d.fac)}</select></label>
 <label class="field"><span>Programa</span><select id="fd-prog">${optsProg(d.fac,d.prog)}</select></label>
 <label class="field"><span>Vinculación</span><select id="fd-vinc">${['Planta','Ocasional','Catedrático'].map(v=>`<option ${v===d.vinc?'selected':''}>${v}</option>`).join('')}</select></label>
 ${id?'':`<label class="field"><span>Estado</span><select id="fd-estado">${['Activo','Restringido'].map(v=>`<option ${v===d.estado?'selected':''}>${v}</option>`).join('')}</select></label>`}</div>
 <div class="field"><label for="fd-asig-in" class="lbl">Asignaturas que dicta</label><div class="row"><input type="text" id="fd-asig-in" placeholder="Escriba una asignatura y pulse Agregar" style="flex:1 1 220px"><button type="button" class="btn" data-act="asig-add">${ic('plus','sm')}Agregar</button></div><div class="chips" id="fd-asig"></div><small class="hint">El docente solo podrá crear exámenes de estas asignaturas.</small></div></fieldset>
 <div id="fd-err" class="issues" role="alert" hidden></div></form>`,
 foot:`<button class="btn" data-act="close">Cancelar</button><button class="btn pri" data-act="doc-save">${ic('save','sm')}${id?'Guardar cambios':'Registrar docente'}</button>`});pintarAsig();}
function pintarAsig(){$('#fd-asig').innerHTML=S.formAsig.length?S.formAsig.map((a,i)=>`<span class="chip">${esc(a)}<button type="button" data-act="asig-del" data-i="${i}" aria-label="Quitar ${esc(a)}">×</button></span>`).join(''):'<span class="small muted">Aún no tiene asignaturas.</span>'}
function credenciales(titulo,lista,errores=[]){
 modal({title:titulo,icon:['key','cok'],body:`${lista.length?`<p>Entregue estos datos a cada docente. Al entrar la primera vez, Evalux le pedirá crear una contraseña propia.</p>
 <div class="tbl-wrap" style="box-shadow:none"><table><thead><tr><th>Docente</th><th>Usuario (correo)</th><th>Contraseña inicial</th></tr></thead><tbody>${lista.map(x=>`<tr><td><b>${esc(x.nombre)}</b></td><td class="small">${esc(x.usuario)}</td><td class="mono">${esc(x.clave)}</td></tr>`).join('')}</tbody></table></div>`:''}
 ${errores.length?`<div class="issues"><b>No se pudieron crear:</b><ul>${errores.map(e=>`<li>${esc(e.persona)}: ${esc(e.error)}</li>`).join('')}</ul></div>`:''}`,
 foot:`${lista.length?`<button class="btn" id="cred-xls">${ic('file','sm')}Descargar en Excel</button>`:''}<button class="btn pri" data-act="close">Listo</button>`});
 const b=$('#cred-xls');b&&(b.onclick=()=>descargarExcel('Evalux-accesos-docentes',[['Accesos',lista.map(x=>({'Docente':x.nombre,'Usuario':x.usuario,'Contraseña inicial':x.clave,'Dirección':location.origin}))]]))}
async function guardarDocente(btn){const f=$('#fd'),id=f.dataset.id,v=k=>($('#fd-'+k)?$('#fd-'+k).value:'').trim(),errs=[];f.querySelectorAll('.inv').forEach(x=>x.classList.remove('inv'));const bad=(k,m)=>{errs.push(m);$('#fd-'+k)&&$('#fd-'+k).classList.add('inv')};
 if(!v('nombres'))bad('nombres','Escriba los nombres.');if(!v('apellidos'))bad('apellidos','Escriba los apellidos.');
 if(!/^[0-9A-Za-z]{5,12}$/.test(v('doc')))bad('doc','El documento debe tener entre 5 y 12 caracteres, sin puntos ni espacios.');
 if(!RX_MAIL.test(v('correo')))bad('correo','Escriba un correo válido.');
 if(v('cel')&&!/^3\d{9}$/.test(v('cel').replace(/\s/g,'')))bad('cel','El celular debe tener 10 dígitos y empezar por 3.');
 if(S.docentes.some(d=>d.id!==id&&d.doc===v('doc')))bad('doc','Ya existe un docente con ese documento.');
 if(S.docentes.some(d=>d.id!==id&&norm(d.correo)===norm(v('correo'))))bad('correo','Ya existe un docente con ese correo.');
 if(!S.formAsig.length)errs.push('Agregue al menos una asignatura.');
 const box=$('#fd-err');if(errs.length){box.innerHTML='<b>Revise estos datos:</b><ul>'+errs.map(e=>`<li>${esc(e)}</li>`).join('')+'</ul>';box.hidden=false;box.scrollIntoView({block:'nearest'});return}
 await ocupado(btn,async()=>{
  const datos={nombres:v('nombres'),apellidos:v('apellidos'),tipo_doc:v('tipodoc'),documento:v('doc'),celular:v('cel').replace(/\s/g,''),sede:v('sede'),facultad:v('fac'),programa:v('prog'),vinculacion:v('vinc'),asignaturas:S.formAsig.slice()};
  if(id){const d=S.docentes.find(x=>x.id===id);
   await q(sb.from('perfiles').update(datos).eq('id',id));
   if(norm(d.correo)!==norm(v('correo')))await usuarios({accion:'cambiar_correo',id,email:v('correo').toLowerCase()});
   closeModal();await refrescar();toast('Cambios guardados')}
  else{const r=await usuarios({accion:'crear_docente',persona:{...datos,email:v('correo').toLowerCase(),activo:v('estado')!=='Restringido'}});
   await refrescar();credenciales('Docente registrado',[r])}})}
function eliminarDocente(id){const d=S.docentes.find(x=>x.id===id),n=+(S.conNotas[id]||0);
 if(n>0){modal({title:'No se puede eliminar',size:'sm',icon:['alert','c2'],body:`<p><b>${esc(d.nombres+' '+d.apellidos)}</b> tiene ${n} examen${n>1?'es':''} con notas de estudiantes. Si lo elimina se perderían esas notas.</p><p>Puede <b>restringirlo</b>: no podrá entrar, pero la información se conserva.</p>`,foot:`<button class="btn" data-act="close">Cancelar</button>${d.estado==='Activo'?`<button class="btn pri" data-act="doc-toggle" data-id="${id}">${ic('lock','sm')}Restringir docente</button>`:''}`});return}
 confirmar('Eliminar docente',`¿Eliminar a <b>${esc(d.nombres+' '+d.apellidos)}</b>? Se borran también sus grupos y exámenes sin presentar. Esta acción no se puede deshacer.`,'Eliminar',()=>ocupado(null,async()=>{await usuarios({accion:'eliminar_docente',id});await refrescar();toast('Docente eliminado','trash')}))}
function cambiarEstadoDocente(id){const d=S.docentes.find(x=>x.id===id),restr=d.estado==='Activo';
 return ocupado(null,async()=>{await usuarios({accion:restr?'restringir':'activar',id});closeModal();await refrescar();toast(restr?'Docente restringido: ya no puede entrar':'Docente activado',restr?'lock':'checkc')})}
function restablecerDocente(id){const d=S.docentes.find(x=>x.id===id);
 confirmar('Restablecer contraseña',`La contraseña de <b>${esc(d.nombres+' '+d.apellidos)}</b> volverá a ser su número de documento y deberá crear una nueva al entrar.`,'Restablecer',()=>ocupado(null,async()=>{const r=await usuarios({accion:'restablecer',id});await refrescar();credenciales('Contraseña restablecida',[{nombre:d.nombres+' '+d.apellidos,usuario:r.usuario,clave:r.clave}])}))}

function vFacultades(){return `${hero('Administrador','Facultades y programas','Solo pregrado, con los nombres oficiales. Aparecen al registrar docentes y estudiantes.',`<button class="btn pri" data-act="fac-new">${ic('plus','sm')}Agregar facultad</button>`,'school')}
 <div class="grid2">${Object.keys(S.FAC).map((f,i)=>{const c='c'+(i%5+1),n=S.docentes.filter(d=>d.fac===f).length;return `<div class="card" style="display:flex;flex-direction:column;gap:14px"><div class="row" style="flex-wrap:nowrap"><span class="chipi ${c}">${ic('school')}</span><h3 style="flex:1">${esc(f)}</h3></div><div class="row small muted" style="gap:14px"><span>${ic('book','sm')} ${S.FAC[f].length} programa${S.FAC[f].length===1?'':'s'}</span><span>${ic('users','sm')} ${n} docente${n===1?'':'s'}</span></div>
 <div class="chips">${S.FAC[f].map(p=>`<span class="chip" style="background:var(--surface-2);color:var(--ink);border:1px solid var(--line)">${esc(p)}</span>`).join('')}</div>
 <form class="row" data-form="prog-add" data-f="${esc(f)}" style="margin-top:auto"><input type="text" placeholder="Nuevo programa" aria-label="Nuevo programa en ${esc(f)}" style="flex:1 1 160px"><button class="btn sm">${ic('plus','sm')}Agregar</button></form></div>`}).join('')}</div>`}

function vConfig(){const c=S.cfg;return `${hero('Administrador','Configuración','Reglas generales de Evalux. Se aplican a todos los docentes y estudiantes.','','gear')}
 <form data-form="cfg" class="bento" novalidate><div class="card s6" style="display:flex;flex-direction:column;gap:16px"><div class="card-h" style="margin:0"><span class="chipi c1">${ic('cal')}</span><h3>Periodo y notas</h3></div>
 <label class="field"><span>Periodo académico actual</span><input type="text" id="cf-periodo" value="${esc(c.periodo)}" placeholder="2026-2"></label>
 <label class="field"><span>Nota mínima para aprobar</span><input type="number" id="cf-aprueba" min="1" max="5" step="0.1" value="${c.aprueba}"><small class="hint">Escala de 0,0 a 5,0.</small></label>
 <div class="field"><span>Niveles de desempeño</span><div class="row">${NIV.map((n,i)=>`<span class="lv lv${i}">${n}</span>`).join('')}</div><small class="hint">Bajo: menos de ${nota1(c.aprueba)} · Básico: hasta 3,9 · Alto: hasta 4,5 · Superior: 4,6 a 5,0.</small></div></div>
 <div class="card s6" style="display:flex;flex-direction:column;gap:16px"><div class="card-h" style="margin:0"><span class="chipi cbad">${ic('shield')}</span><h3>Seguridad</h3></div>
 <label class="field"><span>Cerrar sesión tras minutos sin uso</span><input type="number" id="cf-inact" min="5" max="120" value="${c.inactividad}"></label>
 <label class="field"><span>Salidas de la ventana antes de cerrar el examen</span><select id="cf-adv">${[1,2,3].map(v=>`<option ${v===c.advertencias?'selected':''}>${v}</option>`).join('')}</select><small class="hint">Con 2, la primera es advertencia y la segunda cierra el examen como sospecha.</small></label>
 <label class="field"><span>Imágenes por pregunta</span><select id="cf-img">${[1,2,3,4,5].map(v=>`<option ${v===c.maxImgs?'selected':''}>${v}</option>`).join('')}</select></label></div>
 <div class="s12 row" style="justify-content:flex-end"><button class="btn pri">${ic('save','sm')}Guardar configuración</button></div></form>`}
async function guardarConfig(btn){const ap=+$('#cf-aprueba').value,inac=+$('#cf-inact').value;
 if(!(ap>=1&&ap<=5)){toast('La nota para aprobar debe estar entre 1,0 y 5,0','alert');return}
 if(!(inac>=5&&inac<=120)){toast('Los minutos sin uso deben estar entre 5 y 120','alert');return}
 await ocupado(btn,async()=>{await q(sb.from('ajustes').update({periodo:$('#cf-periodo').value.trim()||S.cfg.periodo,aprueba:Math.round(ap*10)/10,inactividad:inac,advertencias:+$('#cf-adv').value,max_imgs:+$('#cf-img').value}).eq('id',1));await refrescar();toast('Configuración guardada','gear')})}
