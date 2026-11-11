import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'

// Use an existing local Vite server and an isolated Chrome debugging instance.
const chrome = process.env.HACKIFC_CHROME_URL ?? 'http://127.0.0.1:9231'
const preview = process.env.HACKIFC_PREVIEW_URL ?? 'http://127.0.0.1:3000/tests/browser/fixtures.html'
const targets = await (await fetch(`${chrome}/json`)).json() as Array<{ type: string, webSocketDebuggerUrl: string }>
const target = targets.find(item => item.type === 'page')
assert.ok(target, 'Chrome must have an open page')
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(resolve => {
  socket.addEventListener('open', resolve)
})
let sequence = 0
interface ProtocolMessage {
  id?: number
  error?: { message: string }
  result?: unknown
}
const pending = new Map<number, (message: ProtocolMessage) => void>()
socket.addEventListener('message', event => {
  const message = JSON.parse(String(event.data)) as ProtocolMessage
  if (message.id) {
    pending.get(message.id)?.(message)
    pending.delete(message.id)
  }
})
function call<T = unknown> (method: string, params: Record<string, unknown> = {}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = ++sequence
    pending.set(id, message => message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result as T))
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate (expression: string) {
  const result = await call<{ exceptionDetails?: unknown, result: { value: unknown } }>('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails))
  return result.result.value
}
async function navigate (showcase: string) {
  await call('Page.navigate', { url: `${preview}?case=${showcase}` })
  let mounted = false
  for (let attempt = 0; attempt < 100; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    mounted = Boolean(await evaluate(`document.querySelector('[data-showcase="${showcase}"]') !== null`))
    if (mounted) {
      break
    }
  }
  assert.ok(mounted, `fixture ${showcase} mounted`)
  await evaluate('document.fonts.ready.then(() => true)')
}
const indicatorColor = `(()=>{const probe=document.createElement('span');probe.style.color='var(--app-brand-accent)';document.body.append(probe);const color=getComputedStyle(probe).color;probe.remove();return color})()`
try {
  await call('Page.enable')
  await navigate('theme')
  for (const theme of ['light', 'dark']) {
    await evaluate(`localStorage.setItem('hackifc.theme', '${theme}')`)
    for (const width of [1200, 390, 320]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 })
      await call('Emulation.setTouchEmulationEnabled', { enabled: width < 500, maxTouchPoints: 1 })
      await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
      await navigate('shared')
      assert.ok(await evaluate(`(()=>{const buttons=[...document.querySelectorAll('[data-testid="filters"] button')];return getComputedStyle(buttons[0]).borderBottomColor===${indicatorColor}&&buttons[0].getAttribute('aria-pressed')==='true'})()`), 'selected filter has a blue underline')
      await evaluate(`document.querySelectorAll('[data-testid="filters"] button')[1].click()`)
      await new Promise(resolve => setTimeout(resolve, 50))
      assert.ok(await evaluate(`(()=>{const buttons=[...document.querySelectorAll('[data-testid="filters"] button')];return buttons[1].getAttribute('aria-pressed')==='true'&&buttons[0].getAttribute('aria-pressed')==='false'&&getComputedStyle(buttons[1]).borderBottomColor===${indicatorColor}})()`), 'filter selection and visual indicator move together')
      await evaluate(`document.querySelector('[data-testid="loading"]').click()`)
      await new Promise(resolve => setTimeout(resolve, 50))
      assert.ok(await evaluate(`(()=>{const button=document.querySelector('[data-testid="loading"]');return button.disabled&&button.getAttribute('aria-busy')==='true'&&!!button.querySelector('.v-btn__loader')})()`), 'real Vuetify button exposes its busy state and loader')
      await evaluate(`(()=>{const input=document.querySelector('textarea');input.value='Descrição alterada';input.dispatchEvent(new Event('input',{bubbles:true}))})()`)
      await new Promise(resolve => setTimeout(resolve, 50))
      assert.equal(await evaluate(`document.querySelector('[data-testid="bio-value"]').textContent`), 'Descrição alterada')
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'shared components fit the viewport')
      await navigate('requests')
      assert.ok(await evaluate(`(()=>{const selected=document.querySelector('[aria-pressed="true"]');return selected&&getComputedStyle(selected).borderBottomColor===${indicatorColor}&&getComputedStyle(document.querySelector('h1')).fontSize==='24px'})()`), 'requests page uses the public filter variant and preserves its heading')
      await navigate('focus')
      await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      assert.ok(await evaluate(`(()=>{const el=document.activeElement;const style=getComputedStyle(el);return el.tagName==='BUTTON'&&el.matches(':focus-visible')&&parseFloat(style.outlineWidth)>=2&&style.outlineStyle!=='none'})()`), 'keyboard focus is visibly outlined')
      await navigate('cards')
      await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
      assert.ok(await evaluate(`(()=>{const card=document.querySelector('.project-card');return document.activeElement===card&&card.matches(':focus-visible')&&parseFloat(getComputedStyle(card).outlineWidth)>=2})()`), 'project card keeps its keyboard focus outline')
      await evaluate(`document.activeElement.blur()`)
      await evaluate(`document.querySelector('.project-card').dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}))`)
      await new Promise(resolve => setTimeout(resolve, 50))
      assert.ok(await evaluate(`document.querySelector('.project-card').classList.contains('is-revealed')`), 'hover expands the project')
      await evaluate(`document.querySelector('.project-management button').click()`)
      assert.equal(await evaluate(`document.querySelector('[data-testid="edits"]').textContent`), '1')
      await evaluate(`document.querySelector('.project-card').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`)
      await new Promise(resolve => setTimeout(resolve, 50))
      assert.ok(await evaluate(`!document.querySelector('.project-card').classList.contains('is-revealed')`), 'Escape closes the project')
      if (width < 500) {
        assert.ok(await evaluate(`(matchMedia('(hover:none)').matches||matchMedia('(pointer:coarse)').matches)&&getComputedStyle(document.querySelector('.project-reveal')).display!=='none'`), 'touch reveal control is visible in mobile input mode')
        await evaluate(`document.querySelector('.project-reveal').click()`)
        await new Promise(resolve => setTimeout(resolve, 50))
        assert.ok(await evaluate(`document.querySelector('.project-reveal').getAttribute('aria-expanded')==='true'`), 'touch control expands the card')
      }
      const screenshot = await call<{ data: string }>('Page.captureScreenshot', { captureBeyondViewport: true })
      await writeFile(`/tmp/hackifc-final-cards-${theme}-${width}.png`, Buffer.from(screenshot.data, 'base64'))
      await navigate('containers')
      assert.ok(await evaluate(`Array.from(document.querySelectorAll('[data-container]')).every(parent=>{const root=parent.firstElementChild;return root.classList.contains('w-full')&&root.classList.contains('min-w-0')&&Math.abs(root.getBoundingClientRect().width-parent.getBoundingClientRect().width)<1})`), 'page roots fill the App content width')
      await navigate('logos')
      assert.ok(await evaluate(`(()=>{const real=document.querySelector('[data-testid="real-logo-card"]');const fallback=document.querySelector('[data-testid="fallback-logo-card"]');return real.querySelector('img')?.getAttribute('src')?.startsWith('data:image/svg+xml,')&&!fallback.querySelector('img')&&fallback.querySelector('svg')&&getComputedStyle(real.querySelector('.project-mark--logo')).backgroundColor==='rgb(255, 255, 255)'})()`), 'only missing logos use the SVG fallback; real logos keep their white plate')
      await evaluate(`document.querySelector('[data-testid="real-logo-card"]').dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}))`)
      await new Promise(resolve => setTimeout(resolve, 50))
      assert.ok(await evaluate(`getComputedStyle(document.querySelector('[data-testid="real-logo-card"] .project-mark--logo')).backgroundColor==='rgb(255, 255, 255)'`), 'real logo plate stays white on hover')
      await navigate('home')
      assert.ok(await evaluate(`document.querySelectorAll('.home-editions .edition-card').length===2`), 'home fixture exercises both edition sections')
      assert.ok(await evaluate(String.raw`(()=>{const grid=document.querySelector('.home-editions');const columns=getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/);return columns.length===${width >= 1000 ? 2 : 1}})()`), 'home paired sections keep their responsive columns')
      console.log(`PASS browser: ${theme} ${width}px — filters, loading, bio, keyboard, cards and containers`)
    }
  }
  for (const width of [1200, 390, 320]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 })
    await navigate('theme')
    await evaluate('localStorage.removeItem(\'hackifc.theme\')')
    await navigate('theme')
    assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light', 'no saved preference defaults to light')
    await evaluate('document.querySelector(\'[data-theme-control]\').focus()')
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 })
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
    await new Promise(resolve => setTimeout(resolve, 100))
    assert.ok(await evaluate(`(()=>{const main=document.querySelector('main');const button=document.querySelector('[data-theme-control]');return document.documentElement.dataset.theme==='dark'&&main.dataset.themeState==='dark'&&main.dataset.vuetifyTheme==='dark'&&main.dataset.legacyTheme==='dark'&&button.getAttribute('aria-pressed')==='true'&&localStorage.getItem('hackifc.theme')==='dark'})()`), 'keyboard toggle synchronizes root, both providers and storage')
    await navigate('theme')
    assert.equal(await evaluate('document.documentElement.dataset.theme'), 'dark', 'preference survives reload')
    await evaluate(`Array.from(document.querySelectorAll('button')).find(e=>e.textContent.includes('Abrir modal')).click()`)
    await new Promise(resolve => setTimeout(resolve, 100))
    assert.ok(await evaluate(`(()=>{const card=document.querySelector('.v-overlay-container .v-card');return card&&card.closest('.v-theme--dark')&&getComputedStyle(card).backgroundColor==='rgb(23, 38, 59)'})()`), 'teleported Vuetify dialog follows the theme')
    await navigate('header')
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'header and toggle fit the viewport')
    await evaluate('document.querySelector(\'.v-avatar\').click()')
    await new Promise(resolve => setTimeout(resolve, 100))
    assert.ok(await evaluate(`(()=>{const list=document.querySelector('.v-overlay-container .v-list');return list&&getComputedStyle(list).backgroundColor==='rgb(23, 38, 59)'})()`), 'teleported profile menu follows the theme')
    for (const theme of ['light', 'dark']) {
      await evaluate(`localStorage.setItem('hackifc.theme', '${theme}')`)
      for (const showcase of ['login', 'register', 'modal', 'sidebar']) {
        await navigate(showcase)
        assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `${theme} ${showcase} fits ${width}px`)
        if (showcase === 'modal') {
          assert.ok(await evaluate(`!!document.querySelector('body [role="dialog"] input')`), 'custom teleported modal renders its fields')
        }
      }
    }
    console.log(`PASS browser: ${width}px — theme keyboard toggle, persistence, providers, menus, dialogs and authentication forms`)
  }
  // Leave the isolated browser in the default theme.
  await evaluate('localStorage.removeItem(\'hackifc.theme\')')
} finally {
  socket.close()
}
