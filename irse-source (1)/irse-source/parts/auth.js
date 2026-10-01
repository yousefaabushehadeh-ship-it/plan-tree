
/* ===== 9) تسجيل الدخول: طالب / مدير ===== */

function authHTML(){
  const stu=AUTH.tab==='student',signup=AUTH.sub==='signup';
  let form;
  if(!stu){
    form=`<form data-form="adminLogin" autocomplete="on">
      <div class="fld"><label for="au">${esc(t('fUser'))}</label><input id="au" name="user" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="username" required></div>
      <div class="fld"><label for="ap">${esc(t('fPw'))}</label><input id="ap" name="pw" type="password" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="current-password" required></div>
      <label class="showpw"><input type="checkbox" data-act="showpw"> ${esc(t('showPw'))}</label><div class="err" id="autherr" role="alert"></div><button class="btn btn-m full">${esc(t('login'))}</button></form>`;
  }else if(!signup){
    form=`<form data-form="stuLogin">
      <div class="fld"><label for="ls">${esc(t('fSid'))}</label><input id="ls" name="sid" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="username" required></div>
      <div class="fld"><label for="lp">${esc(t('fPw'))}</label><input id="lp" name="pw" type="password" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="current-password" required></div>
      <label class="showpw"><input type="checkbox" data-act="showpw"> ${esc(t('showPw'))}</label><div class="err" id="autherr" role="alert"></div><button class="btn btn-m full">${esc(t('login'))}</button></form>
      <p class="swap">${esc(t('noAcc'))} <button class="link" data-act="asub" data-v="signup">${esc(t('signup'))}</button></p>`;
  }else{
    form=DB.majors.length?`<form data-form="stuSignup">
      <div class="fld"><label for="sn">${esc(t('fName'))}</label><input id="sn" name="nm" autocomplete="name" required></div>
      <div class="fld"><label for="ss">${esc(t('fSid'))}</label><input id="ss" name="sid" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="username" required></div>
      <div class="fld"><label for="sp">${esc(t('fPw'))}</label><input id="sp" name="pw" type="password" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="new-password" minlength="6" required></div>
      <div class="fld"><label for="su">${esc(t('fUni'))}</label><select id="su" name="uni" data-chg="uni" required>${uniOptions('',true)}</select></div>
      <div class="fld"><label for="sf">${esc(t('fFaculty'))}</label><select id="sf" name="fac" data-chg="fac" required disabled>${facOptions('','')}</select></div>
      <div class="fld"><label for="sm">${esc(t('fMajor'))}</label><select id="sm" name="major" required disabled>${majorOptions('','')}</select><small>${esc(t('majorHint'))}</small></div>
      <label class="showpw"><input type="checkbox" data-act="showpw"> ${esc(t('showPw'))}</label><div class="err" id="autherr" role="alert"></div><button class="btn btn-m full">${esc(t('signup'))}</button></form>`
      :`<p class="empty">${esc(t('noMajors'))}</p>`;
    form+=`<p class="swap">${esc(t('haveAcc'))} <button class="link" data-act="asub" data-v="login">${esc(t('login'))}</button></p>`;
  }
  return `<div class="auth"><button class="btn auth-lang" data-act="lang">${esc(t('langBtn'))}</button>
    <div class="auth-card"><div class="auth-brand">${logoHTML}<h1>${esc(t('appName'))}</h1><p>${esc(t('uni'))}</p></div>
    <div class="tabs" role="tablist"><button role="tab" aria-selected="${stu}" data-act="atab" data-v="student">${esc(t('tabStudent'))}</button><button role="tab" aria-selected="${!stu}" data-act="atab" data-v="admin">${esc(t('tabAdmin'))}</button></div>
    ${form}</div></div>`;
}
const authErr=k=>{const e=$('autherr');if(e)e.textContent=t(k);return false};
function signIn(role,sid){SES=role==='admin'?{role:'admin'}:{role:'student',sid};ls.set('aum2_ses',SES);go()}

const FORMS={
  stuLogin(f){
    const sid=f.elements.sid.value.trim(),u=USERS.find(x=>x.sid.toLowerCase()===sid.toLowerCase());
    if(!u||u.ph!==hashPw(u.sid,f.elements.pw.value.trim()))return authErr('badLogin');
    signIn('student',u.sid);
  },
  stuSignup(f){
    const nmv=f.elements.nm.value.trim(),sid=f.elements.sid.value.trim(),pw=f.elements.pw.value.trim(),uni=f.elements.uni.value,fac=f.elements.fac.value,mj=f.elements.major.value;
    if(nmv.length<2)return authErr('needName');
    if(!sid)return authErr('needSid');
    if(pw.length<6)return authErr('shortPw');
    if(!uniOf(uni))return authErr('needUniversity');
    if(!facOf(fac)||facOf(fac).uid!==uni)return authErr('needFaculty');
    if(!majorOf(mj)||majorOf(mj).fid!==fac)return authErr('needMajor');
    if(USERS.some(x=>x.sid.toLowerCase()===sid.toLowerCase()))return authErr('sidTaken');
    USERS.push({sid,name:nmv,ph:hashPw(sid,pw),majorId:mj,done:[],created:Date.now()});
    saveUsers();signIn('student',sid);
  },
  adminLogin(f){
    if(f.elements.user.value.trim().toLowerCase()!==ADMIN_USER||hashPw(ADMIN_USER,f.elements.pw.value.trim())!==adminHash())return authErr('badAdmin');
    signIn('admin');
  },
  pickMajor(f){
    const m=majorOf(f.elements.major.value);if(!m)return;
    const u=USERS.find(x=>x.sid===SES.sid);if(u){u.majorId=m.id;saveUsers();go()}
  }
};

function pickMajorScreen(u){
  $('app').innerHTML=`<div class="auth"><button class="btn auth-lang" data-act="lang">${esc(t('langBtn'))}</button>
   <div class="auth-card"><div class="auth-brand">${logoHTML}<h1>${esc(t('pickTitle'))}</h1><p>${esc(u.name)} · ${esc(u.sid)}</p></div>
   ${DB.majors.length?`<form data-form="pickMajor" style="margin-top:18px"><p class="mu" style="margin-bottom:14px">${esc(t('pickText'))}</p>
     <div class="fld"><label for="pu2">${esc(t('fUni'))}</label><select id="pu2" name="uni" data-chg="uni" required>${uniOptions('',true)}</select></div>
      <div class="fld"><label for="pf2">${esc(t('fFaculty'))}</label><select id="pf2" name="fac" data-chg="fac" required disabled>${facOptions('','')}</select></div>
     <div class="fld"><label for="pm">${esc(t('fMajor'))}</label><select id="pm" name="major" required disabled>${majorOptions('','')}</select></div>
     <button class="btn btn-m full">${esc(t('pickBtn'))}</button></form>`:`<p class="empty">${esc(t('noMajors'))}</p>`}
   <p class="swap"><button class="link" data-act="logout">${esc(t('logout'))}</button></p></div></div>`;
}
