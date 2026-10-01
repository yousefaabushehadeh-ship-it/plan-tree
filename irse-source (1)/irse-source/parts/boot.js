
/* ===== 11) الإجراءات وربط الأحداث ===== */
const refreshAdm=()=>admBody();
const A={
  lang(){lang=lang==='ar'?'en':'ar';ls.set('aum2_lang',lang);go()},
  atab(d){AUTH.tab=d.v;AUTH.sub='login';go()},
  asub(d){AUTH.sub=d.v;go()},
  showpw(d,b){const f=b.closest('form');f&&f.querySelectorAll('input[name=pw]').forEach(i=>{i.type=b.checked?'text':'password'})},
  logout(){SES=null;PREVIEW=null;ls.set('aum2_ses',null);AUTH={tab:'student',sub:'login'};go()},
  mode(d){mode=d.v;ls.set('aum2_mode',mode);viewerShell()},
  reset(){if(confirm(t('resetAsk'))){V.done=[];V.commit();stage()}},
  back(){PREVIEW=null;go()},
  closeDlg(){dlg.close()},
  atabAdm(d){ADM.tab=d.v;adminShell()},
  uniNew(){universityForm()},
  uniEdit(d){universityForm(d.k)},
  uniDel(d){const u=uniOf(d.k);if(!u)return;const n=DB.faculties.filter(f=>f.uid===u.id).length;if(n){toast(t('errUniHasFacs',n));return}if(!confirm(t('confirmDelUniversity',nm(u))))return;DB.universities=DB.universities.filter(x=>x.id!==u.id);saveDB();refreshAdm()},
  facNew(){if(!DB.universities.length){toast(t('needUniFirst'));A.atabAdm({v:'universities'});return}facultyForm()},
  facEdit(d){facultyForm(d.k)},
  facDel(d){
    const f=facOf(d.k);if(!f)return;
    const n=DB.majors.filter(m=>m.fid===f.id).length;
    if(n){toast(t('errFacHasMajors',n));return}
    if(!confirm(t('confirmDelFaculty',nm(f))))return;
    DB.faculties=DB.faculties.filter(x=>x.id!==f.id);saveDB();refreshAdm();
  },
  majorNew(){if(!DB.faculties.length){toast(t('needFacFirst'));A.atabAdm({v:'faculties'});return}majorForm()},
  majorEdit(d){majorForm(d.k)},
  majorView(d){PREVIEW=d.k;PDONE=[];go()},
  majorCourses(d){ADM.mid=d.k;ADM.q='';ADM.tab='courses';adminShell()},
  majorDup(d){
    const m=majorOf(d.k);if(!m)return;
    const c=JSON.parse(JSON.stringify(m));c.id=uid('m_');
    if(c.ar)c.ar+=' (نسخة)';if(c.en)c.en+=' (copy)';
    DB.majors.push(c);saveDB();refreshAdm();
  },
  majorDel(d){
    const m=majorOf(d.k);if(!m||!confirm(t('confirmDelMajor',nm(m),studentsOf(m.id))))return;
    DB.majors=DB.majors.filter(x=>x.id!==m.id);USERS.forEach(u=>{if(u.majorId===m.id)u.majorId=''});
    saveDB();saveUsers();refreshAdm();
  },
  courseNew(){courseForm()},
  courseEdit(d){courseForm(d.k)},
  courseDel(d){
    const m=curMajor(),c=m.courses.find(x=>x.id===d.k);if(!c||!confirm(t('confirmDelCourse',nm(c))))return;
    m.courses=m.courses.filter(x=>x.id!==c.id);m.courses.forEach(x=>{x.pre=x.pre.filter(p=>p!==c.id)});
    saveDB();refreshAdm();
  },
  elNew(){electiveForm()},
  elEdit(d){electiveForm(d.k)},
  elDel(d){
    const m=curMajor(),e=m.electives.find(x=>x.id===d.k);if(!e||!confirm(t('confirmDelElective',nm(e))))return;
    m.electives=m.electives.filter(x=>x.id!==e.id);saveDB();refreshAdm();
  },
  stReset(d){const u=USERS.find(x=>x.sid===d.k);if(u&&confirm(t('confirmResetProg',u.name))){u.done=[];saveUsers();refreshAdm()}},
  stPw(d){studentPwForm(d.k)},
  stDel(d){const u=USERS.find(x=>x.sid===d.k);if(u&&confirm(t('confirmDelStudent',u.name))){USERS=USERS.filter(x=>x!==u);saveUsers();refreshAdm()}},
  expData(){download('data.json',JSON.stringify({...DB,rev:Date.now()},null,1),'application/json')},
  impData(){$('impFile').click()},
  expCsv(){download('students.csv',studentsCsv(),'text/csv;charset=utf-8')},
  resetData(){if(confirm(t('confirmReset'))){DB=defaultDB();saveDB();refreshAdm()}}
};
FORMS.adminPw=f=>{
  const p=f.elements.pw.value.trim();if(p.length<6){toast(t('shortPw'));return}
  const h=hashPw(ADMIN_USER,p);ls.set('aum2_adminhash',h);
  $('pwOut').innerHTML=`<p class="mu" style="margin-top:10px">${esc(t('dPwDone'))}</p><code class="code-out">const ADMIN_HASH='${h}';</code>`;f.reset();
};

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');
  if(b){const f=A[b.dataset.act];if(f)f(b.dataset,b);return}
  const it=e.target.closest('#stage [data-id]');
  if(it&&V)toggle(it.dataset.id);
});
document.addEventListener('submit',e=>{
  const k=e.target.dataset&&e.target.dataset.form;if(!k)return;
  e.preventDefault();if(FORMS[k])FORMS[k](e.target);
});
document.addEventListener('change',e=>{
  const s=e.target;
  if(s.id==='impFile'){
    const file=s.files[0];if(!file)return;
    file.text().then(txt=>{
      try{
        const raw=JSON.parse(txt);if(!raw||!Array.isArray(raw.majors))throw 0;
        if(!confirm(t('confirmImport')))return;
        DB=sanitize(raw);saveDB();refreshAdm();toast(t('importOk'));
      }catch(err){toast(t('importBad'))}
    });
    s.value='';return;
  }
  const c=s.dataset&&s.dataset.chg;if(!c)return;
  if(c==='admMajor'){ADM.mid=s.value;ADM.q='';refreshAdm()}
  else if(c==='uni'){const fs=s.form.elements.fac,ms=s.form.elements.major;fs.innerHTML=facOptions(s.value,'');fs.disabled=!s.value;ms.innerHTML=majorOptions('','');ms.disabled=true}
  else if(c==='fac'){const ms=s.form.elements.major;ms.innerHTML=majorOptions(s.value,'');ms.disabled=!s.value}
  else if(c==='stuMajor'){const u=USERS.find(x=>x.sid===s.dataset.k);if(u){u.majorId=s.value;saveUsers();refreshAdm()}}
});
document.addEventListener('input',e=>{
  const s=e.target,k=s.dataset&&s.dataset.inp;if(!k)return;
  if(k==='crsq'){ADM.q=s.value;const m=curMajor();if(m)$('crsList').innerHTML=crsList(m)}
  else if(k==='preq'){const q=s.value.trim().toLowerCase();document.querySelectorAll('#prelist .pre-i').forEach(l=>{l.hidden=!!q&&!l.dataset.s.includes(q)})}
});
const appEl=$('app');
appEl.addEventListener('mouseover',e=>{if(!V||!$('stage'))return;const el=e.target.closest('#stage [data-id]');el?hover(el):unhover()});
appEl.addEventListener('mouseleave',()=>{if(V)unhover()});
appEl.addEventListener('focusin',e=>{if(!V)return;const el=e.target.closest('#stage [data-id]');if(el)hover(el)});
appEl.addEventListener('focusout',()=>{if(V)unhover()});
window.addEventListener('scroll',()=>{if(V)unhover()},{passive:true});
window.addEventListener('resize',()=>{if(V&&(mode==='classic'||mode==='graph'))drawLines()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(V&&(mode==='classic'||mode==='graph'))drawLines()});

/* ===== 12) التوجيه بين الشاشات + التشغيل ===== */
function go(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.title=t('appName')+' – AUM';
  unhover();V=null;
  if(SES&&SES.role==='admin'){
    const m=PREVIEW&&majorOf(PREVIEW);
    if(m){startViewer(m,PDONE,()=>{PDONE=V.done},{preview:true});viewerShell();return}
    PREVIEW=null;adminShell();return;
  }
  if(SES&&SES.role==='student'){
    const u=USERS.find(x=>x.sid===SES.sid);
    if(!u){SES=null;ls.set('aum2_ses',null);return go()}
    const m=majorOf(u.majorId);
    if(!m){pickMajorScreen(u);return}
    startViewer(m,u.done,()=>{u.done=V.done;saveUsers()},{user:u});viewerShell();return;
  }
  $('app').innerHTML=authHTML();
}
async function boot(){
  // لو في ملف data.json بجانب index.html (بعد ما المدير يصدّره) بنستعمله إذا كان أحدث
  try{
    const r=await Promise.race([fetch('data.json',{cache:'no-store'}),new Promise((_,j)=>setTimeout(j,1200))]);
    if(r&&r.ok){const d=await r.json();if(d&&Array.isArray(d.majors)){const s=sanitize(d);if(s.rev>(DB.rev||0)&&s.majors.length)DB=s}}
  }catch(e){}
  go();
}
boot();
