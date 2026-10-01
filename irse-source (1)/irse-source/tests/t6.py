from playwright.sync_api import sync_playwright
errs=[]
def watch(pg):
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.text) if m.type=='error' and not any(x in m.text for x in ('fonts.g','ERR_','data.json','403','file:///')) else None)
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':1280,'height':900});pg=ctx.new_page();watch(pg)
    pg.goto('file:///mnt/user-data/outputs/index.html')
    pg.click('[data-act=asub][data-v=signup]')
    print('dept disabled before faculty:',pg.is_disabled('select[name=major]'))
    pg.select_option('select[name=uni]','u_aum')
    pg.select_option('select[name=fac]','f_eng')
    print('dept options:',pg.eval_on_selector_all('select[name=major] option','e=>e.map(x=>x.textContent)'))
    pg.fill('input[name=nm]','سامر');pg.fill('input[name=sid]','900');pg.fill('input[name=pw]','abcdef')
    pg.select_option('select[name=major]','robotics');pg.click('form[data-form=stuSignup] button.btn-m')
    pg.wait_for_selector('#stage .scene')
    print('header sub:',pg.inner_text('.sub'))
    # effects: complete Calc1 in fish mode
    pg.click('[data-act=mode][data-v=sea]')
    pg.click('[data-id="0903101"]',force=True)
    pg.wait_for_timeout(150)
    print('sea fx-on:',pg.evaluate("document.querySelector('[data-id=\"0903101\"]').classList.contains('fx-on')"),
          '| bubbles:',pg.locator('.fxp').count(),
          '| Calc2 unlock:',pg.evaluate("document.querySelector('[data-id=\"0903102\"]').classList.contains('fx-unlock')"))
    print('progress text:',pg.inner_text('#pt'))
    for m in ['tree','building','cell','pc','graph','classic']:
        pg.click(f'[data-act=mode][data-v={m}]')
        pg.wait_for_selector('#stage .scene, #stage #vp')
        pg.click('[data-id="0900103"]') if m in('cell','pc','graph') else None
        pg.wait_for_timeout(250)
        pg.screenshot(path=f'shots/50_{m}.png',full_page=(m!='graph'))
        print(m,'nodes:',pg.locator('#stage [data-id]').count())
    print('tooltip text after hover in graph:')
    pg.click('[data-act=mode][data-v=graph]');pg.hover('[data-id="0903102"]');print(pg.inner_text('#tip').replace('\n',' | '))
    print('ERRORS:',errs);b.close()
