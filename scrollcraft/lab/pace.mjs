// Measures how fast the page moves under a hard wheel flick, smoothed vs raw (reduced motion = raw).
import fs from 'node:fs'
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://localhost:5173'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await chromium.launch({ executablePath: CHROME, headless: true })

async function run(label, reducedMotion) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.mouse.move(700, 450)
  const samples = []
  const t0 = Date.now()
  const sampler = (async () => {
    while (Date.now() - t0 < 4200) {
      samples.push([Date.now() - t0, await page.evaluate(() => scrollY)])
      await page.waitForTimeout(50)
    }
  })()
  // a hard flick: 40 events of 300px in ~0.5s (12000px requested)
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(12)
  }
  await sampler
  // peak speed over any 500ms window (single 50ms diffs are noisy in headless Chrome)
  let peak = 0
  for (let i = 0; i < samples.length; i++) {
    const j = samples.findIndex((s) => s[0] >= samples[i][0] + 500)
    if (j < 0) break
    peak = Math.max(peak, ((samples[j][1] - samples[i][1]) / (samples[j][0] - samples[i][0])) * 1000)
  }
  const end = samples.at(-1)[1]
  const at = (ms) => samples.find((s) => s[0] >= ms)?.[1]
  console.log(`${label.padEnd(10)} requested 12000px | at 0.5s ${at(500)} | at 1s ${at(1000)} | at 2s ${at(2000)} | final ${end} | peak speed ${Math.round(peak)} px/s (${(peak / 900).toFixed(1)} screens/s)`)
  await ctx.close()
  return { peak, end }
}

const raw = await run('raw', 'reduce')
const smooth = await run('smoothed', 'no-preference')

// A normal, gentle scroll must still feel responsive: 5 notches of 100px.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.mouse.move(700, 450)
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 100)
    await page.waitForTimeout(80)
  }
  await page.waitForTimeout(900)
  console.log('gentle     5 notches of 100px ->', await page.evaluate(() => scrollY), 'px (expect about 400)')
  // keyboard
  await page.keyboard.press('PageDown')
  await page.waitForTimeout(1200)
  console.log('PageDown   ->', await page.evaluate(() => scrollY), 'px')
  await page.keyboard.press('End')
  await page.waitForTimeout(1500)
  const end = await page.evaluate(() => [scrollY, document.documentElement.scrollHeight - innerHeight])
  console.log('End key    ->', end[0], 'of', end[1])
  // dock jump must still be exact
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(300)
  await page.locator('.rail__tick[aria-label="Jump to Trade"]').click()
  await page.waitForTimeout(500)
  console.log('dock jump  -> trade top at', await page.evaluate(() => Math.round(document.getElementById('trade').getBoundingClientRect().top)))
  await ctx.close()
}

await browser.close()
console.log(smooth.peak < raw.peak * 0.6 ? 'PASS: flick is paced' : 'FAIL: flick is not paced')
