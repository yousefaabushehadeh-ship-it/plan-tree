/* ===== 1) البيانات الافتراضية (الخطة الأصلية) =====
   كل سطر: الكود | السنة | الاسم بالعربي | الاسم بالإنجليزي | المتطلبات (أكواد مفصولة بفاصلة)
   هاي البيانات بس نقطة البداية — المدير بيعدّل ويضيف من لوحة التحكم. */
const RAW=`0900103|1|السباحة|Swimming|
0900119|1|المهارات الحياتية|Life Skills|
0900122|1|الريادة والابتكار|Entrepreneurship and Innovation|
0900123|1|القيادة والمسؤولية المجتمعية|Leadership and Social Responsibility|
0900111|1|العلوم العسكرية|Military Science|
0900120|1|مهارات التواصل باللغة العربية|Arabic Communication Skills|
0900130|1|مهارات التواصل باللغة الإنجليزية (1)|English Communication Skills (1)|
0900131|1|مهارات التواصل باللغة الإنجليزية (2)|English Communication Skills (2)|0900130
0104100|1|المشاغل الهندسية|Engineering Workshops|
0903101|1|التفاضل والتكامل (1)|Calculus (1)|
0903102|1|التفاضل والتكامل (2)|Calculus (2)|0903101
0904101|1|الفيزياء العامة (1)|General Physics (1)|
0904102|1|الفيزياء العامة (2)|General Physics (2)|0904101
0904107|1|مختبر الفيزياء العامة (1)|General Physics Lab (1)|0904101
0904108|1|مختبر الفيزياء العامة (2)|General Physics Lab (2)|0904102
0401121|1|أساسيات البرمجة|Programming Fundamentals|
0401120|1|مختبر أساسيات البرمجة|Programming Fundamentals Lab|0401121
0401122|1|لغة البرمجة كائنية التوجه|Object Oriented Programming|0401121
0401123|1|مختبر البرمجة كائنية التوجه|Object Oriented Programming Lab|0401122
0902100|1|أساسيات الكيمياء|Basics of Chemistry|
0102205|2|الرسم الهندسي|Engineering Drawing|
0101211|2|الدوائر الكهربائية (1)|Electrical Circuits (1)|0904102
0101213|2|الدوائر والآلات الكهربائية|Electrical Circuits & Machines|0101211
0101214|2|مختبر الدوائر الكهربائية|Electrical Circuits Lab|0101213
0101215|2|تراكيب البيانات ومقدمة الخوارزميات|Data Structures & Intro to Algorithms|0401122,0401123
0101221|2|البرمجة لتكنولوجيا الذكاء الاصطناعي|Programming for AI Technology|0401122,0401123
0101240|2|تصميم المنطق الرقمي|Digital Logic Design|0903102
0402213|2|الجبر الخطي|Linear Algebra|0903102
0101201|2|استاتيكا وديناميكا الروبوتات|Statics & Dynamics of Robots|0904101
0903201|2|الرياضيات التطبيقية للهندسة (1)|Applied Math for Engineering (1)|0903102
0903281|2|الاحتمالات والإحصاء|Probability and Statistics|0903201
0101310|3|أنظمة التحكم|Control Systems|0101350,0101351
0101311|3|مختبر أنظمة التحكم|Control Systems Lab|0101310
0101312|3|الإلكترونيات|Electronics|0101213
0101313|3|مختبر الإلكترونيات|Electronics Lab|0101214,0101312
0101315|3|أساسيات الذكاء الاصطناعي|Fundamentals of Artificial Intelligence|0101215,0903281
0101340|3|الأنظمة المدمجة|Embedded Systems|0101240
0101341|3|مختبر الأنظمة المدمجة|Embedded Systems Lab|0101340
0101350|3|الإشارات والأنظمة|Signals and Systems|0903102,0101213
0101351|3|مختبر تطبيقات البرمجة في الإشارات|Signals & Systems Programming Lab|0101350
0101352|3|المستشعرات والمشغلات|Sensors & Actuators|0101312,0101340
0101353|3|مختبر المستشعرات والمشغلات|Sensors & Actuators Lab|0101352
0402331|3|تعلم الآلة|Machine Learning|0101315,0101221
0903301|3|الرياضيات التطبيقية للهندسة (2)|Applied Math for Engineering (2)|0903201
0903381|3|التحليل العددي|Numerical Analysis|0903102
0102460|4|الاقتصاد الهندسي|Engineering Economics|0903101
0104401|4|أخلاقيات الهندسة والكتابة الفنية|Engineering Ethics & Technical Writing|0900130
0101410|4|أنظمة الاتصالات|Communications Systems|0101350
0101415|4|أنظمة الروبوتات|Robotic Systems|0101221,0101410
0101422|4|شبكات الحاسوب|Computer Networks|0101340,0101341
0101440|4|التصميم بمساعدة الحاسوب|Computer Aided Design (CAD)|0101201,0102205
0101441|4|مختبر التصميم بمساعدة الحاسوب|CAD Lab|0101440
0101444|4|رؤية الروبوت|Robot Vision|0101440,0101221
0101445|4|مختبر تصميم الروبوتات|Robot Design Lab|0101444
0101480|4|التدريب العملي للهندسة|Practical Engineering Training|
0101511|5|الروبوتات المتنقلة|Mobile Robotics|0101410,0101415
0101545|5|أساسيات الروبوتات الصناعية|Fundamentals of Industrial Robotics|0101415
0101593|5|مشروع تخرج (1)|Graduation Project (1)|
0101594|5|مشروع تخرج (2)|Graduation Project (2)|0101593`;
const STONES=`أساسيات الأمن السيبراني (0403171)|Cybersecurity Fundamentals (0403171)
البيانات الضخمة (0402451)|Big Data (0402451)
التعرف على الأنماط (0402342)|Pattern Recognition (0402342)
تنقيب البيانات التطبيقي (0402333)|Applied Data Mining (0402333)
الروبوتات المتنقلة الذاتية (0101529)|Autonomous Mobile Robots (0101529)
الرؤية الحاسوبية (0101530)|Computer Vision (0101530)
الروبوتات المتقدمة (0101558)|Advanced Robotics (0101558)
التعلم العميق المتقدم (0101559)|Advanced Deep Learning (0101559)
اختياري جامعة (علوم إنسانية)|University Elective (Humanities)
اختياري جامعة (علوم اجتماعية)|University Elective (Social Sciences)
اختياري جامعة (علوم وتكنولوجيا)|University Elective (Science & Tech)
مادة حرة (1)|Free Elective (1)
مادة حرة (2)|Free Elective (2)`;

// الساعات المعتمدة لكل مادة (من خطة IRSE الرسمية). أي مادة مش مذكورة هون = 3 ساعات.
const HOURS={'0900103':1,'0900119':1,'0900122':1,'0900123':1,'0102460':2,'0104100':1,'0904107':1,'0904108':1,'0101214':1,'0101311':1,'0101313':1,'0101341':1,'0101351':1,'0101353':1,'0101440':2,'0101441':1,'0101445':1,'0101593':1,'0101594':2,'0401120':1,'0401123':1,'0902100':1};
function defaultDB(){
  const courses=RAW.split('\n').map(l=>{const [id,y,ar,en,p]=l.split('|');return{id,y:+y,h:HOURS[id]||3,ar,en,pre:p?p.split(','):[]}});
  const electives=STONES.split('\n').map((l,i)=>{const [ar,en]=l.split('|');return{id:'e_'+(i+1),h:3,ar,en}});
  return{rev:1,
    universities:[{id:'u_aum',ar:'الجامعة الأميركية في مادبا',en:'American University of Madaba'}],
    faculties:[{id:'f_eng',uid:'u_aum',ar:'كلية الهندسة',en:'Faculty of Engineering'}],
    majors:[{id:'robotics',fid:'f_eng',ar:'هندسة أنظمة الروبوتات الذكية',en:'Intelligent Robotics Systems Engineering',years:5,courses,electives}]};
}
