/* EVALUX · íconos, marca y gráficos */
/* ================= Íconos a dos tonos: [relleno suave, trazo] ================= */
const I={
 home:['M5 10.5 12 5l7 5.5V19a1 1 0 0 1-1 1h-4v-5h-4v5H6a1 1 0 0 1-1-1z','M3 11l9-7 9 7M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9'],
 users:['M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 20a7 7 0 0 1 14 0z','M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 20a7 7 0 0 1 14 0M16 4.2a4 4 0 0 1 0 7.6M18.5 14.3A7 7 0 0 1 22 20'],
 school:['M12 4 3 9l9 5 9-5z','M3 9l9-5 9 5-9 5zM6 11v5c3.5 2.5 8.5 2.5 12 0v-5M21 9v6'],
 group:['M4 6h16v13H4z','M4 5h16v15H4zM4 10h16M8 14h4M8 17h7'],
 exam:['M6 3h9l4 4v14H6z','M6 3h9l4 4v14H6zM15 3v4h4M9 12l2 2 4-4M9 17h6'],
 bank:['M4 8h16v12H4z','M4 8h16v12H4zM6 4h12M8 12h8M8 16h5'],
 book:['M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z','M5 17V4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h9'],
 chart:['M5 13h3v7H5zM10.5 8h3v12h-3zM16 4h3v16h-3z','M5 13h3v7H5zM10.5 8h3v12h-3zM16 4h3v16h-3zM3 20h18'],
 bell:['M6 16V11a6 6 0 0 1 12 0v5l2 2H4z','M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4'],
 mega:['M4 10h4l9-5v14l-9-5H4z','M4 10h4l9-5v14l-9-5H4zM8 14l1.5 6H12l-1-5.5M20 9.5v5'],
 gear:['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z','M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1'],
 plus:['','M12 5v14M5 12h14'], upload:['M4 16h16v4H4z','M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4'],
 image:['M4 5h16v14H4z','M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01'],
 clock:['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'],
 check:['','M5 12.5l4.5 4.5L19 7.5'], checkc:['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12.5l3 3 5-6'],
 alert:['M12 3 22 20H2z','M12 3 22 20H2zM12 10v4M12 17h.01'],
 eye:['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z','M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
 copy:['M9 9h11v11H9z','M9 9h11v11H9zM5 15H4V4h11v1'],
 trash:['M6 7h12l-1 13H7z','M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3'],
 edit:['M4 20v-4L15 5l4 4L8 20z','M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4'],
 lock:['M6 11h12v9H6z','M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2'],
 cal:['M4 6h16v14H4z','M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2'],
 logout:['M4 4h9v16H4z','M13 4H4v16h9M16 16l4-4-4-4M20 12H9'],
 file:['M6 3h8l4 4v14H6z','M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6'],
 arrowR:['','M5 12h14M13 6l6 6-6 6'], up:['','M12 19V5M6 11l6-6 6 6'], down:['','M12 5v14M6 13l6 6 6-6'], x:['','M6 6l12 12M18 6 6 18'],
 shield:['M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z','M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4'],
 flag:['M5 4h12l-2 4 2 4H5z','M5 21V4M5 4h12l-2 4 2 4H5'],
 wifi:['','M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01'],
 star:['M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z','M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z'],
 link:['','M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
 user:['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0z','M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'],
 key:['M8 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z','M8 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11.5 11.5 20 3M16 7l3 3M18 5l2 2'],
 mail:['M3 6h18v12H3z','M3 6h18v12H3zM3 7l9 6 9-6'],
 trend:['M3 17l6-6 4 4 8-8v12H3z','M3 17l6-6 4 4 8-8M15 7h6v6'],
 spark:['M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z','M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z'],
 target:['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01'],
 grid:['M4 4h7v7H4zM13 13h7v7h-7z','M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
 save:['M5 4h11l3 3v13H5z','M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6'],
 search:['M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z','M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM21 21l-5.5-5.5'],
 sel:['M4 5h16v4H4z','M4 5h16v4H4zM4 11h16v4H4zM4 17h10M6.5 7h.01'],
 com:['M9 10h6v4H9z','M3 12h4M9 10h6v4H9zM17 12h4M3 18h10'],
 rel:['M3 5h6v4H3zM15 15h6v4h-6z','M3 5h6v4H3zM15 5h6v4h-6zM3 15h6v4H3zM15 15h6v4h-6zM9 7l6 10M9 17l6-10'],
};
const ic=(n,cls='')=>{const d=I[n]||I.spark;return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d[0]?`<path d="${d[0]}" fill="currentColor" stroke="none" opacity=".2"/>`:''}<path d="${d[1]}"/></svg>`};
const MARK=(s=36)=>`<svg width="${s}" height="${s}" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="mk${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4556B8"/><stop offset="1" stop-color="#1C2766"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#mk${s})"/><rect x="12" y="12" width="19" height="5" rx="2.5" fill="#fff"/><rect x="12" y="21.5" width="11" height="5" rx="2.5" fill="#fff" opacity=".85"/><rect x="12" y="31" width="19" height="5" rx="2.5" fill="#fff"/><path d="M26 25l4 4 8-9" fill="none" stroke="#FF8A63" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ESCUDO=`<svg viewBox="0 0 220 240" class="escudo" aria-hidden="true"><defs><linearGradient id="gEsc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4556B8"/><stop offset="1" stop-color="#1C2766"/></linearGradient></defs>
<circle class="g1" cx="110" cy="120" r="104" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="2" stroke-dasharray="4 10"/><circle class="g2" cx="110" cy="120" r="84" fill="none" stroke="rgba(224,86,47,.5)" stroke-width="2" stroke-dasharray="40 14"/>
<path d="M110 44 L166 64 V112 C166 150 142 174 110 188 C78 174 54 150 54 112 V64 Z" fill="url(#gEsc)" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
<rect x="86" y="108" width="48" height="40" rx="8" fill="#FFFFFF"/><path d="M94 108 V96 a16 16 0 0 1 32 0 V108" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
<circle cx="110" cy="124" r="6" fill="#E0562F"/><rect x="107.5" y="126" width="5" height="12" rx="2.5" fill="#E0562F"/></svg>`;
const heroArt=n=>`<div class="art" aria-hidden="true"><svg class="rings" viewBox="0 0 150 150"><circle cx="75" cy="75" r="72" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.5" stroke-dasharray="3 8"/><circle cx="75" cy="75" r="56" fill="none" stroke="rgba(255,181,158,.5)" stroke-width="1.5" stroke-dasharray="30 10"/><circle cx="147" cy="75" r="4" fill="#FFB59E"/></svg><div class="gl">${ic(n)}</div></div>`;
const hero=(eyebrow,title,sub,acts='',art='spark')=>`<section class="hero"><div style="min-width:0"><div class="eyebrow">${eyebrow}</div><h1 style="margin-top:8px">${title}</h1>${sub?`<p>${sub}</p>`:''}${acts?`<div class="acts">${acts}</div>`:''}</div>${heroArt(art)}</section>`;

/* ================= Gráficos ================= */
function ring(pct,color,size=120,stroke=12,label='',sub=''){const r=(size-stroke)/2,c=2*Math.PI*r,o=c*(1-Math.max(0,Math.min(1,pct)));
 return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label} ${sub}" style="flex:none"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${o}" transform="rotate(-90 ${size/2} ${size/2})"/>${label?`<text x="50%" y="${sub?'46%':'52%'}" text-anchor="middle" dominant-baseline="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="${size*.25}" fill="var(--ink)">${label}</text>`:''}${sub?`<text x="50%" y="68%" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="700" font-size="${size*.1}" fill="var(--muted)">${sub}</text>`:''}</svg>`}
function donut(parts,size=156,stroke=24,cap='total'){const tot=parts.reduce((a,p)=>a+p.v,0)||1,r=(size-stroke)/2,c=2*Math.PI*r;let acc=0;
 return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${parts.map(p=>p.n+': '+p.v).join(', ')}" style="flex:none"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="${stroke}"/>${parts.map(p=>{const len=c*p.v/tot,s=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${p.c}" stroke-width="${stroke}" stroke-dasharray="${Math.max(0,len-3)} ${c}" stroke-dashoffset="${-acc}" transform="rotate(-90 ${size/2} ${size/2})"/>`;acc+=len;return s}).join('')}<text x="50%" y="47%" text-anchor="middle" dominant-baseline="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="${size*.2}" fill="var(--ink)">${parts.reduce((a,p)=>a+p.v,0)}</text><text x="50%" y="63%" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="${size*.08}" font-weight="700" fill="var(--muted)">${cap}</text></svg>`}
function linea(series,labels,{h=230,umbral=S.cfg.aprueba}={}){const W=640,H=h,L=34,R=16,T=16,B=36,iw=W-L-R,ih=H-T-B,n=labels.length,x=i=>L+(n<2?iw/2:i*iw/(n-1)),y=v=>T+ih-(v/5)*ih;
 let g='';[0,1,2,3,4,5].forEach(t=>{g+=`<line x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${L-8}" y="${y(t)+4}" text-anchor="end">${t},0</text>`});
 g+=`<line x1="${L}" x2="${W-R}" y1="${y(umbral)}" y2="${y(umbral)}" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="5 5"/><text x="${W-R}" y="${y(umbral)-6}" text-anchor="end" style="fill:var(--coral-ink);font-weight:700">aprueba ${nota1(umbral)}</text>`;
 labels.forEach((l,i)=>{g+=`<text x="${x(i)}" y="${H-12}" text-anchor="middle">${esc(l)}</text>`});
 series.forEach((s,k)=>{const pts=s.v.map((v,i)=>v==null?null:[x(i),y(v)]).filter(Boolean);if(!pts.length)return;
  if(k===0&&pts.length>1)g+=`<path d="M${pts[0][0]} ${y(0)} ${pts.map(p=>'L'+p[0]+' '+p[1]).join(' ')} L${pts[pts.length-1][0]} ${y(0)}Z" fill="${s.c}" opacity=".1"/>`;
  g+=`<path d="${pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')}" fill="none" stroke="${s.c}" stroke-width="${k===0?3:2}" ${s.dash?'stroke-dasharray="6 5"':''} stroke-linejoin="round" stroke-linecap="round"/>`;
  s.v.forEach((v,i)=>{if(v==null)return;g+=`<circle cx="${x(i)}" cy="${y(v)}" r="${k===0?5:3.5}" fill="var(--surface)" stroke="${s.c}" stroke-width="2.5"><title>${esc(s.n)} · ${esc(labels[i])}: ${nota1(v)}</title></circle>`;if(k===0)g+=`<text x="${x(i)}" y="${y(v)-11}" text-anchor="middle" style="fill:var(--ink);font-weight:800">${nota1(v)}</text>`})});
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${series.map(s=>s.n+': '+s.v.map(v=>v==null?'—':nota1(v)).join(', ')).join('. ')}">${g}</svg>`}
function barrasV(vals,labels,colors,{h=190,max}={}){const W=560,H=h,L=10,R=10,T=18,B=30,n=vals.length,bw=(W-L-R)/n,mx=max||Math.max(1,...vals);let g='';
 vals.forEach((v,i)=>{const bh=(H-T-B)*v/mx,x=L+i*bw+bw*.18,w=bw*.64,yy=H-B-bh;g+=`<rect x="${x}" y="${yy}" width="${w}" height="${Math.max(2,bh)}" rx="7" fill="${colors[i%colors.length]}"><title>${esc(labels[i])}: ${v}</title></rect><text x="${x+w/2}" y="${yy-6}" text-anchor="middle" style="fill:var(--ink);font-weight:800">${v}</text><text x="${x+w/2}" y="${H-10}" text-anchor="middle">${esc(labels[i])}</text>`});
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${labels.map((l,i)=>l+': '+vals[i]).join(', ')}">${g}</svg>`}
const hbar=(label,pct,color,right)=>`<div><div class="row small" style="justify-content:space-between;flex-wrap:nowrap;gap:10px"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${label}</span><b class="mono">${right}</b></div><div class="bar" style="margin-top:5px"><i style="width:${Math.max(0,Math.min(100,pct))}%;background:${color}"></i></div></div>`;
