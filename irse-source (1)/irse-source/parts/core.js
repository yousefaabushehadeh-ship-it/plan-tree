
/* ===== 2) أدوات عامة ===== */
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const hashPw=(sid,p)=>sha256('aum|'+String(sid).toLowerCase()+'|'+p);
const adminHash=()=>ls.get('aum2_adminhash',null)||ADMIN_HASH;

/* تنظيف أي بيانات جاية من ملف أو استيراد قبل ما نستعملها */
function sanitize(d){
  const s=v=>String(v??'').slice(0,200);
  const hrs=v=>{const n=parseInt(v);return n>=0&&n<=12?n:3};
  let faculties=(Array.isArray(d&&d.faculties)?d.faculties:[]).filter(f=>f&&f.id).map(f=>({id:s(f.id),uid:s(f.uid),ar:s(f.ar),en:s(f.en)}));
  const rawMajors=(Array.isArray(d&&d.majors)?d.majors:[]).filter(m=>m&&m.id);
  // بيانات قديمة بدون كليات: منعمل كلية افتراضية ونحط فيها كل الأقسام
  if(!faculties.length&&rawMajors.length)faculties=[{id:'f_eng',uid:'',ar:'كلية الهندسة',en:'Faculty of Engineering'}];
  let universities=(Array.isArray(d&&d.universities)?d.universities:[]).filter(u=>u&&u.id).map(u=>({id:s(u.id),ar:s(u.ar),en:s(u.en)}));
  if(!universities.length&&faculties.length)universities=[{id:'u_aum',ar:'الجامعة الأميركية في مادبا',en:'American University of Madaba'}];
  const uids=new Set(universities.map(u=>u.id));
  faculties.forEach(f=>{if(!uids.has(f.uid))f.uid=universities[0].id});
  const fids=new Set(faculties.map(f=>f.id));
  const majors=rawMajors.map(m=>{
    const years=Math.min(8,Math.max(1,parseInt(m.years)||5));
    const seen=new Set();
    const courses=(Array.isArray(m.courses)?m.courses:[]).filter(c=>c&&c.id&&!seen.has(String(c.id))&&seen.add(String(c.id)))
      .map(c=>({id:s(c.id),y:Math.min(years,Math.max(1,parseInt(c.y)||1)),h:hrs(c.h),ar:s(c.ar),en:s(c.en),pre:Array.isArray(c.pre)?c.pre.map(s):[]}));
    const ids=new Set(courses.map(c=>c.id));
    courses.forEach(c=>{c.pre=c.pre.filter(p=>ids.has(p)&&p!==c.id)});
    const electives=(Array.isArray(m.electives)?m.electives:[]).filter(e=>e&&e.id).map(e=>({id:s(e.id),h:hrs(e.h),ar:s(e.ar),en:s(e.en)}));
    return{id:s(m.id),fid:fids.has(m.fid)?m.fid:faculties[0].id,ar:s(m.ar),en:s(m.en),years,courses,electives};
  });
  return{rev:+(d&&d.rev)||0,universities,faculties,majors};
}

/* ===== 3) نصوص الواجهة (عربي / English) ===== */
const ORD=['','الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة'];
const T={
ar:{
  fUni:'الجامعة',chooseUni:'اختر الجامعة…',chooseUniFirst:'اختر الجامعة أولاً',noUniFacs:'ما في كليات بهذه الجامعة بعد',needUniversity:'اختر الجامعة',aUniversities:'الجامعات',addUniversity:'إضافة جامعة',editUniversity:'تعديل الجامعة',uniAr:'اسم الجامعة (عربي)',uniEn:'اسم الجامعة (English)',needUniFirst:'أضف جامعة أولاً',emptyUniversities:'ما في جامعات بعد. أضف أول جامعة.',colUniversity:'الجامعة',colFacs:'الكليات',errUniHasFacs:n=>`فيها ${n} كلية. احذف الكليات أو انقلها لجامعة ثانية أولاً.`,confirmDelUniversity:n=>`حذف الجامعة «${n}»؟`,
  fFaculty:'الكلية',chooseFaculty:'اختر الكلية…',chooseFacFirst:'اختر الكلية أولاً',noFacMajors:'ما في أقسام بهذه الكلية بعد',needFaculty:'اختر الكلية',
 modeGraph:'🔬 دارة',legGraph:['مدار خافت: مقفلة','مدار نابض: جاهزة','مدار مضيء + كهرباء: منجزة'],modeCell:'🧬 خلية',modePc:'💻 حاسوب',hrsUnit:'س.م',hrsTip:n=>`${n} ساعة معتمدة`,cHours:'الساعات المعتمدة',errHours:'الساعات من 0 إلى 12',
 legCell:['عضية باهتة: مقفلة','عضية نابضة: جاهزة','عضية مضيئة (ATP): منجزة'],
 legPc:['شريحة مطفأة: مقفلة','ضوء أخضر: جاهزة للتركيب','شريحة مضيئة: منجزة'],
 layers:{mem:'الغشاء الخلوي',cyt:'السيتوبلازم',er:'الشبكة الإندوبلازمية',mito:'الميتوكوندريا',nuc:'النواة',nucl:'النُّوَيّة',dna:'الحمض النووي DNA',chr:'الكروماتين'},
 lanes:{psu:'⚡ مزوّد الطاقة',ram:'🧠 الذاكرة RAM',ssd:'💾 التخزين SSD',cpu:'🔲 المعالج CPU',gpu:'🎮 معالج الرسوميات GPU',nic:'🌐 كرت الشبكة',bios:'⚙️ البايوس BIOS',fan:'❄️ التبريد'},
 elCell:'خارج الخلية: الاختيارية والحرة',elPc:'منافذ التوسعة PCIe: الاختيارية والحرة',
 aFaculties:'الكليات',addFaculty:'إضافة كلية',editFaculty:'تعديل الكلية',facAr:'اسم الكلية (عربي)',facEn:'اسم الكلية (English)',
 needFacFirst:'أضف كلية أولاً',errNeedFaculty:'اختر الكلية',emptyFaculties:'ما في كليات بعد. أضف أول كلية.',colFaculty:'الكلية',colDepts:'الأقسام',
 errFacHasMajors:n=>`فيها ${n} قسم. احذف الأقسام أو انقلها لكلية ثانية أولاً.`,confirmDelFaculty:n=>`حذف الكلية «${n}»؟`,
 appName:'شجرة المواد التفاعلية',uni:'الجامعة الأميركية في مادبا',langBtn:'English',
 tabStudent:'طالب',tabAdmin:'مدير',login:'تسجيل الدخول',signup:'إنشاء حساب',noAcc:'ما عندك حساب؟',haveAcc:'عندك حساب؟',
 fName:'الاسم الكامل',fSid:'الرقم الجامعي',fPw:'كلمة المرور',fMajor:'القسم',fUser:'اسم المستخدم',
 majorHint:'بعد التسجيل بتظهر لك خطة هذا القسم مباشرة.',chooseMajor:'اختر القسم…',
 noMajors:'ما في أقسام بعد. لازم المدير يضيف قسماً أولاً.',
 badLogin:'الرقم الجامعي أو كلمة المرور غير صحيحة',badAdmin:'اسم المستخدم أو كلمة المرور غير صحيحة',
 sidTaken:'هذا الرقم الجامعي مسجّل مسبقاً',needName:'اكتب اسمك الكامل',needSid:'اكتب الرقم الجامعي',
 shortPw:'كلمة المرور 6 أحرف على الأقل',needMajor:'اختر قسماً',
 showPw:'إظهار كلمة المرور',logout:'تسجيل الخروج',yr:n=>`السنة ${ORD[n]||n}`,
 modeTree:'🌳 شجرة',modeBuilding:'🏢 عمارة',modeSea:'🌊 بحر',modeClassic:'📋 خطة',
 done:'مكتمل',reset:'إعادة ضبط',resetAsk:'هل تريد إلغاء شطب كل المواد؟',
 needPre:a=>`أنجز المتطلبات أولاً: ${a.join('، ')}`,prereq:'المتطلبات:',prereqShort:'🔗 متطلب: ',sep:'، ',
 tipLock:'مقفلة – أنجز المتطلبات أولاً',tipDo:'اضغط لتعليمها كمنجزة',tipUndo:'اضغط لإلغاء الإنجاز',
 noCourses:'ما في مواد بهاي السنة بعد',
 electives:'المواد الاختيارية والحرة',electivesSub:'مواد بدون متطلبات – اضغط عليها لما تنجزها',
 legTree:['ثمرة خضراء: مقفلة','ثمرة حمراء: جاهزة للقطف','ثمرة ذهبية: منجزة'],
 legBuilding:['شباك مطفأ: مقفل','شباك أزرق: جاهز','شباك مضيء: منجز'],
 legSea:['سمكة رمادية: مقفلة','سمكة برتقالية: جاهزة','سمكة ذهبية: منجزة'],
 legClassic:['بطاقة باهتة: مقفلة','بطاقة عادية: جاهزة','بطاقة خضراء: منجزة'],
 pickTitle:'اختر قسمك',pickText:'ما تم تعيين قسم لحسابك. اختر واحداً لتظهر لك خطته.',pickBtn:'عرض الخطة',
 preview:'معاينة الخطة – التقدم هنا ما بينحفظ',back:'العودة للوحة المدير',
 /* المدير */
 admTitle:'لوحة المدير',admSub:'إدارة الأقسام والمواد والطلاب',
 aMajors:'الأقسام',aCourses:'المواد',aElectives:'الاختياريات',aStudents:'الطلاب',aData:'البيانات',
 addMajor:'إضافة قسم',addCourse:'إضافة مادة',addElective:'إضافة اختيارية',editMajor:'تعديل القسم',editCourse:'تعديل المادة',editElective:'تعديل الاختيارية',
 edit:'تعديل',del:'حذف',dup:'نسخ',view:'عرض الخطة',manage:'إدارة المواد',save:'حفظ',cancel:'إلغاء',search:'بحث بالرمز أو الاسم…',
 majorAr:'اسم القسم (عربي)',majorEn:'اسم القسم (English)',years:'عدد السنوات',
 cCode:'رمز المادة',cCodeHint:'الرمز ما بينغيّر بعد الحفظ. حروف إنجليزية وأرقام و - _ .',cYear:'السنة',cAr:'اسم المادة (عربي)',cEn:'اسم المادة (English)',cPre:'المتطلبات السابقة',
 nameAr:'الاسم (عربي)',nameEn:'الاسم (English)',
 stats:(y,c,e,s)=>[`${y} سنوات`,`${c} مادة`,`${e} اختيارية`,`${s} طالب`],
 emptyMajors:'ما في أقسام بعد. أضف أول قسم.',
 confirmDelMajor:(n,s)=>`حذف قسم «${n}» مع كل مواده؟${s?`\nفيه ${s} طالب مسجلين فيه وبيصير لازم يختاروا قسماً جديداً.`:''}`,
 confirmDelCourse:n=>`حذف المادة «${n}»؟ رح تنشال من متطلبات المواد الثانية.`,
 confirmDelElective:n=>`حذف الاختيارية «${n}»؟`,
 confirmDelStudent:n=>`حذف حساب الطالب «${n}»؟`,
 errNeedName:'اكتب اسماً بالعربي أو الإنجليزي',errYears:'عدد السنوات من 1 إلى 8',
 errYearsLow:n=>`فيه مواد بالسنة ${n}. انقلها أو احذفها أولاً.`,
 errCode:'الرمز: حروف إنجليزية وأرقام و - _ . (حتى 24 خانة)',errCodeUsed:'هذا الرمز مستخدم بهذا القسم',
 errCycle:n=>`«${n}» بتعتمد على هاي المادة، فالربط بيعمل حلقة مغلقة`,
 colCode:'الرمز',colName:'الاسم',colPre:'المتطلبات',colAct:'إجراءات',colId:'الرقم الجامعي',colMajor:'القسم',colProg:'التقدم',colNoMajor:'— بدون قسم —',
 noStudents:'ما في طلاب مسجلين على هذا المتصفح.',
 studentsNote:'حسابات الطلاب بتنحفظ على جهاز/متصفح كل طالب. للمزامنة بين الأجهزة لازم قاعدة بيانات على سيرفر.',
 resetProg:'تصفير التقدم',resetPw:'كلمة مرور جديدة',newPw:'كلمة المرور الجديدة',confirmResetProg:n=>`تصفير تقدم «${n}»؟`,
 dExport:'تصدير الخطط',dExportP:'بينزل ملف data.json فيه كل الأقسام والمواد. حطه بجانب index.html على الاستضافة عشان يشوفه كل الطلاب.',
 dImport:'استيراد خطط',dImportP:'اختر ملف data.json (نفس صيغة التصدير). بيستبدل الخطط الحالية.',
 dCsv:'تصدير الطلاب (CSV)',dCsvP:'قائمة بالطلاب المسجلين على هذا المتصفح مع نسبة تقدم كل واحد.',
 dReset:'استرجاع الخطة الأصلية',dResetP:'بيحذف كل التعديلات ويرجع قسم الروبوتات فقط.',
 dPw:'تغيير كلمة مرور المدير',dPwP:'بتتغير على هذا المتصفح فوراً. عشان تنطبق على كل الأجهزة، انسخ السطر تحت وحطه مكان ADMIN_HASH بملف index.html.',
 dPwDone:'تم التغيير على هذا المتصفح.',
 btnExport:'تصدير',btnImport:'اختيار ملف',btnCsv:'تنزيل CSV',btnReset:'استرجاع',btnPw:'تغيير',
 importOk:'تم استيراد الخطط',importBad:'الملف غير صالح',confirmImport:'استبدال الخطط الحالية بمحتوى الملف؟',confirmReset:'حذف كل التعديلات واسترجاع الخطة الأصلية؟',
 saved:'تم الحفظ',deleted:'تم الحذف'
},
en:{
  fUni:'University',chooseUni:'Choose a university…',chooseUniFirst:'Choose a university first',noUniFacs:'This university has no faculties yet',needUniversity:'Choose a university',aUniversities:'Universities',addUniversity:'Add university',editUniversity:'Edit university',uniAr:'University name (Arabic)',uniEn:'University name (English)',needUniFirst:'Add a university first',emptyUniversities:'No universities yet. Add the first one.',colUniversity:'University',colFacs:'Faculties',errUniHasFacs:n=>`It has ${n} faculty(ies). Delete them or move them to another university first.`,confirmDelUniversity:n=>`Delete the university \"${n}\"?`,
  fFaculty:'Faculty',chooseFaculty:'Choose a faculty…',chooseFacFirst:'Choose a faculty first',noFacMajors:'This faculty has no departments yet',needFaculty:'Choose a faculty',
 modeGraph:'🔬 Circuit',legGraph:['Dim node: locked','Pulsing node: ready','Glowing node + current: done'],modeCell:'🧬 Cell',modePc:'💻 Computer',hrsUnit:'cr.',hrsTip:n=>`${n} credit hours`,cHours:'Credit hours',errHours:'Hours must be 0 to 12',
 legCell:['Dim organelle: locked','Pulsing organelle: ready','Glowing organelle (ATP): done'],
 legPc:['Dark chip: locked','Green light: ready to install','Lit chip: done'],
 layers:{mem:'Cell membrane',cyt:'Cytoplasm',er:'Endoplasmic reticulum',mito:'Mitochondria',nuc:'Nucleus',nucl:'Nucleolus',dna:'DNA',chr:'Chromatin'},
 lanes:{psu:'⚡ Power supply',ram:'🧠 Memory (RAM)',ssd:'💾 Storage (SSD)',cpu:'🔲 Processor (CPU)',gpu:'🎮 Graphics (GPU)',nic:'🌐 Network card',bios:'⚙️ BIOS',fan:'❄️ Cooling'},
 elCell:'Outside the cell: electives & free courses',elPc:'PCIe expansion slots: electives & free courses',
 aFaculties:'Faculties',addFaculty:'Add faculty',editFaculty:'Edit faculty',facAr:'Faculty name (Arabic)',facEn:'Faculty name (English)',
 needFacFirst:'Add a faculty first',errNeedFaculty:'Choose a faculty',emptyFaculties:'No faculties yet. Add the first one.',colFaculty:'Faculty',colDepts:'Departments',
 errFacHasMajors:n=>`It has ${n} department(s). Delete them or move them to another faculty first.`,confirmDelFaculty:n=>`Delete the faculty "${n}"?`,
 appName:'Interactive Course Map',uni:'American University of Madaba',langBtn:'العربية',
 tabStudent:'Student',tabAdmin:'Admin',login:'Log in',signup:'Create account',noAcc:'No account yet?',haveAcc:'Already registered?',
 fName:'Full name',fSid:'Student ID',fPw:'Password',fMajor:'Department',fUser:'Username',
 majorHint:'Your study plan for this department opens right after you sign up.',chooseMajor:'Choose a department…',
 noMajors:'There are no departments yet. An admin needs to add one first.',
 badLogin:'Wrong student ID or password',badAdmin:'Wrong username or password',
 sidTaken:'This student ID is already registered',needName:'Enter your full name',needSid:'Enter your student ID',
 shortPw:'Password must be at least 6 characters',needMajor:'Choose a department',
 showPw:'Show password',logout:'Log out',yr:n=>`Year ${n}`,
 modeTree:'🌳 Tree',modeBuilding:'🏢 Building',modeSea:'🌊 Sea',modeClassic:'📋 Plan',
 done:'Done',reset:'Reset',resetAsk:'Un-check all completed courses?',
 needPre:a=>`Finish the prerequisites first: ${a.join(', ')}`,prereq:'Prerequisites:',prereqShort:'🔗 Prereq: ',sep:', ',
 tipLock:'Locked – finish the prerequisites first',tipDo:'Click to mark as done',tipUndo:'Click to undo',
 noCourses:'No courses in this year yet',
 electives:'Electives & free courses',electivesSub:'No prerequisites – click when you finish one',
 legTree:['Green fruit: locked','Red fruit: ready to pick','Golden fruit: done'],
 legBuilding:['Dark window: locked','Blue window: ready','Lit window: done'],
 legSea:['Grey fish: locked','Orange fish: ready','Golden fish: done'],
 legClassic:['Faded card: locked','Plain card: ready','Green card: done'],
 pickTitle:'Choose your department',pickText:'No department is assigned to your account. Pick one to see its plan.',pickBtn:'Show plan',
 preview:'Plan preview – progress here is not saved',back:'Back to admin panel',
 admTitle:'Admin panel',admSub:'Manage departments, courses and students',
 aMajors:'Departments',aCourses:'Courses',aElectives:'Electives',aStudents:'Students',aData:'Data',
 addMajor:'Add department',addCourse:'Add course',addElective:'Add elective',editMajor:'Edit department',editCourse:'Edit course',editElective:'Edit elective',
 edit:'Edit',del:'Delete',dup:'Duplicate',view:'View plan',manage:'Manage courses',save:'Save',cancel:'Cancel',search:'Search by code or name…',
 majorAr:'Department name (Arabic)',majorEn:'Department name (English)',years:'Number of years',
 cCode:'Course code',cCodeHint:'The code cannot change after saving. Letters, digits and - _ . only.',cYear:'Year',cAr:'Course name (Arabic)',cEn:'Course name (English)',cPre:'Prerequisites',
 nameAr:'Name (Arabic)',nameEn:'Name (English)',
 stats:(y,c,e,s)=>[`${y} years`,`${c} courses`,`${e} electives`,`${s} students`],
 emptyMajors:'No departments yet. Add the first one.',
 confirmDelMajor:(n,s)=>`Delete the department "${n}" and all its courses?${s?`\n${s} student(s) are enrolled and will have to pick a new department.`:''}`,
 confirmDelCourse:n=>`Delete the course "${n}"? It will be removed from other courses' prerequisites.`,
 confirmDelElective:n=>`Delete the elective "${n}"?`,
 confirmDelStudent:n=>`Delete the student account "${n}"?`,
 errNeedName:'Enter a name in Arabic or English',errYears:'Years must be between 1 and 8',
 errYearsLow:n=>`There are courses in year ${n}. Move or delete them first.`,
 errCode:'Code: letters, digits and - _ . only (up to 24 characters)',errCodeUsed:'This code is already used in this department',
 errCycle:n=>`"${n}" depends on this course, so this link would create a loop`,
 colCode:'Code',colName:'Name',colPre:'Prerequisites',colAct:'Actions',colId:'Student ID',colMajor:'Department',colProg:'Progress',colNoMajor:'— No department —',
 noStudents:'No students are registered on this browser.',
 studentsNote:'Student accounts are stored in each student\'s own browser. Syncing across devices needs a server-side database.',
 resetProg:'Reset progress',resetPw:'New password',newPw:'New password',confirmResetProg:n=>`Reset the progress of "${n}"?`,
 dExport:'Export plans',dExportP:'Downloads data.json with every department and course. Put it next to index.html on your host so all students see it.',
 dImport:'Import plans',dImportP:'Pick a data.json file (same format as the export). It replaces the current plans.',
 dCsv:'Export students (CSV)',dCsvP:'A list of students registered on this browser with their progress.',
 dReset:'Restore the original plan',dResetP:'Deletes every change and brings back the Robotics department only.',
 dPw:'Change admin password',dPwP:'Takes effect on this browser immediately. To apply it on every device, copy the line below and replace ADMIN_HASH in index.html.',
 dPwDone:'Changed on this browser.',
 btnExport:'Export',btnImport:'Choose file',btnCsv:'Download CSV',btnReset:'Restore',btnPw:'Change',
 importOk:'Plans imported',importBad:'Invalid file',confirmImport:'Replace the current plans with the file contents?',confirmReset:'Delete every change and restore the original plan?',
 saved:'Saved',deleted:'Deleted'
}};
let lang=ls.get('aum2_lang','ar');
if(lang!=='ar'&&lang!=='en')lang='ar';
const t=(k,...a)=>{const v=(T[lang]||T.ar)[k];return typeof v==='function'?v(...a):(v??k)};
const nm=x=>(x&&(x[lang]||x.ar||x.en))||'';

/* ===== 4) الحالة العامة ===== */
let DB=(()=>{const s=ls.get('aum2_db',null);return s?sanitize(s):defaultDB()})();
let USERS=ls.get('aum2_users',[]);if(!Array.isArray(USERS))USERS=[];
let SES=ls.get('aum2_ses',null);
let mode=ls.get('aum2_mode','tree');if(!['tree','building','sea','cell','pc','graph','classic'].includes(mode))mode='tree';
let AUTH={tab:'student',sub:'login'};
let ADM={tab:'majors',mid:'',q:''};
let PREVIEW=null,PDONE=[],V=null;
const saveDB=()=>{DB.rev=Date.now();ls.set('aum2_db',DB)};
const saveUsers=()=>ls.set('aum2_users',USERS);
const majorOf=id=>DB.majors.find(m=>m.id===id);
const facOf=id=>DB.faculties.find(f=>f.id===id);
const facName=m=>{const f=m&&facOf(m.fid);return f?nm(f):''};
const uniOf=id=>DB.universities.find(u=>u.id===id);
const uniName=m=>{const f=m&&facOf(m.fid),u=f&&uniOf(f.uid);return u?nm(u):''};
const facFull=f=>{const u=uniOf(f.uid);return (u?nm(u)+' › ':'')+nm(f)};
const optsOf=(list,sel)=>list.map(x=>`<option value="${esc(x.id)}"${x.id===sel?' selected':''}>${esc(nm(x))}</option>`).join('');
// كل الأقسام مجمعة حسب الكلية (للاستعمال بقوائم المدير)
const groupedMajors=(sel,blank)=>(blank?`<option value="">${esc(blank)}</option>`:'')+DB.faculties.map(f=>{const ms=DB.majors.filter(m=>m.fid===f.id);return ms.length?`<optgroup label="${esc(facFull(f))}">${optsOf(ms,sel)}</optgroup>`:''}).join('');
// الكلية أولاً ثم القسم: قائمتين مترابطتين
const uniOptions=(sel,onlyUsed)=>`<option value="">${esc(t('chooseUni'))}</option>`+optsOf(DB.universities.filter(u=>!onlyUsed||DB.faculties.some(f=>f.uid===u.id&&DB.majors.some(x=>x.fid===f.id))),sel);
const facOptions=(u,sel)=>{const list=DB.faculties.filter(f=>f.uid===u&&DB.majors.some(m=>m.fid===f.id));return `<option value="">${esc(t(!u?'chooseUniFirst':list.length?'chooseFaculty':'noUniFacs'))}</option>`+optsOf(list,sel)};
const facGrouped=sel=>`<option value="">${esc(t('chooseFaculty'))}</option>`+DB.universities.map(u=>{const fs=DB.faculties.filter(f=>f.uid===u.id);return fs.length?`<optgroup label="${esc(nm(u))}">${optsOf(fs,sel)}</optgroup>`:''}).join('');
const majorOptions=(fid,sel)=>{const list=DB.majors.filter(m=>m.fid===fid);return `<option value="">${esc(t(!fid?'chooseFacFirst':list.length?'chooseMajor':'noFacMajors'))}</option>`+optsOf(list,sel)};
const logoHTML=`<span class="logo"><img src="aum_logo.png" alt="AUM" onerror="this.parentNode.style.display='none'"></span>`;

let toastTimer;
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('on'),2600)}

/* ===== 5) منطق عرض الخطة (مشترك بين الأوضاع الأربعة) ===== */
function startViewer(major,done,commit,meta){
  V={major,done,commit,meta,
    byId:Object.fromEntries(major.courses.map(c=>[c.id,c])),
    eById:Object.fromEntries(major.electives.map(e=>[e.id,e]))};
}
// المادة مفتوحة إذا كل متطلباتها مشطوبة
const isOpen=c=>c.pre.every(p=>!V.byId[p]||V.done.includes(p));
const stOf=c=>V.done.includes(c.id)?'done':isOpen(c)?'open':'lock';
const kids=id=>V.major.courses.filter(c=>c.pre.includes(id)).map(c=>c.id);
// إلغاء شطب مادة + كل المواد اللي بتعتمد عليها
function drop(id){V.done=V.done.filter(x=>x!==id);kids(id).forEach(k=>{if(V.done.includes(k))drop(k)})}
const snap=()=>new Set(V.major.courses.filter(c=>stOf(c)==='open').map(c=>c.id));
function toggle(id){
  const c=V.byId[id],e=V.eById[id];
  if(!c&&!e)return;
  const before=snap(),was=V.done.includes(id);
  if(was)drop(id);
  else if(!c||isOpen(c))V.done.push(id);
  else{toast(t('needPre',c.pre.filter(p=>V.byId[p]&&!V.done.includes(p)).map(p=>nm(V.byId[p]))));return}
  V.commit();stage();
  // تأثيرات الحركة: المادة اللي انضغطت + المواد اللي انفتحت بسببها
  fx(id,was?'fx-off':'fx-on',[...snap()].filter(x=>!before.has(x)&&x!==id));
}
function prog(){
  const all=[...V.major.courses,...V.major.electives],ids=new Set(all.map(x=>x.id));
  const dn=all.filter(x=>V.done.includes(x.id));
  return{n:dn.length,total:ids.size,pct:ids.size?Math.round(dn.length/ids.size*100):0,hrs:dn.reduce((a,x)=>a+(x.h??3),0)};
}
const byYear=m=>{const a=Array.from({length:m.years},()=>[]);m.courses.forEach(c=>a[Math.min(m.years,Math.max(1,c.y))-1].push(c));return a};
