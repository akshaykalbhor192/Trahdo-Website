// Behaviour checks against a running dev/preview server. node behave.mjs [--base http://localhost:5173]
import fs from 'node:fs'
import { chromium } from 'playwright-core'

const argv = process.argv.slice(2)
const BASE = argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : 'http://localhost:5173'
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p))
const browser = await chromium.launch({ executablePath: CHROME, headless: true })

let failures = 0
const ok = (name, cond, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  ' + extra : ''}`)
  if (!cond) failures++
}

async function fresh(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  return { ctx, page, errors }
}
const settle = (page, ms = 600) => page.waitForTimeout(ms)
const instances = (page) => page.evaluate(() => window.ScrollCraft.instances.length)

// ---- 1. routes, engine lifecycle ------------------------------------------------------
{
  const { ctx, page, errors } = await fresh()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page)
  ok('home: one engine instance', (await instances(page)) === 1, String(await instances(page)))
  for (const [label, path, h1] of [
    ['About', '/about', 'Moving markets'],
    ['Careers', '/careers', 'No open roles'],
    ['Security', '/security', 'Built to protect'],
  ]) {
    await page.locator('header nav a', { hasText: label }).first().click()
    await settle(page)
    ok(`nav ${label}: url`, new URL(page.url()).pathname === path)
    ok(`nav ${label}: h1`, (await page.locator('h1').first().innerText()).includes(h1))
    ok(`nav ${label}: still one engine instance`, (await instances(page)) === 1, String(await instances(page)))
    ok(`nav ${label}: scrolled to top`, (await page.evaluate(() => scrollY)) === 0)
  }
  await page.locator('a.wordmark').first().click()
  await settle(page)
  ok('logo returns home', new URL(page.url()).pathname === '/')
  ok('home again: one instance', (await instances(page)) === 1)
  await page.goto(BASE + '/definitely-missing', { waitUntil: 'networkidle' })
  ok('404 renders', (await page.locator('h1').innerText()).includes('not on the chart'))
  ok('no console errors across routes', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ---- 2. CTA, hash links, rail --------------------------------------------------------
{
  const { ctx, page, errors } = await fresh()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page)
  await page.locator('header a.nav__cta').click()
  await settle(page, 900)
  const inView = await page.evaluate(() => {
    const r = document.getElementById('get-started').getBoundingClientRect()
    return r.top <= 5 && r.bottom > innerHeight * 0.5
  })
  ok('nav CTA lands on the close act', inView)
  ok('close CTA copy is visible after the jump', await page.locator('#get-started h2').isVisible())
  const op = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#get-started .close__copy')).opacity))
  ok('close copy at full opacity (hold cue)', op > 0.95, String(op))

  await page.goto(BASE + '/#products', { waitUntil: 'networkidle' })
  await settle(page, 900)
  const prod = await page.evaluate(() => Math.abs(document.getElementById('products').getBoundingClientRect().top))
  ok('deep link /#products lands on products', prod < 8, String(prod))

  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page)
  await page.locator('.rail__tick[aria-label="Jump to Trade & F&O"]').click()
  await settle(page, 700)
  const trade = await page.evaluate(() => Math.abs(document.getElementById('trade').getBoundingClientRect().top))
  ok('rail tick jumps to Trade', trade < 8, String(trade))
  const clock = await page.locator('.rail__clock span').first().innerText()
  ok('rail clock reads a trading-hours time', /^\d\d:\d\d$/.test(clock), clock)

  // From another route, a hash link to home sections.
  await page.goto(BASE + '/about', { waitUntil: 'networkidle' })
  await settle(page)
  await page.locator('a', { hasText: 'Get started' }).last().click()
  await settle(page, 900)
  ok('about CTA goes home and lands on #get-started', new URL(page.url()).hash === '#get-started' && (await page.evaluate(() => Math.abs(document.getElementById('get-started').getBoundingClientRect().top))) < 8)
  ok('no console errors', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ---- 3. the trade ticket ------------------------------------------------------------
{
  const { ctx, page, errors } = await fresh()
  await page.goto(BASE + '/#trade', { waitUntil: 'networkidle' })
  await settle(page, 900)
  const pos = () => page.locator('.position dd').first().innerText()
  ok('ticket starts flat', (await pos()) === 'Flat')
  await page.locator('.ticket__buy').click()
  ok('buy 100 -> +100', (await pos()) === '+100', await pos())
  ok('fill recorded', (await page.locator('.fills li').count()) === 1)
  await page.locator('.ticket__sell').click()
  ok('sell 100 -> flat again', (await pos()) === 'Flat', await pos())
  await page.locator('.ticket__sell').click()
  ok('sell again -> -100', (await pos()) === '-100', await pos())
  await page.locator('.fills__flat').click()
  ok('close position -> flat', (await pos()) === 'Flat')
  const spread = await page.locator('.ladder__spread').innerText()
  ok('spread shown before any click', /Spread 0\.03/.test(spread), spread)
  ok('no console errors', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ---- 3b. the F&O Advisor explainer ----------------------------------------------------
{
  const { ctx, page, errors } = await fresh()
  await page.goto(BASE + '/#advisor', { waitUntil: 'networkidle' })
  await settle(page, 900)
  const facts = async () => (await page.locator('.lab__facts dd').allInnerTexts()).map((t) => t.trim())
  const choose = (name) => page.locator('.lab__choice', { hasText: name }).click()
  const setSpot = (v) =>
    page.locator('.lab__slider input').evaluate((el, value) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }, String(v))

  await setSpot(105)
  let f = await facts()
  ok('buy a call @105: P&L +2.00', f[0] === '+2.00', f[0])
  ok('buy a call: most you can lose 3.00', f[1] === '3.00', f[1])
  ok('buy a call: no limit on the upside', f[2] === 'No limit', f[2])
  ok('buy a call: break-even 103.00', f[3] === '103.00', f[3])

  await choose('Buy a put')
  await setSpot(95)
  f = await facts()
  ok('buy a put @95: P&L +2.20', f[0] === '+2.20', f[0])
  ok('buy a put: break-even 97.20', f[3] === '97.20', f[3])

  await choose('Bull call spread')
  await setSpot(108)
  f = await facts()
  ok('bull call spread: capped gain 3.90', f[2] === '3.90', f[2])
  ok('bull call spread: most you can lose 2.10', f[1] === '2.10', f[1])
  ok('bull call spread @108: P&L +3.90', f[0] === '+3.90', f[0])

  await choose('Sell a put')
  await setSpot(90)
  f = await facts()
  ok('sell a put: most you can make 1.60', f[2] === '1.60', f[2])
  ok('sell a put: loss is bounded and large (96.40)', f[1] === '96.40', f[1])
  ok('sell a put @90: P&L -6.40', f[0] === '-6.40', f[0])
  const says = await page.locator('.lab__says').innerText()
  ok('plain-language text matches the position', /collect 1\.60/.test(says), says.slice(0, 60))
  ok('chart is labelled illustrative', /Illustrative/i.test(await page.locator('.lab__head').innerText()))
  ok('no console errors', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ---- 4. keyboard ---------------------------------------------------------------------
{
  const { ctx, page, errors } = await fresh()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page)
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  ok('first Tab stop is the skip link', first === 'Skip to content', first)
  const seen = []
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press('Tab')
    seen.push(await page.evaluate(() => (document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent || '').trim().slice(0, 28)))
  }
  console.log('      tab order:', seen.join(' > '))
  // Focus a link inside the research rail that is currently off screen.
  await page.evaluate(() => scrollTo({ top: document.getElementById('research').offsetTop - 200, behavior: 'instant' }))
  await settle(page, 400)
  await page.locator('.panel--shot a').focus()
  await settle(page, 500)
  const vis = await page.evaluate(() => {
    const r = document.querySelector('.panel--shot a').getBoundingClientRect()
    return r.left >= -2 && r.right <= innerWidth + 2 && r.top >= 0 && r.bottom <= innerHeight
  })
  ok('keyboard focus into the pan rail brings the panel into view', vis)
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)
  ok('focus ring is drawn', outline !== 'none', outline)
  ok('no console errors', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

// ---- 5. mobile menu ------------------------------------------------------------------
{
  const { ctx, page } = await fresh({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page)
  const toggle = page.locator('.nav__toggle')
  ok('mobile: menu button shown', await toggle.isVisible())
  ok('mobile: desktop links hidden', !(await page.locator('.nav__links').isVisible()))
  await toggle.click()
  ok('mobile: sheet opens', await page.locator('#nav-sheet').isVisible())
  ok('mobile: aria-expanded true', (await toggle.getAttribute('aria-expanded')) === 'true')
  await page.locator('#nav-sheet a', { hasText: 'About' }).click()
  await settle(page)
  ok('mobile: sheet closes on navigation', !(await page.locator('#nav-sheet').count()))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  ok('mobile: no horizontal page overflow on About', overflow <= 0, String(overflow))
  for (const p of ['/', '/security', '/careers']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' })
    await settle(page, 400)
    const o = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    ok(`mobile: no horizontal overflow on ${p}`, o <= 0, String(o))
  }
  await ctx.close()
}

// ---- 6. reduced motion ---------------------------------------------------------------
{
  const { ctx, page, errors } = await fresh({ reducedMotion: 'reduce' })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await settle(page)
  const rail = await page.evaluate(() => {
    const el = document.querySelector('.research__stage')
    return { ox: getComputedStyle(el).overflowX }
  })
  ok('reduced motion: research rail becomes a native scroll region', rail.ox === 'auto', rail.ox)
  const tick = await page.evaluate(() => document.querySelector('.hero__copy > *')?.getAnimations().length)
  console.log('      hero entrance animations running:', tick)
  ok('no console errors', errors.length === 0, errors.join(' | '))
  await ctx.close()
}

await browser.close()
console.log(failures ? `\n${failures} FAILED` : '\nall behaviour checks passed')
process.exit(failures ? 1 : 0)
