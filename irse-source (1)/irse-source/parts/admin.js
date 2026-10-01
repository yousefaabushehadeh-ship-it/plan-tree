
/* ===== 10) لوحة المدير ===== */
const curMajor=()=>{const m=majorOf(ADM.mid)||DB.majors[0];if(m)ADM.mid=m.id;return m};
const studentsOf=id=>USERS.filter(u=>u.majorId===id).length;
function userProg(u){
  const m=majorOf(u.majorId);if(!m)return 0;
  const ids=new Set([...m.courses,...m.electives].map(x=>x.id));
  return ids.size?Math.round(u.done.filter(x=>ids.has(x)).length/ids.size*100):0;
}
const noMajorsBox=()=>`<div class="panel"><p class="empty">${esc(t('emptyMajors'))}</p></div>`;

function adminShell(){
  const tabs=['universities','faculties','majors','courses','electives','students','data'].map(k=>`<button role="tab" aria-selected="${ADM.tab===k}" data-act="atabAdm" data-v="${k}">${esc(t('a'+k[0].toUpperCase()+k.slice(1)))}</button>`).join('');
  $('app').innerHTML=`<header class="top"><div class="hc"><div class="brand">${logoHTML}<div><h1>${esc(t('admTitle'))}</h1><div class="sub">${esc(t('admSub'))}</div></div></div>
    <div class="ctl"><button class="btn" data-act="lang">${esc(t('langBtn'))}</button><button class="btn btn-w" data-act="logout">${esc(t('logout'))}</button></div></div></header>
    <div class="adm"><nav class="tabs" role="tablist">${tabs}</nav><div id="admBody"></div></div>`;
  admBody();
}
function admBody(){
  const f={universities:admUniversities,faculties:admFaculties,majors:admMajors,courses:admCourses,electives:admElectives,students:admStudents,data:admData}[ADM.tab];
  $('admBody').innerHTML=f();
}

/* --- الجامعات --- */
function admUniversities(){
  const rows=DB.universities.map(u=>{const fs=DB.faculties.filter(f=>f.uid===u.id),ms=DB.majors.filter(m=>fs.some(f=>f.id===m.fid)).length;return `<tr><td>${esc(nm(u))}<div class="mu">${esc(lang==='ar'?u.en:u.ar)}</div></td><td>${fs.length}</td><td>${ms}</td>
    <td><div class="acts"><button class="btn btn-o btn-s" data-act="uniEdit" data-k="${esc(u.id)}">${esc(t('edit'))}</button><button class="btn btn-d btn-s" data-act="uniDel" data-k="${esc(u.id)}">${esc(t('del'))}</button></div></td></tr>`}).join('');
  return `<div class="bar"><h2>${esc(t('aUniversities'))}</h2><button class="btn btn-m" data-act="uniNew">+ ${esc(t('addUniversity'))}</button></div>
    ${DB.universities.length?`<div class="tw"><table class="tbl"><thead><tr><th>${esc(t('colUniversity'))}</th><th>${esc(t('colFacs'))}</th><th>${esc(t('colDepts'))}</th><th>${esc(t('colAct'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="panel"><p class="empty">${esc(t('emptyUniversities'))}</p></div>`}`;
}

/* --- الكليات --- */
const studentsOfFac=id=>USERS.filter(u=>{const m=majorOf(u.majorId);return m&&m.fid===id}).length;
function admFaculties(){
  const rows=DB.faculties.map(f=>{const n=DB.majors.filter(m=>m.fid===f.id).length;return `<tr><td>${esc(nm(f))}<div class="mu">${esc(lang==='ar'?f.en:f.ar)}</div></td><td>${esc(nm(uniOf(f.uid))||'—')}</td><td>${n}</td><td>${studentsOfFac(f.id)}</td>
    <td><div class="acts"><button class="btn btn-o btn-s" data-act="facEdit" data-k="${esc(f.id)}">${esc(t('edit'))}</button><button class="btn btn-d btn-s" data-act="facDel" data-k="${esc(f.id)}">${esc(t('del'))}</button></div></td></tr>`}).join('');
  return `<div class="bar"><h2>${esc(t('aFaculties'))}</h2><button class="btn btn-m" data-act="facNew">+ ${esc(t('addFaculty'))}</button></div>
    ${DB.faculties.length?`<div class="tw"><table class="tbl"><thead><tr><th>${esc(t('colFaculty'))}</th><th>${esc(t('colUniversity'))}</th><th>${esc(t('colDepts'))}</th><th>${esc(t('aStudents'))}</th><th>${esc(t('colAct'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="panel"><p class="empty">${esc(t('emptyFaculties'))}</p></div>`}`;
}

/* --- الأقسام --- */
function admMajors(){
  const card=m=>{
    const st=t('stats',m.years,m.courses.length,m.electives.length,studentsOf(m.id));
    return `<article class="mcard"><h3>${esc(nm(m))}</h3><div class="mu">${esc(lang==='ar'?m.en:m.ar)}</div>
      <div class="stats">${st.map(x=>`<span>${esc(x)}</span>`).join('')}</div>
      <div class="acts"><button class="btn btn-m btn-s" data-act="majorView" data-k="${esc(m.id)}">${esc(t('view'))}</button>
      <button class="btn btn-o btn-s" data-act="majorCourses" data-k="${esc(m.id)}">${esc(t('manage'))}</button>
      <button class="btn btn-o btn-s" data-act="majorEdit" data-k="${esc(m.id)}">${esc(t('edit'))}</button>
      <button class="btn btn-o btn-s" data-act="majorDup" data-k="${esc(m.id)}">${esc(t('dup'))}</button>
      <button class="btn btn-d btn-s" data-act="majorDel" data-k="${esc(m.id)}">${esc(t('del'))}</button></div></article>`;
  };
  const groups=DB.faculties.map(f=>{const ms=DB.majors.filter(m=>m.fid===f.id);return ms.length?`<h3 class="yh2">${esc(facFull(f))} <small>(${ms.length})</small></h3><div class="cards">${ms.map(card).join('')}</div>`:''}).join('');
  return `<div class="bar"><h2>${esc(t('aMajors'))}</h2><button class="btn btn-m" data-act="majorNew">+ ${esc(t('addMajor'))}</button></div>${DB.majors.length?groups:noMajorsBox()}`;
}

/* --- المواد --- */
function majorPicker(m){
  return `<select data-chg="admMajor" aria-label="${esc(t('fMajor'))}">${groupedMajors(m.id)}</select>`;
}
function admCourses(){
  const m=curMajor();if(!m)return noMajorsBox();
  return `<div class="bar"><div class="row">${majorPicker(m)}<input type="search" data-inp="crsq" placeholder="${esc(t('search'))}" value="${esc(ADM.q)}" aria-label="${esc(t('search'))}"></div>
    <button class="btn btn-m" data-act="courseNew">+ ${esc(t('addCourse'))}</button></div><div id="crsList">${crsList(m)}</div>`;
}
function crsList(m){
  const q=(ADM.q||'').trim().toLowerCase();let out='';
  for(let y=1;y<=m.years;y++){
    const list=m.courses.filter(c=>Math.min(m.years,c.y)===y&&(!q||(c.id+' '+c.ar+' '+c.en).toLowerCase().includes(q)));
    if(q&&!list.length)continue;
    out+=`<h3 class="yh2">${esc(t('yr',y))} <small>(${list.length})</small></h3>`;
    if(!list.length){out+=`<p class="empty">${esc(t('noCourses'))}</p>`;continue}
    out+=`<div class="tw"><table class="tbl"><thead><tr><th>${esc(t('colCode'))}</th><th>${esc(t('colName'))}</th><th>${esc(t('hrsUnit'))}</th><th>${esc(t('colPre'))}</th><th>${esc(t('colAct'))}</th></tr></thead><tbody>${list.map(c=>`<tr>
      <td class="code">${esc(c.id)}</td><td>${esc(nm(c))}<div class="mu">${esc(lang==='ar'?c.en:c.ar)}</div></td><td>${c.h??3}</td>
      <td><div class="chips">${c.pre.map(p=>`<span title="${esc(nm(m.courses.find(x=>x.id===p)))}">${esc(p)}</span>`).join('')}</div></td>
      <td><div class="acts"><button class="btn btn-o btn-s" data-act="courseEdit" data-k="${esc(c.id)}">${esc(t('edit'))}</button><button class="btn btn-d btn-s" data-act="courseDel" data-k="${esc(c.id)}">${esc(t('del'))}</button></div></td></tr>`).join('')}</tbody></table></div>`;
  }
  return out||`<p class="empty">${esc(t('noCourses'))}</p>`;
}

/* --- الاختياريات --- */
function admElectives(){
  const m=curMajor();if(!m)return noMajorsBox();
  const rows=m.electives.map(e=>`<tr><td>${esc(nm(e))}<div class="mu">${esc(lang==='ar'?e.en:e.ar)}</div></td>
    <td><div class="acts"><button class="btn btn-o btn-s" data-act="elEdit" data-k="${esc(e.id)}">${esc(t('edit'))}</button><button class="btn btn-d btn-s" data-act="elDel" data-k="${esc(e.id)}">${esc(t('del'))}</button></div></td></tr>`).join('');
  return `<div class="bar"><div class="row">${majorPicker(m)}</div><button class="btn btn-m" data-act="elNew">+ ${esc(t('addElective'))}</button></div>
    ${m.electives.length?`<div class="tw"><table class="tbl"><thead><tr><th>${esc(t('colName'))}</th><th>${esc(t('colAct'))}</th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="panel"><p class="empty">${esc(t('noCourses'))}</p></div>`}`;
}

/* --- الطلاب --- */
function admStudents(){
  if(!USERS.length)return `<div class="panel"><p class="empty">${esc(t('noStudents'))}</p></div><p class="mu" style="margin-top:10px">${esc(t('studentsNote'))}</p>`;
  const rows=USERS.map(u=>`<tr><td class="code">${esc(u.sid)}</td><td>${esc(u.name)}</td>
    <td><select data-chg="stuMajor" data-k="${esc(u.sid)}" aria-label="${esc(t('colMajor'))}">${groupedMajors(u.majorId,t('colNoMajor'))}</select></td>
    <td>${userProg(u)}%</td>
    <td><div class="acts"><button class="btn btn-o btn-s" data-act="stReset" data-k="${esc(u.sid)}">${esc(t('resetProg'))}</button><button class="btn btn-o btn-s" data-act="stPw" data-k="${esc(u.sid)}">${esc(t('resetPw'))}</button><button class="btn btn-d btn-s" data-act="stDel" data-k="${esc(u.sid)}">${esc(t('del'))}</button></div></td></tr>`).join('');
  return `<div class="bar"><h2>${esc(t('aStudents'))} (${USERS.length})</h2></div><div class="tw"><table class="tbl"><thead><tr><th>${esc(t('colId'))}</th><th>${esc(t('fName'))}</th><th>${esc(t('colMajor'))}</th><th>${esc(t('colProg'))}</th><th>${esc(t('colAct'))}</th></tr></thead><tbody>${rows}</tbody></table></div><p class="mu">${esc(t('studentsNote'))}</p>`;
}

/* --- البيانات --- */
function admData(){
  const card=(h,p,act,btn,extra='')=>`<div class="panel"><h3>${esc(t(h))}</h3><p>${esc(t(p))}</p><button class="btn btn-m" data-act="${act}">${esc(t(btn))}</button>${extra}</div>`;
  return `<div class="grid2">
    ${card('dExport','dExportP','expData','btnExport')}
    ${card('dImport','dImportP','impData','btnImport','<input type="file" id="impFile" accept=".json,application/json" hidden>')}
    ${card('dCsv','dCsvP','expCsv','btnCsv')}
    ${card('dReset','dResetP','resetData','btnReset')}
    <div class="panel"><h3>${esc(t('dPw'))}</h3><p>${esc(t('dPwP'))}</p>
      <form data-form="adminPw" class="row"><input name="pw" type="password" minlength="6" required autocomplete="new-password" placeholder="${esc(t('newPw'))}" aria-label="${esc(t('newPw'))}"><button class="btn btn-m">${esc(t('btnPw'))}</button></form>
      <div id="pwOut"></div></div></div>`;
}

/* ===== نوافذ الإدخال ===== */
const dlg=$('dlg');
function openDlg(html,onSubmit){
  dlg.innerHTML=`<form class="dlg-b" id="dform">${html}<div class="err" role="alert"></div><div class="dlg-act"><button type="button" class="btn btn-o" data-act="closeDlg">${esc(t('cancel'))}</button><button class="btn btn-m">${esc(t('save'))}</button></div></form>`;
  const f=$('dform');
  f.onsubmit=e=>{e.preventDefault();const msg=onSubmit(f);if(msg){f.querySelector('.err').textContent=msg;return}dlg.close()};
  if(!dlg.open)dlg.showModal();
}
const fld=(id,label,inner,hint)=>`<div class="fld"><label for="${id}">${esc(label)}</label>${inner}${hint?`<small>${esc(hint)}</small>`:''}</div>`;
const nameFields=(o,l1,l2)=>fld('f_ar',t(l1),`<input id="f_ar" name="ar" value="${esc(o&&o.ar)}" maxlength="120">`)+fld('f_en',t(l2),`<input id="f_en" name="en" value="${esc(o&&o.en)}" maxlength="120" dir="ltr">`);
const refresh=()=>{admBody();};

function majorForm(id){
  const m=id?majorOf(id):null;
  openDlg(`<h2>${esc(m?t('editMajor'):t('addMajor'))}</h2>${fld('f_fac',t('fFaculty'),`<select id="f_fac" name="fid" required>${facGrouped(m?m.fid:'')}</select>`)}${nameFields(m,'majorAr','majorEn')}${fld('f_y',t('years'),`<input id="f_y" name="years" type="number" min="1" max="8" value="${m?m.years:5}">`)}`,f=>{
    const ar=f.elements.ar.value.trim(),en=f.elements.en.value.trim(),y=parseInt(f.elements.years.value),fid=f.elements.fid.value;
    if(!facOf(fid))return t('errNeedFaculty');
    if(!ar&&!en)return t('errNeedName');
    if(!(y>=1&&y<=8))return t('errYears');
    if(m){
      const mx=Math.max(0,...m.courses.map(c=>c.y));if(y<mx)return t('errYearsLow',mx);
      Object.assign(m,{fid,ar,en,years:y});
    }else{
      DB.majors.push({id:uid('m_'),fid,ar,en,years:y,courses:[],electives:[]});
    }
    saveDB();refresh();
  });
}
function universityForm(id){
  const u0=id?uniOf(id):null;
  openDlg(`<h2>${esc(u0?t('editUniversity'):t('addUniversity'))}</h2>${nameFields(u0,'uniAr','uniEn')}`,f=>{
    const ar=f.elements.ar.value.trim(),en=f.elements.en.value.trim();
    if(!ar&&!en)return t('errNeedName');
    if(u0)Object.assign(u0,{ar,en});else DB.universities.push({id:uid('u_'),ar,en});
    saveDB();refresh();
  });
}
function facultyForm(id){
  const f0=id?facOf(id):null;
  openDlg(`<h2>${esc(f0?t('editFaculty'):t('addFaculty'))}</h2>${fld('f_uni',t('fUni'),`<select id="f_uni" name="uni" required><option value="">${esc(t('chooseUni'))}</option>${optsOf(DB.universities,f0?f0.uid:'')}</select>`)}${nameFields(f0,'facAr','facEn')}`,f=>{
    const ar=f.elements.ar.value.trim(),en=f.elements.en.value.trim(),u=f.elements.uni.value;
    if(!uniOf(u))return t('needUniversity');
    if(!ar&&!en)return t('errNeedName');
    if(f0)Object.assign(f0,{uid:u,ar,en});else DB.faculties.push({id:uid('f_'),uid:u,ar,en});
    saveDB();refresh();
  });
}
function courseForm(id){
  const m=curMajor(),c=id?m.courses.find(x=>x.id===id):null;
  const sel=new Set(c?c.pre:[]);
  const others=m.courses.filter(x=>x.id!==id);
  const pre=others.length?`<div class="pre-list" id="prelist">${others.map(x=>`<label class="pre-i" data-s="${esc((x.id+' '+x.ar+' '+x.en).toLowerCase())}"><input type="checkbox" name="pre" value="${esc(x.id)}"${sel.has(x.id)?' checked':''}><span><b>${esc(x.id)}</b> ${esc(nm(x))}</span></label>`).join('')}</div>`:`<p class="mu">—</p>`;
  const years=Array.from({length:m.years},(_,i)=>`<option value="${i+1}"${c&&c.y===i+1?' selected':''}>${esc(t('yr',i+1))}</option>`).join('');
  openDlg(`<h2>${esc(c?t('editCourse'):t('addCourse'))}</h2>
    ${fld('f_id',t('cCode'),`<input id="f_id" name="id" value="${esc(c&&c.id)}" maxlength="24" dir="ltr"${c?' readonly':''} required>`,t('cCodeHint'))}
    ${fld('f_yr',t('cYear'),`<select id="f_yr" name="y">${years}</select>`)}
    ${nameFields(c,'cAr','cEn')}
    ${fld('f_h',t('cHours'),`<input id="f_h" name="h" type="number" min="0" max="12" value="${c?(c.h??3):3}">`)}
    <div class="fld"><label>${esc(t('cPre'))}</label>${others.length>8?`<input type="search" data-inp="preq" placeholder="${esc(t('search'))}" aria-label="${esc(t('search'))}">`:''}${pre}</div>`,f=>{
    const code=f.elements.id.value.trim(),ar=f.elements.ar.value.trim(),en=f.elements.en.value.trim(),y=parseInt(f.elements.y.value);
    if(!c){
      if(!/^[A-Za-z0-9._-]{1,24}$/.test(code)||/^e_/i.test(code))return t('errCode');
      if(m.courses.some(x=>x.id===code))return t('errCodeUsed');
    }
    if(!ar&&!en)return t('errNeedName');
    const h=parseInt(f.elements.h.value);if(!(h>=0&&h<=12))return t('errHours');
    const picked=[...f.querySelectorAll('input[name=pre]:checked')].map(i=>i.value);
    if(c)for(const p of picked)if(dependsOn(m,p,c.id))return t('errCycle',nm(m.courses.find(x=>x.id===p)));
    if(c)Object.assign(c,{y,h,ar,en,pre:picked});
    else m.courses.push({id:code,y,h,ar,en,pre:picked});
    saveDB();refresh();
  });
}
// هل المادة start بتعتمد (مباشرة أو بشكل غير مباشر) على المادة target؟
function dependsOn(m,start,target){
  const seen=new Set(),st=[start];
  while(st.length){
    const id=st.pop();if(id===target)return true;if(seen.has(id))continue;seen.add(id);
    const c=m.courses.find(x=>x.id===id);if(c)c.pre.forEach(p=>st.push(p));
  }
  return false;
}
function electiveForm(id){
  const m=curMajor(),e=id?m.electives.find(x=>x.id===id):null;
  openDlg(`<h2>${esc(e?t('editElective'):t('addElective'))}</h2>${nameFields(e,'nameAr','nameEn')}${fld('f_h',t('cHours'),`<input id="f_h" name="h" type="number" min="0" max="12" value="${e?(e.h??3):3}">`)}`,f=>{
    const ar=f.elements.ar.value.trim(),en=f.elements.en.value.trim(),h=parseInt(f.elements.h.value);
    if(!ar&&!en)return t('errNeedName');
    if(!(h>=0&&h<=12))return t('errHours');
    if(e)Object.assign(e,{h,ar,en});else m.electives.push({id:uid('e_'),h,ar,en});
    saveDB();refresh();
  });
}
function studentPwForm(sid){
  const u=USERS.find(x=>x.sid===sid);if(!u)return;
  openDlg(`<h2>${esc(t('resetPw'))} – ${esc(u.name)}</h2>${fld('f_p',t('newPw'),`<input id="f_p" name="pw" type="password" minlength="6" autocomplete="new-password" required>`)}`,f=>{
    const p=f.elements.pw.value.trim();if(p.length<6)return t('shortPw');
    u.ph=hashPw(u.sid,p);saveUsers();
  });
}

/* ===== تصدير / استيراد ===== */
function download(name,text,type){
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
}
const csvCell=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
function studentsCsv(){
  const rows=[[t('colId'),t('fName'),t('colUniversity'),t('colFaculty'),t('colMajor'),t('colProg')+' %']];
  USERS.forEach(u=>{const m=majorOf(u.majorId);rows.push([u.sid,u.name,m?uniName(m):'',m?facName(m):'',m?nm(m):'',userProg(u)])});
  return '\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
}
