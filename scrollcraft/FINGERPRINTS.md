# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| trahdo (2026-10-06) | Session replay (new): one synthetic trading day replayed under the scroll; acts are times of day | Floating glass pill nav on every page (wordmark, four links, one CTA) plus a floating bottom session dock on Home: clock, current act, the day as a thin track, stops jump to acts | Centred claim over a Market Intelligence window computed from the sample session, rising from the bottom edge as the clock runs 09:15 to 10:00 and the first alert fires; ember glow, dotted dome and floating sector pills lean against the pointer | pin(hero) > pin(argument cues + tab collapse) > flow(+wipe) > pan > flow(operable ticket) > pin(custom 3-layer sweep, peak 5.2vh) > pin(short hold); 7 acts, 16.5vh, 0 scrub, 0 video | The bell: the day line completes at 15:30, two real entry points, last cue greet-and-hold; no spotlight or magnet | The Session: one seeded 375-minute day computed in the page; scroll is the clock; the same event traced as an alert, an order and a P&L on one shared time axis | Data world: synthetic market series, rebased to 100, plus the real product screenshot and the brand's ember light photograph | React 19 + Vite + Tailwind v4, engine vendored per route |


---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Grammar: Session replay** (a time-of-day axis as the page's structure; one clock shared by every act).
- **Nav: a fixed bottom rail that draws the whole day as a line** with the scroll position as a playhead.
- **Signature move: scroll as a trading-day clock over one seeded dataset, with alerts computed by rules.**
- **Band: 7 acts at 16.5vh with the peak at 5.2vh**, no scrub.
- Shares with filmic builds, so avoid next time: a pinned hero with parallax planes, and a greet-and-hold close cue.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
