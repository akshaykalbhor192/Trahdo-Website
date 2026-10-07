Self-authored, not interviewed. The request supplied the vision, pages, constraints and
quality bar in detail; creative direction (grammar, peak, signature move, journey) was left
to the build. Evidence and assumptions are labelled.

# Trahdo: build brief

## Evidence (what is actually known)

| Fact | Source |
|---|---|
| Two products. **Trahdo Market Intelligence** is live at unicorn-dashboard-rust.vercel.app (external). **Trahdo App** is "in early access", no public link yet. A third product is "coming soon". | existing `Products.tsx`, `Hero.tsx` |
| Market Intelligence: "Markets move fast. Stay ahead of the close." Live NSE/BSE indices, sector heatmaps, top movers. Smart Alerts: momentum, volume spikes, news clusters, detected automatically. AI Copilot: ask why anything moved today, get a sourced live answer. | `src/assets/market-intelligence.png` (the real product, sign-in screen) |
| Trahdo App: Level 2 order books, scanners, one-click execution. Spread shown before you click. Performance, risk and tax lots update as they change. | existing site copy (owner-authored) |
| MI product identity: graphite ground (`#141416` to `#1d1f24`), signal green `#3ddc84` for up moves, amber `#ffd166` for alerts, off-white `#f3f4f8`. Wordmark "trahdo" lowercase with a flat bar over a slanted stem. | pixels sampled from the screenshot |
| Site identity so far: warm ink `#0b0906`, cream `#f4ead9`, ember `#c8703c` / `#e3a15f`, Geist Sans + Geist Mono. An ember light-band photograph (`hero-bg.png`). | existing `index.css`, assets |
| Routes that exist: `/`, `/about`, `/security`, `/careers`, `*`. `vercel.json` SPA rewrite. | codebase |

**Assumptions / owner-supplied claims I did not verify** (carried over, not invented; listed in the
final report): the company timeline dates, "regulated", "segregated funds", "256-bit/TLS 1.3",
"2FA on every account", bug bounty, "no hidden fees". Every claim lives in `src/content.ts` or
`src/lib/links.ts` so the owner can correct it in one place.

**Removed rather than carried over:** the anonymous testimonial ("I closed four other trading
apps...", attributed to "A Trahdo trader"), the made-up security-settings dashboard, social links
and help-centre links that pointed at `#`.

## The eight topics

1. **Vibe.** Quiet instrument panel after the bell. Dark, exact, a little cold, with one warm
   light in it. References: an audio waveform editor mid-scrub; a Bloomberg-terminal-adjacent
   night desk; the amber glow of a tube amp. Not a SaaS landing page.
2. **Journey.** Open at 09:15 with the market about to move. Name the clutter of tabs. Turn:
   one place. Research (Market Intelligence). Trade (Trahdo App). Then the one moment: the same
   instant seen as an alert, an order and a P&L. Close at the bell.
3. **Energy curve.** Calm, tense, relief, curious, in control, then the loudest thing on the
   page, then quiet.
4. **Feeling curve + the one moment.** See below.
5. **The one thing no site has done.** Scroll is the trading day. One clock, 09:15 to 15:30
   IST, runs the whole page, and the same sample event is traced through research, trade and
   track on a single shared time axis.
6. **How far from premium-minimal.** *Dense* (data-forward, small mono labels, high information
   count) with one dramatic act. Not minimal, not maximal.
7. **Unbroken world or scenes?** Distinct scenes, stitched by one clock. No video. The world is
   the data: a seeded synthetic session, computed in the page.
8. **Assets.** Real: the Market Intelligence screenshot, the traced wordmark mark, the ember
   light-band photograph. Everything else is markup computed from labelled sample data. No
   generation spend, no `KIE_AI_API_KEY` used.

## Journey (six beats)

1. **Anticipation**: market about to open. The headline lands on a live-looking session line.
2. **Tension**: five tabs to check one price. The cost, named plainly.
3. **Turn**: one place. Two products, one session.
4. **Substance, research**: what Market Intelligence shows, with operable sample panels.
5. **Substance, action**: a Trahdo App order ticket and ladder the visitor can use.
6. **Peak then commitment**: one moment, three views; then the bell and one action.

## Feeling curve (written before the score)

| # | Act | Feeling | What on screen causes it |
|---|---|---|---|
| 1 | Pre-open | Anticipation | A hairline session line, a clock at 09:14, depth planes that lean with the pointer |
| 2 | Tabs | Unease | Lines of copy arrive one at a time while browser tabs pile up along the top |
| 3 | One place | Relief | The tabs collapse into a single tab; the ground splits graphite and warm |
| 4 | Research | Curiosity | A sideways rail of working panels: movers, alerts the page computes, the real product |
| 5 | Trade | Control | The visitor clicks Buy in a one-click ticket and a fill lands on a moving ladder |
| 6 | **One moment** | **Awe, then click** | Peak. One vertical "now" line sweeps three stacked layers on one time axis |
| 7 | The bell | Resolve | The line completes at 15:30, the layers settle, two doors open |

**The peak.** Act 6, "One moment". Largest span on the page (about 5.2 viewport-heights). The
silence in front of it: act 5 is a flow section the visitor operates themselves, not a pinned
spectacle.
Sentence a visitor would say to a friend: *"The whole trading day plays as you scroll, and at
11:42 one volume spike shows up as an alert, then as my order, then as my profit, all lined up
on the same line."*

**Tell-someone sentence.** It's the site where scrolling is the trading day: the clock runs from
the open to the bell, and one event is traced from the alert, through the order, to what it
made you.

**Authored silence.** Between act 5 and act 6 there is a short ground-only stretch (the stage
holds the clock at 11:00 with all three layers empty) so the sweep has something to start from.
Marked in the page with `data-sc-verify-hold` only while it is active.

## Grammar

**New grammar: Session replay.** A page that is one recorded session replayed under the hand.
It is not any of the eight defined grammars:

- *Not filmic one-shot*: no video, no continuous scrub, acts are distinct scenes of different
  devices. The shared object is a clock and a data series, not a camera.
- *Not live surface*: it keeps headings, display type and a marketing narrative; the surface
  appears inside acts, not as the page chrome.
- *Not chaptered editorial*: sequence is time, not chapters; no hard-cut grounds, one clock
  runs through.
- *Not split stage*: three layers on one axis, not two sides in tension.
- *Not cutlist / gallery / poster / continuous world*: no hard-cut pacing, no objects index, no
  type-as-image, no worldflight.

Constraints that define it (so it cannot drift back to filmic):

- **Nav** is a time axis. Home: a fixed bottom *session rail* (the whole day as one thin line,
  a playhead, ticks that jump to acts). Everywhere: a slim top bar (wordmark, four links, one CTA).
- **Sequence** is chronological: every act sits at a time of day (09:15, 09:30, 10:00,
  10:15, 11:15, 11:00 to 15:30, 15:30).
- **Ending** is the bell: the series completes and the page offers two entry points. No
  spotlight, no magnet, no kinetic-type close.
- **Bans:** `scrub` video, `spotlight`, `magnet`, kinetic type beyond one headline, identical
  card grids, centred hero copy, faux dashboards drawn as images or dummy divs.
- **Honesty rule (from the live-surface rule):** every panel is real markup computed from data
  arrays in the page, and the page says on its face that the data is a sample.

## Signature move: **the Session**

One seeded, synthetic 375-minute trading session, computed in the page (`src/lib/session.ts`).
Scroll position is the time of day. The same dataset renders as:
the index line in the hero and in the bottom rail; movers and **alerts detected by real rules**
(volume above 2.5x the 30-minute average, 15-minute momentum above 1.5%) in Research; a
bid/ask ladder and a working one-click ticket in Trade; and the three-layer sweep in the peak.
No kit device does this. Nothing here is a parameter change.

## Aesthetic, grounds and accent

- **Two product identities, one system.** The company shares Geist Sans + Geist Mono, one
  radius scale, one spacing scale, the traced wordmark and the session line.
  *Market Intelligence* chapters: graphite ground, signal-green accent, amber for alerts.
  *Trahdo App* chapters: warm ink ground, ember accent, the ember light-band photograph.
- **Deliberate departure from "one accent per page"**: the brief asks for two product
  identities. The licence in taste.md is two stops keyed to ground family. Here it is two hues
  keyed to product, held strictly by chapter, and contrast is measured on the render. Gain/loss
  colours (green/coral) are a separate semantic pair used only for numbers.
- Whole site dark. The old light "paper" grounds are removed.

## Score (device per beat)

| Act | Time | Device | Why |
|---|---|---|---|
| 1 Pre-open | 09:15 | `pin` + parallax planes + pointer lean | The first frame is a composition with four planes, not a title |
| 2 Tabs | 09:30 | `pin` + cues + one kinetic headline | Argument, assembled line by line while tabs pile up |
| 3 One place | 10:00 | `flow` + `reveal` wipe | A change of state: the tabs become one |
| 4 Research | 10:15 | `pan` | Breadth: a range of capabilities, travelled sideways |
| 5 Trade | 11:15 | `flow` + operable ticket | The visitor acts; the page stops being a film |
| 6 One moment | 11:00 to 15:30 | `pin` + custom 3-layer sweep (CSS vars + SVG) | The peak |
| 7 The bell | 15:30 | `pin` (short, held) | Resolve and commit |

Five device families; no family twice in a row; zero `scrub`. About 15.4 viewport-heights.

## Fingerprint gate

Registry was empty, so the gate has nothing to clear on this first build. The row appended at
the end records what is now taken.

## Pages

- **About**: full-viewport timeline as one long pinned act; a year numeral and the time axis
  carry the story; ground drifts graphite to warm as the second product arrives.
- **Security**: the two products as two lanes; a diagram of owner-supplied protections, not a
  fake settings panel.
- **Careers**: honest "no roles posted yet" state, drawn as a flat session line.
- **404**: the line leaves the chart.
- Shared: one nav, one footer, one CTA label ("Get started") everywhere.

## Verification plan

Build (`tsc -b && vite build`), lint (`oxlint`), then Playwright via `shoot.mjs` at 1440x900,
390x844 and 360x640, reduced motion, plus manual checks: rail overflow, focus order, keyboard
through the pan rail, contrast on the render, route changes (engine destroy/re-mount), deep link
`/#get-started`.

---

## As built (updates after verification)

- **Kinetic type was not used.** The score listed `pin` + kinetic for act 2; the tab-collapse
  plus overlapping cues did the job without it. Device families: parallax planes, cue argument,
  `reveal` wipe, `pan`, operable flow, custom sweep. Zero `scrub`, zero video.
- **Length is 16.5 viewport-heights at 1440x900 (17.8 on a phone, 19.1 at 360x640)**, above the
  8 to 14 pacing reference. The peak (5.2) and the research pan (3.6) account for it; every act
  has visible change at every sampled position (harness: no dead scroll).
- **Silence before the peak** is act 5 (a flow section the visitor operates), not an empty
  stage. At the start of the peak the clock holds at 11:00 with all three layers drawn as ghost
  lines, then the sweep fills them. `data-sc-verify-state` reports the minute so the harness
  sees the bespoke stage.
- **Research ends at 10:55** (not 10:45) so the second computed alert (INFY momentum, 10:48)
  has fired by the end of the rail.
- **Eyebrow labels** were trimmed after the taste pass (one per three sections).
- **Removed rather than carried over:** anonymous testimonial, "few hundred early users" and
  "fast-growing community" claims, the fake security-settings panel, `#` links, social links,
  the "256-bit encryption" strip. "Not FDIC insured" and the other footer disclaimers were kept
  as supplied (FDIC is a US body; the owner should review it for an NSE/BSE product).

## Feel check (cold pass over the contact frames, then compared with the curve above)

| Act | Intended | Felt |
|---|---|---|
| 1 Pre-open | Anticipation | Calm, expectant. The ghost day line reads as "something is about to happen". |
| 2 Tabs | Unease | Mild unease, then relief as the five tabs slide into one. Works. |
| 3 One place | Relief | Clear, slightly static. It is the quietest act and does its job as the turn. |
| 4 Research | Curiosity | Curious. The alerts filling as the clock moves is the best surprise before the peak. |
| 5 Trade | Control | In control. The ticket is the only place the visitor acts, and it feels like it. |
| 6 One moment | Awe, then click | Satisfying and precise more than awestruck. The "click" lands (alert, order, P&L line up); the awe is quieter than planned. |
| 7 The bell | Resolve | Resolved. The completed line and two doors give the page somewhere to stop. |

Where it differs from the plan: act 6 is more *precision* than *awe*. That fits a finance
audience, so the peak was left restrained rather than made louder.

---

## Update: three products

The product line is now **Market Intelligence (live)**, **Trahdo App (coming soon)** and **F&O
Advisor (coming soon)**, where F&O Advisor "explains positions and risk" (the owner's words).

- "Early access" is gone everywhere; Trahdo App and F&O Advisor say "Coming soon" and have
  notify-me link slots (`LINKS.appNotify`, `LINKS.advisorNotify`) that render an honest
  "Launch details coming" until filled.
- **Third identity: F&O Advisor** takes a deep ink-blue ground and a clear blue (`--adv-*`),
  held to its own chapter, the Products pane, its close door and its About chip.
- **New act, F&O Advisor**, between Trade and the peak: an operable payoff explainer (buy a
  call, buy a put, bull call spread, sell a put) computed from real option maths on illustrative
  numbers. It shows the payoff at expiry, the most you can lose, the most you can make and the
  break-even, plus a plain-language paragraph built from the same numbers. It states that it is
  illustrative and not a recommendation. It deliberately shows **no** trade ideas, no margin
  figures and no performance claims, because none were supplied.
- The dock's Trade stop now reads "Trade & F&O". Eight acts, six device families.
- Security copy says Trahdo App is coming soon and that F&O Advisor's security details will be
  published at launch; no F&O protections were invented.
