
/* ===== 6) الأوضاع الأربعة: شجرة / عمارة / بحر / خطة ===== */
function itemAttrs(c,cls){
  const s=stOf(c);
  return `class="${cls} n-${s}" data-id="${esc(c.id)}" aria-pressed="${s==='done'}"${s==='lock'?' aria-disabled="true"':''}`;
}
function eAttrs(e,cls){
  const d=V.done.includes(e.id);
  return `class="${cls} n-${d?'done':'open'}" data-id="${esc(e.id)}" aria-pressed="${d}"`;
}
const emptyYear=()=>`<p class="empty">${esc(t('noCourses'))}</p>`;
const codeName=c=>`<span class="fc">${esc(c.id)}</span><span class="fn">${esc(nm(c))}</span>`;

/* --- الشجرة: الأغصان = السنوات، الثمار = المواد --- */
function treeHTML(m){
  const yrs=byYear(m);let rows='';
  for(let y=m.years;y>=1;y--){
    const list=yrs[y-1];
    rows+=`<section class="lr ${y%2?'L':'R'}"><div class="cell"><div class="limb"></div><span class="ytag">${esc(t('yr',y))}</span>
      <div class="canopy">${list.length?list.map(c=>`<button ${itemAttrs(c,'fr')}><span class="fruit">${V.done.includes(c.id)?'✓':''}</span>${codeName(c)}</button>`).join(''):emptyYear()}</div></div></section>`;
  }
  const el=m.electives.length
    ?`<div class="grass"><h3>🍂 ${esc(t('electives'))}</h3><p>${esc(t('electivesSub'))}</p><div class="fallen">${m.electives.map(e=>`<button ${eAttrs(e,'pill')}><i class="dot"></i>${esc(nm(e))}</button>`).join('')}</div></div>`
    :'<div class="grass thin"></div>';
  return `<div class="scene tree"><div class="crown"><span>🎓</span></div><div class="tr-rows"><div class="trunk"></div>${rows}</div><div class="tr-base"></div>${el}</div>`;
}

/* --- العمارة: كل طابق سنة، والشبابيك مواد --- */
function bldHTML(m){
  const yrs=byYear(m);let fl='';
  for(let y=m.years;y>=1;y--){
    const list=yrs[y-1];
    fl+=`<section class="floor"><div class="fl-num"><b>${y}</b><small>${esc(t('yr',y))}</small></div><div class="wins">${list.length?list.map(c=>`<button ${itemAttrs(c,'win')}>${codeName(c)}</button>`).join(''):emptyYear()}</div></section>`;
  }
  const el=m.electives.length
    ?`<div class="ground"><h3>🚪 ${esc(t('electives'))}</h3><p>${esc(t('electivesSub'))}</p><div class="doors">${m.electives.map(e=>`<button ${eAttrs(e,'door')}>${esc(nm(e))}</button>`).join('')}</div></div>`
    :'<div class="ground"></div>';
  return `<div class="scene bld"><div class="bld-in"><div class="roof"><span>${esc(nm(m))}</span></div><div class="facade">${fl}</div>${el}</div></div>`;
}

/* --- البحر: كل سنة عمق، والمواد أسماك --- */
function seaHTML(m){
  const yrs=byYear(m);let z='';
  for(let i=0;i<m.years;i++){
    const list=yrs[i];
    z+=`<section class="zone" style="--i:${i};--tc:${i<2?'#04303f':'#eaf6ff'}"><h3>${esc(t('yr',i+1))}</h3><div class="fishes">${list.length?list.map((c,k)=>`<button style="--d:-${((k*7)%11)*.55}s;--hu:${(k*37)%70-30}deg;--sz:${(85+(k*13)%31)/100}" ${itemAttrs(c,'fs'+(k%2?' flip':''))}><svg class="fsh" viewBox="0 0 64 36" aria-hidden="true"><use href="#fish"/></svg>${codeName(c)}</button>`).join(''):emptyYear()}</div></section>`;
  }
  const bubs=Array.from({length:12},(_,i)=>{const s=6+(i*7)%12;return `<i class="bub" style="left:${(i*83)%97}%;width:${s}px;height:${s}px;animation-duration:${9+(i*5)%9}s;animation-delay:-${(i*3)%11}s"></i>`}).join('');
  const el=m.electives.length
    ?`<div class="seabed"><h3>🐚 ${esc(t('electives'))}</h3><p>${esc(t('electivesSub'))}</p><div class="shells">${m.electives.map(e=>`<button ${eAttrs(e,'shell')}><span class="s">🐚</span><b>${esc(nm(e))}</b></button>`).join('')}</div></div>`
    :'<div class="seabed"></div>';
  return `<div class="scene sea"><div class="surface"><svg viewBox="0 0 1200 36" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18C100 0 200 36 300 18S500 0 600 18 800 36 900 18 1100 0 1200 18V36H0z" fill="hsl(190 72% 62%)"/></svg></div><div class="bubs" aria-hidden="true">${bubs}</div>${z}${el}</div>`;
}

/* --- الخلية: كل سنة طبقة (من الغشاء للنواة)، والمواد عُضيّات وبروتينات --- */
function layerKeys(n){
  const base=n>=5?['mem','cyt','er','mito','nuc']:{1:['nuc'],2:['cyt','nuc'],3:['mem','cyt','nuc'],4:['mem','cyt','mito','nuc']}[n];
  return base.concat(['nucl','dna','chr'].slice(0,Math.max(0,n-5)));
}
function cellHTML(m){
  const yrs=byYear(m),keys=layerKeys(m.years),L=t('layers');
  const build=i=>{
    if(i>=m.years)return '';
    const k=keys[i],list=yrs[i];
    return `<div class="cl cl-${k}"><h3>${esc(t('yr',i+1))} · ${esc(L[k])}</h3><div class="ogs">${list.length?list.map((c,j)=>`<button style="--d:-${((j*7)%11)*.3}s" ${itemAttrs(c,'ogb')}><span class="og og-${k}">${V.done.includes(c.id)?'✓':''}</span>${codeName(c)}</button>`).join(''):emptyYear()}</div>${build(i+1)}</div>`;
  };
  const el=m.electives.length
    ?`<div class="exo"><h3>🫧 ${esc(t('elCell'))}</h3><p>${esc(t('electivesSub'))}</p><div class="fallen">${m.electives.map(e=>`<button ${eAttrs(e,'pill')}><i class="dot"></i>${esc(nm(e))}</button>`).join('')}</div></div>`:'<div class="exo thin"></div>';
  return `<div class="scene bio"><div class="bio-in">${build(0)}</div>${el}</div>`;
}

/* --- الحاسوب: كل سنة مسار على اللوحة الأم، والمواد شرائح --- */
const LANE_KEYS=['psu','ram','ssd','cpu','gpu','nic','bios','fan'];
function pcHTML(m){
  const yrs=byYear(m),LN=t('lanes');let lanes='';
  for(let i=0;i<m.years;i++){
    const list=yrs[i],hasDone=list.some(c=>V.done.includes(c.id));
    lanes+=`<section class="lane${hasDone?' has-done':''}"><div class="lane-h">${esc(t('yr',i+1))} · ${esc(LN[LANE_KEYS[i]])}</div><div class="trace"></div><div class="ics">${list.length?list.map(c=>`<button ${itemAttrs(c,'ic')}><i class="led"></i>${codeName(c)}</button>`).join(''):emptyYear()}</div></section>`;
  }
  const el=m.electives.length
    ?`<div class="lane slots-w"><div class="lane-h">${esc(t('elPc'))}</div><div class="slots">${m.electives.map(e=>`<button ${eAttrs(e,'slot')}>${esc(nm(e))}</button>`).join('')}</div></div>`:'';
  return `<div class="scene pc"><div class="pc-in"><div class="silk">${esc(nm(m)).toUpperCase()} · MAINBOARD REV.2026</div>${lanes}${el}</div></div>`;
}

/* --- الدارة (BioCircuit): شبكة عقد، الخطوط = المتطلبات، والكهرباء بتمشي لما تنجز --- */
const YC=['#ffd166','#9bb0a8','#4cc9f0','#b388ff','#ff6bd6','#27f5a0','#ff9f43','#f87171'],YI=['🧮','🛠️','⚡','💾','🧠','🤖','🔬','🧬'];
function graphHTML(m){
  const B=V.byId,lvl={};
  const lv=id=>{if(lvl[id]!==undefined)return lvl[id];lvl[id]=0;const ps=B[id].pre.filter(p=>B[p]);return lvl[id]=ps.length?1+Math.max(...ps.map(lv)):0};
  const node=(x,attrs,color,ico)=>`<button style="--c:${color}" ${attrs}><span class="orb"><i class="ck">✔</i><b>${ico}</b></span><span class="lb"><em>${esc(x.id)}</em>${esc(nm(x))}</span></button>`;
  const bands=byYear(m).map((list,i)=>{
    const c=YC[i%8],ic=YI[i%8],dn=list.filter(x=>V.done.includes(x.id)).length;
    const sorted=[...list].sort((a,b)=>lv(a.id)-lv(b.id)||a.id.localeCompare(b.id));
    return `<section class="gband" style="--c:${c}"><div class="gb-h"><span class="gb-y"><b>${ic}</b>${esc(t('yr',i+1))}</span><span class="gb-p">${dn}/${list.length}</span></div><div class="gb-n">${sorted.length?sorted.map(x=>node(x,itemAttrs(x,'gnd'),c,ic)).join(''):emptyYear()}</div></section>`;
  }).join('');
  const el=m.electives.length?`<section class="gband" style="--c:#ff9f43"><div class="gb-h"><span class="gb-y"><b>🧬</b>${esc(t('electives'))}</span></div><div class="gb-n">${m.electives.map(e=>node(e,eAttrs(e,'gnd el'),'#ff9f43','🧬')).join('')}</div></section>`:'';
  return `<div class="scene gr"><div class="gr-in" id="gri"><svg class="gr-w" id="grw" aria-hidden="true"></svg>${bands}${el}</div></div>`;
}
// أسلاك الدارة: بتنقاس من مواقع العقد الفعلية فبتتكيّف مع أي عرض شاشة بدون سكرول داخلي
function gwires(){
  const w=$('grw'),box=$('gri');if(!w||!box||!V)return;
  const r=box.getBoundingClientRect(),els={};
  box.querySelectorAll('.gnd[data-id]').forEach(e=>{els[e.dataset.id]=e.querySelector('.orb')});
  w.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);let h='';
  V.major.courses.forEach(c=>c.pre.forEach(p=>{
    const a=els[p],b=els[c.id];if(!a||!b)return;
    const A=a.getBoundingClientRect(),Q=b.getBoundingClientRect();
    const x1=A.left+A.width/2-r.left,y1=A.top+A.height/2-r.top,x2=Q.left+Q.width/2-r.left,y2=Q.top+Q.height/2-r.top;
    const dy=y2-y1,k=Math.max(36,Math.abs(dy)*.5),sg=dy<0?-1:1;
    const d=Math.abs(dy)<10?`M${x1} ${y1}Q${(x1+x2)/2} ${y1-48} ${x2} ${y2}`:`M${x1} ${y1}C${x1} ${y1+sg*k},${x2} ${y2-sg*k},${x2} ${y2}`;
    const at=`data-s="${esc(p)}" data-t="${esc(c.id)}" d="${d}"`;
    h+=`<path class="ge" ${at}/><path class="gf${V.done.includes(p)?' on':''}" ${at}/>`;
  }));
  w.innerHTML=h;
}
const drawLines=()=>mode==='graph'?gwires():lines();

/* --- الخطة الكلاسيكية (الشكل الأصلي مع خطوط الربط) --- */
function classicHTML(m){
  const cols=byYear(m).map((list,i)=>`<div class="yc"><div class="yh">${esc(t('yr',i+1))}</div>${list.map(c=>`<button ${itemAttrs(c,'cc')}><div class="c">${esc(c.id)}</div><div class="t">${esc(nm(c))}</div>${c.pre.some(p=>V.byId[p])?`<div class="p">${esc(t('prereqShort'))}${c.pre.filter(p=>V.byId[p]).map(p=>esc(nm(V.byId[p]))).join(esc(t('sep')))}</div>`:''}</button>`).join('')}</div>`).join('');
  const el=m.electives.length
    ?`<section class="gs"><h2>🪨 ${esc(t('electives'))}</h2><p>${esc(t('electivesSub'))}</p><div class="st">${m.electives.map(e=>`<button ${eAttrs(e,'chip')}>${esc(nm(e))}</button>`).join('')}</div></section>`:'';
  return `<div class="scroll"><div id="vp" style="--yn:${m.years}"><svg id="svg" aria-hidden="true"></svg><div class="yrs">${cols}</div></div></div>${el}`;
}
// رسم خطوط الربط بين المادة ومتطلباتها (أخضر = مكتمل، منقط = جاهز، رمادي = مقفل)
function lines(){
  const svg=$('svg'),vp=$('vp');if(!svg||!vp||!V)return;
  const r=vp.getBoundingClientRect(),rtl=lang==='ar';
  svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);svg.innerHTML='';
  const els={};vp.querySelectorAll('[data-id]').forEach(e=>{els[e.dataset.id]=e});
  V.major.courses.forEach(tc=>tc.pre.forEach(sid=>{
    const a=els[sid],b=els[tc.id];if(!a||!b)return;
    const A=a.getBoundingClientRect(),B=b.getBoundingClientRect(),s=rtl?-1:1;
    const y1=A.top+A.height/2-r.top,y2=B.top+B.height/2-r.top;let d;
    if(a.parentNode===b.parentNode){
      const x=(rtl?A.left:A.right)-r.left;
      d=`M${x} ${y1} C${x+s*22} ${y1},${x+s*22} ${y2},${x} ${y2}`;
    }else{
      const x1=(rtl?A.left:A.right)-r.left,x2=(rtl?B.right:B.left)-r.left,k=Math.abs(x2-x1)*.5;
      d=`M${x1} ${y1} C${x1+s*k} ${y1},${x2-s*k} ${y2},${x2} ${y2}`;
    }
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',d);
    const sd=V.done.includes(sid),td=V.done.includes(tc.id);
    p.setAttribute('class',sd&&td?'active':sd?'ready':'');
    svg.appendChild(p);
  }));
}

/* ===== 7) هيكل الصفحة: الهيدر + المشهد ===== */
const LEGC={tree:['#7ea25c','#c0162f','#d4af37'],building:['#2a394f','#8fbfe3','#f4b942'],sea:['#6f8298','#ff8a5c','#f6c324'],graph:['#4a5a52','#27f5a0','#ffd166'],cell:['#9aa7a0','#f08a72','#f6c324'],pc:['#3a4048','#2dffb4','#d4af37'],classic:['#cbd5e1','#800020','#16a34a']};
const SCENES={graph:graphHTML,tree:treeHTML,building:bldHTML,sea:seaHTML,cell:cellHTML,pc:pcHTML,classic:classicHTML};
function viewerShell(){
  const m=V.major,meta=V.meta||{};
  const fn=[uniName(m),facName(m)].filter(Boolean).join(' · '),who=meta.user?`${fn?esc(fn)+' · ':''}${esc(meta.user.name)} · ${esc(meta.user.sid)}`:esc(fn||t('admSub'));
  const modes=['tree','building','sea','cell','pc','graph','classic'].map(k=>`<button data-act="mode" data-v="${k}" aria-pressed="${mode===k}">${esc(t('mode'+k[0].toUpperCase()+k.slice(1)))}</button>`).join('');
  const leg=t('leg'+mode[0].toUpperCase()+mode.slice(1)).map((s,i)=>`<span><i style="background:${LEGC[mode][i]}"></i>${esc(s)}</span>`).join('');
  $('app').innerHTML=`<header class="top"><div class="hc">
    <div class="brand">${logoHTML}<div><h1>${esc(nm(m))}</h1><div class="sub">${who}</div></div></div>
    <div class="ctl"><div class="modes" role="group">${modes}</div>
      <button class="btn" data-act="lang">${esc(t('langBtn'))}</button>
      <div class="pw"><div class="pb"><div id="pf"></div></div><span id="pt" style="font-weight:700"></span></div>
      <button class="btn btn-d" data-act="reset">${esc(t('reset'))}</button>
      ${meta.preview?`<button class="btn btn-w" data-act="back">${esc(t('back'))}</button>`:`<button class="btn btn-w" data-act="logout">${esc(t('logout'))}</button>`}
    </div></div></header>
    ${meta.preview?`<div class="banner">${esc(t('preview'))}</div>`:''}
    <div class="legend">${leg}</div><main class="stage" id="stage"></main>`;
  stage();
}
function stage(){
  unhover();
  const cur=document.activeElement,fid=cur&&cur.dataset&&cur.dataset.id;
  $('stage').innerHTML=(SCENES[mode]||treeHTML)(V.major);
  const p=prog();$('pf').style.width=p.pct+'%';$('pt').textContent=`${p.pct}% · ${p.hrs} ${t('hrsUnit')}`;
  if(mode==='graph')gwires();
  if(mode==='classic'||mode==='graph')requestAnimationFrame(drawLines);
  if(fid){const el=$('stage').querySelector(`[data-id="${CSS.escape(fid)}"]`);if(el)el.focus({preventScroll:true})}
}

/* ===== 8) تلميح عند المرور + إبراز المتطلبات والمواد المعتمدة ===== */
let hoverId=null,tipTimer;
function showTip(el){
  const tip=$('tip'),id=el.dataset.id,c=V.byId[id],x=c||V.eById[id];if(!x)return;
  let h=`<div class="tn">${esc(nm(x))}</div>`;
  if(c){
    h+=`<div class="tc">${esc(c.id)} · ${esc(t('hrsTip',c.h??3))}</div>`;
    const pre=c.pre.filter(p=>V.byId[p]);
    if(pre.length)h+=`<div class="tp">${esc(t('prereq'))}<br>${pre.map(p=>{const ok=V.done.includes(p);return `<span class="${ok?'ok':'no'}">${ok?'✓':'✗'} ${esc(nm(V.byId[p]))}</span>`}).join('<br>')}</div>`;
  }
  h+=`<div class="th">${esc(c&&stOf(c)==='lock'?t('tipLock'):V.done.includes(id)?t('tipUndo'):t('tipDo'))}</div>`;
  tip.innerHTML=h;tip.classList.add('on');
  const r=el.getBoundingClientRect(),w=tip.offsetWidth,hh=tip.offsetHeight;
  const left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2));
  let top=r.top-hh-10;if(top<8)top=r.bottom+10;
  tip.style.left=left+'px';tip.style.top=top+'px';
}
function hover(el){
  const id=el?el.dataset.id:null;
  if(id===hoverId)return;
  unhover();if(!id)return;hoverId=id;showTip(el);
  // على شاشات اللمس ما في mouseleave، فبنخفي التلميح تلقائياً
  if(matchMedia('(hover:none)').matches){clearTimeout(tipTimer);tipTimer=setTimeout(unhover,1800)}
  const c=V.byId[id];if(!c)return;
  const st=$('stage'),mark=(ids,cls)=>ids.forEach(i=>st.querySelectorAll(`[data-id="${CSS.escape(i)}"]`).forEach(e=>e.classList.add(cls)));
  mark(c.pre,'hl-pre');mark(kids(id),'hl-dep');
  if(mode==='graph')st.querySelectorAll(`.ge,.gf`).forEach(e=>{if(e.dataset.s===id||e.dataset.t===id)e.classList.add('hl')});
}
function unhover(){
  hoverId=null;const tip=$('tip');if(tip)tip.classList.remove('on');
  document.querySelectorAll('.hl-pre,.hl-dep,.ge.hl,.gf.hl').forEach(e=>e.classList.remove('hl-pre','hl-dep','hl'));
}

/* ===== 9) تأثيرات الحركة عند الإنجاز ===== */
const BURST={graph:['⚡','✦','•'],tree:['🍃','🌿','✨'],building:['✨','💡'],sea:['bub'],cell:['⚡','✦','•'],pc:['bit0','bit1','⚡'],classic:['✨']};
function fx(id,cls,unlock){
  const st=$('stage');if(!st)return;
  const q=i=>st.querySelector(`[data-id="${CSS.escape(i)}"]`),el=q(id);
  if(el){el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),1000);if(cls==='fx-on')burst(el)}
  if(mode==='graph')st.querySelectorAll(`.gf[data-s="${CSS.escape(id)}"]`).forEach(e=>e.classList.add('zap'));
  unlock.forEach(i=>{const u=q(i);if(u){u.classList.add('fx-unlock');setTimeout(()=>u.classList.remove('fx-unlock'),1500)}});
}
function burst(el){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const ic=el.querySelector('.fruit,.fsh,.og,.orb')||el,r=ic.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2,k=BURST[mode]||BURST.tree,n=11;
  for(let i=0;i<n;i++){
    const sp=document.createElement('span'),a=Math.PI*2*i/n+Math.random()*.5,d=36+Math.random()*46,sym=k[i%k.length];
    sp.className='fxp'+(sym==='bub'?' bub':sym.startsWith('bit')?' bit':'');
    sp.textContent=sym==='bub'?'':sym.startsWith('bit')?sym.slice(3):sym;
    sp.style.cssText=`left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-20}px`;
    document.body.appendChild(sp);setTimeout(()=>sp.remove(),1050);
  }
}
