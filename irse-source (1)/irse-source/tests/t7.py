import json
from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':1280,'height':900});pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and not any(x in m.text for x in('fonts.g','ERR_','data.json','403','file:///')) else None)
    pg.goto('file:///mnt/user-data/outputs/index.html')
    pg.click('[data-act=atab][data-v=admin]');pg.fill('input[name=user]','admin');pg.fill('input[name=pw]','admin123')
    pg.click('form[data-form=adminLogin] button.btn-m');pg.wait_for_selector('.adm')
    pg.click('[data-act=atabAdm][data-v=faculties]')
    pg.click('[data-act=facNew]');pg.fill('#f_ar','كلية تكنولوجيا المعلومات');pg.fill('#f_en','Faculty of IT');pg.click('#dform button.btn-m')
    print('faculties:',pg.locator('.tbl tbody tr').count())
    # cannot delete faculty that has departments
    pg.click('[data-act=facDel][data-k=f_eng]');print('del blocked toast:',pg.inner_text('#toast'))
    # new department inside IT faculty
    pg.click('[data-act=atabAdm][data-v=majors]');pg.click('[data-act=majorNew]')
    pg.click('#dform button.btn-m');print('no-faculty err:',pg.inner_text('#dform .err'))
    pg.select_option('#f_fac',label='كلية تكنولوجيا المعلومات');pg.fill('#f_ar','علم الحاسوب');pg.fill('#f_en','Computer Science');pg.click('#dform button.btn-m')
    print('majors grouped headings:',pg.eval_on_selector_all('.yh2','e=>e.map(x=>x.textContent.trim())'))
    # hours editing
    pg.click('[data-act=majorCourses][data-k=robotics]');pg.click('[data-act=courseEdit][data-k="0102460"]')
    print('hours default in form (expect 2):',pg.input_value('#f_h'));pg.fill('#f_h','15');pg.click('#dform button.btn-m');print('hours err:',pg.inner_text('#dform .err'))
    pg.fill('#f_h','4');pg.click('#dform button.btn-m')
    # export has faculties+hours
    pg.click('[data-act=atabAdm][data-v=data]')
    with pg.expect_download() as d: pg.click('[data-act=expData]')
    d.value.save_as('/home/claude/exp2.json');j=json.load(open('/home/claude/exp2.json'))
    print('export faculties:',[f['id'] for f in j['faculties']],'| dept fid:',[m['fid'] for m in j['majors']],'| 0102460 h=',[c['h'] for c in j['majors'][0]['courses'] if c['id']=='0102460'])
    # student signup must show only faculties that have departments, and IT dept appears
    pg.click('[data-act=logout]');pg.click('[data-act=asub][data-v=signup]')
    print('student faculty options:',pg.eval_on_selector_all('select[name=fac] option','e=>e.map(x=>x.textContent)'))
    # import OLD format (no faculties/hours) -> must migrate
    old={'rev':5,'majors':[{'id':'x1','ar':'قديم','en':'Old','years':2,'courses':[{'id':'A1','y':1,'ar':'أ','en':'A','pre':[]}],'electives':[]}]}
    open('/home/claude/old.json','w').write(json.dumps(old))
    pg.click('[data-act=atab][data-v=admin]');pg.fill('input[name=user]','admin');pg.fill('input[name=pw]','admin123');pg.click('form[data-form=adminLogin] button.btn-m');pg.wait_for_selector('.adm')
    pg.click('[data-act=atabAdm][data-v=data]');pg.once('dialog',lambda dl:dl.accept())
    pg.set_input_files('#impFile','/home/claude/old.json');pg.wait_for_timeout(400)
    pg.click('[data-act=atabAdm][data-v=faculties]');print('after old import faculties:',pg.locator('.tbl tbody tr').count(),'| toast ok')
    # corrupted import (cyclic prereqs) must not hang the graph
    cyc={'rev':9,'faculties':[{'id':'f','ar':'ك','en':'F'}],'majors':[{'id':'c','fid':'f','ar':'دورة','en':'Cyc','years':2,'courses':[{'id':'P','y':1,'ar':'p','en':'P','pre':['Q']},{'id':'Q','y':2,'ar':'q','en':'Q','pre':['P']}],'electives':[]}]}
    open('/home/claude/cyc.json','w').write(json.dumps(cyc))
    pg.click('[data-act=atabAdm][data-v=data]');pg.once('dialog',lambda dl:dl.accept());pg.set_input_files('#impFile','/home/claude/cyc.json');pg.wait_for_timeout(400)
    pg.click('[data-act=atabAdm][data-v=majors]');pg.click('[data-act=majorView]');pg.wait_for_selector('#stage .scene')
    pg.click('[data-act=mode][data-v=graph]');pg.wait_for_selector('.gr');print('cyclic data graph rendered OK, nodes:',pg.locator('.gnd').count())
    print('ERRORS:',errs);b.close()
