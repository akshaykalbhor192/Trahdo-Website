# Trahdo

Marketing site for Trahdo: one place to research, trade, and track a portfolio across
Trahdo Market Intelligence and Trahdo App.

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4 (preflight and tokens), React Router, and the
Scroll-Craft engine (vendored, unmodified) for scroll-driven acts.

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

## How the home page works

The home page is one synthetic trading day (09:15 to 15:30 IST) replayed under the scroll.
Scroll position is the time of day.

- `src/session/data.ts` generates the day from fixed seeds: an index, five stocks, sector
  moves, volume. It is **sample data**, rebased to 100 at the open, and every surface that
  shows it says so. Alerts are not hand-placed: `detectAlerts()` runs the same two rules the
  panels describe (volume above 2.5x the 30-minute average, a move beyond 1.5% in 15 minutes).
- `src/session/clock.ts` maps scroll position to a session minute using `data-t0` / `data-t1`
  on each act.
- `src/components/home/*` are the seven acts: Hero, Tabs, Place, Research, Trade, Peak, Close.
- `src/components/home/SessionRail.tsx` is the fixed bottom rail (the day as a line, with the
  playhead at the current scroll position).

The other routes (`/about`, `/security`, `/careers`, 404) share the same tokens, type and
engine setup.

## Paced scrolling

`src/lib/smoothScroll.ts` eases the mouse wheel and trackpad and caps how fast the page can move,
so a hard flick still plays every scroll-driven moment. Tune `LERP`, `WHEEL_GAIN`, `LEAD` and
`MAX_SPEED` at the top of that file. It leaves touch scrolling, the scrollbar, in-page scroll
regions and reduced-motion visitors alone. `scrollcraft/lab/pace.mjs` measures it.

## Where to edit things

- **Destinations** (`src/lib/links.ts`): Market Intelligence URL, Trahdo App early-access link,
  security contact, status page, careers contact, social links. A `null` renders an honest
  "coming" state instead of a dead link. Fill these in as they go live.
- **Company claims** (`src/content.ts`): the timeline, principles, security statements and trust
  items. All of it was carried over from the previous site and is **owner-supplied and
  unverified by the redesign**. Confirm each statement is true before launch.
- **Design tokens** (`src/styles/tokens.css`): colours for Market Intelligence (graphite and
  green), Trahdo App (warm ink and ember), and the shared radius and spacing scales.

## Scroll-Craft

`src/vendor/scrollcraft/` is a vendored copy of the engine. Do not edit it; theme with the
`--sc-*` tokens and drive page-specific behaviour from page code. Its CSS is imported into a
cascade layer (`layer(sc)` in `src/index.css`) so it cannot override Tailwind or page styles.
`ScrollCraftRoot` mounts it per route and destroys it on navigation.

The design brief, feeling curve and fingerprint are in `scrollcraft/builds/trahdo/BRIEF.md`.
`scrollcraft/lab/` holds the verification scripts (`snap.mjs`, `behave.mjs`) and the engine
harness output. They need `playwright-core` (installed in `scrollcraft/lab`) and a running
server.

## Deployment

Deployed on Vercel (see `vercel.json` for the SPA rewrite rule).
