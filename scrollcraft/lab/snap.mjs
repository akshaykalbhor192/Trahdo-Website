// Ad-hoc visual check: node snap.mjs --path / --w 1440 --h 900 --out shots/x --at open:0,open:0.8,tabs:0.5
// "id:p" jumps to p (0..1) of that act's pinned travel (or of its height for flow acts).
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const argv = process.argv.slice(2)
const arg = (n, d) => {
  const i = argv.indexOf(n)
  return i > -1 && argv[i + 1] ? argv[i + 1] : d
}
const has = (n) => argv.includes(n)
const BASE = arg('--base', 'http://localhost:5173')
const route = arg('--path', '/')
const W = parseInt(arg('--w', '1440'), 10)
const H = parseInt(arg('--h', '900'), 10)
const OUT = path.resolve(arg('--out', 'shots/snap'))
const at = arg('--at', 'open:0').split(',')
const reduced = has('--reduced')
const touch = has('--touch')
const full = has('--full')

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p))
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  hasTouch: touch,
  isMobile: touch,
})
const page = await ctx.newPage()
const logs = []
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`)
})
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))
await page.goto(BASE + route, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(700)

for (const spec of at) {
  if (full) {
    await page.screenshot({ path: path.join(OUT, 'full.png'), fullPage: true })
    break
  }
  const [id, pRaw] = spec.split(':')
  const p = parseFloat(pRaw ?? '0')
  const y = await page.evaluate(
    ([id, p]) => {
      const el = id === 'y' ? null : document.getElementById(id)
      if (id === 'y') return p
      if (!el) return -1
      const r = el.getBoundingClientRect()
      const top = r.top + scrollY
      const pinned = el.dataset.scAct && el.dataset.scAct !== 'flow'
      const travel = pinned ? Math.max(r.height - innerHeight, 1) : Math.max(r.height - innerHeight, 1)
      return Math.round(top + travel * p)
    },
    [id, p],
  )
  if (y < 0) {
    console.log('missing', id)
    continue
  }
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
  await page.waitForTimeout(450)
  const name = `${spec.replace(/[:.]/g, '_')}.png`
  await page.screenshot({ path: path.join(OUT, name) })
  console.log('shot', name, 'y=', y)
}
if (logs.length) console.log('--- console ---\n' + [...new Set(logs)].join('\n'))
await browser.close()
