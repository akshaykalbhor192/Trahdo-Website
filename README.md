# Trahdo

Marketing site for Trahdo's two live products:

- **Trahdo Market Intelligence** (https://dashboard.trahdo.com/): live NSE/BSE data, smart alerts
  and an AI copilot.
- **F&O Advisor** (https://fo-advisor.vercel.app/): index calls for NIFTY, BANKNIFTY, FINNIFTY and
  SENSEX, made only above a 65% bar and graded against what happened next.

Product pictures on the site are screenshots of these two live sites (`src/assets/fo-*.webp`,
`src/assets/market-intelligence.webp`).

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4 (preflight only) and React Router. No animation
library: motion is CSS plus a few small hooks, and design 5's pictures are a hand-written WebGL
particle field.

## Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: type-check and build for production
- `npm run preview`: preview the production build locally
- `npm run lint`: run Oxlint

## Two designs

Two designs are kept side by side for review. A switcher in the bottom-left corner
(`src/components/VersionToggle.tsx`) flips between them on the same page; remove it once one
is chosen. Every other path, including `/` and the old `/new` and `/5th` links, redirects into
the matching design (`src/App.tsx`).

- **2nd, "Dawn Field"** (`/2nd`, `src/v5/`): 1st's colours (warm paper, near-black ink,
  one ember accent) set in Archivo and Instrument Sans. Its pictures are a few thousand particles
  (`src/v5/field.ts`) that re-form as you scroll: the session line, sector heat, the volume
  spike, the copilot, the four indices, the weighing, the call ring, the graded calls and the
  Trahdo mark. Any element with `data-scene="<shape>"` is a box the field fills.
- **1st** (`/1st`, `src/v2/`): a warm paper page set in Instrument Serif and Geist.

Each design scopes all of its styles under one class (`.qx` for design 5, `.nx` for design 2),
so they never meet. Both share the content, links and sample data below, and the motion hooks in
`src/v2/motion.ts`.

## Sample data

`src/session/data.ts` generates one synthetic trading day (09:15 to 15:30 IST) from fixed seeds:
an index, five stocks, sector moves, volume. It is **sample data**, rebased to 100 at the open,
and every surface that shows it says so. Alerts are not hand-placed: `detectAlerts()` runs the
same two rules the panels describe (volume above 2.5x the 30-minute average, a move beyond 1.5%
in 15 minutes). The graded calls come from a simple illustrative rule (`CALLS`), not F&O
Advisor's model, and the pages say so.

## Paced scrolling

`src/lib/smoothScroll.ts` eases the mouse wheel and trackpad and caps how fast the page can move,
so a hard flick still plays every scroll-driven moment. Tune `LERP`, `WHEEL_GAIN`, `LEAD` and
`MAX_SPEED` at the top of that file. It leaves touch scrolling, the scrollbar, in-page scroll
regions and reduced-motion visitors alone.

## Where to edit things

- **Destinations** (`src/lib/links.ts`): the Market Intelligence and F&O Advisor URLs, security
  contact, status page, careers contact, social links. A `null` renders an honest
  "coming" state instead of a dead link. Fill these in as they go live.
- **Company claims** (`src/content.ts`): the timeline, principles, security statements and trust
  items. All of it was carried over from the previous site and is **owner-supplied and
  unverified by the redesign**. Confirm each statement is true before launch.
- **2nd's colours** (top of `src/v5/v5.css`, and `INK` in `src/v5/field.ts` for the particles).

## Deployment

Deployed on Vercel (see `vercel.json` for the SPA rewrite rule).
