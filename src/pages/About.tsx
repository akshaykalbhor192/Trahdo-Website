import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import ScrollCraftRoot from '../components/ScrollCraftRoot'
import { Arrow, Mark } from '../components/Mark'
import { CTA_LABEL } from '../lib/links'
import { principles, teamNote, timeline } from '../content'
import { pinProgress } from '../session/clock'
import { SERIES, SESSION_MINUTES, linePath, rangeOf } from '../session/data'
import miShot from '../assets/market-intelligence.webp'

/*
 * About. Four full-viewport scenes. The story is a time axis (2021 to today), carried by one
 * long pinned act whose ground warms from graphite to ember as the second product arrives.
 */

const W = 1000
const H = 120
const [lo, hi] = rangeOf(SERIES.NIFTY.price, 0, SESSION_MINUTES)
const LINE = linePath(SERIES.NIFTY.price, 0, SESSION_MINUTES, W, H, lo - 0.1, hi + 0.1, 6)

// Beat windows over the act's pinned progress. Overlap ~15% so there is never a gap.
const beats = [
  { cue: '0 0.27 0 0.2', ...timeline[0] },
  { cue: '0.25 0.52 0.2 0.2', ...timeline[1] },
  { cue: '0.5 0.77 0.2 0.2', ...timeline[2] },
  { cue: '0.75 1 0.2 0.01', ...timeline[3] },
]

function Sheet() {
  const cols = ['Ticker', 'Qty', 'Entry', 'Now']
  return (
    <div className="sheet" role="img" aria-label="An empty shared spreadsheet with the columns Ticker, Qty, Entry and Now">
      <div className="sheet__bar mono">fx</div>
      <div className="sheet__grid">
        {cols.map((c) => (
          <span key={c} className="sheet__head mono">
            {c}
          </span>
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="sheet__cell" />
        ))}
      </div>
    </div>
  )
}

function Terminal() {
  const levels = [3, 5, 2, 4, 1]
  return (
    <div className="mini" role="img" aria-label="Order book illustration: live market, buy and sell">
      <div className="mini__rows">
        {levels.map((w, i) => (
          <span key={i} style={{ transform: `scaleX(${w / 5})` }} />
        ))}
      </div>
      <ul className="mini__tags mono">
        <li>Live market</li>
        <li>Buy</li>
        <li>Sell</li>
      </ul>
    </div>
  )
}

function Both() {
  return (
    <div className="both" role="img" aria-label="Trahdo Market Intelligence, Trahdo App and F&O Advisor">
      <div className="both__mi">
        <Mark />
        <span>Market Intelligence</span>
        <small className="mono">Live</small>
      </div>
      <div className="both__app">
        <Mark />
        <span>App</span>
        <small className="mono">Coming soon</small>
      </div>
      <div className="both__adv">
        <Mark />
        <span>F&amp;O Advisor</span>
        <small className="mono">Coming soon</small>
      </div>
    </div>
  )
}

const visuals = [
  <Sheet key="s" />,
  <img key="m" className="shot" src={miShot} width="1600" height="1000" alt="Trahdo Market Intelligence, the first product" loading="lazy" />,
  <Terminal key="t" />,
  <Both key="b" />,
]

export default function About() {
  const stageRef = useRef<HTMLDivElement>(null)

  // Publish what the story stage actually paints (axis fill and ground warmth, rounded) so the
  // verification harness can see this bespoke change.
  useEffect(() => {
    const stage = stageRef.current
    const act = stage?.parentElement
    if (!stage || !act) return
    let frame = 0
    const update = () => {
      frame = 0
      const p = pinProgress(act)
      const k = Math.min(Math.max((p - 0.4) / 0.32, 0), 1)
      stage.dataset.scVerifyState = `${Math.round(p * 100)}|${Math.round(k * 20)}`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <ScrollCraftRoot className="about" title="About | Trahdo">
      <main id="main">
        {/* 1. Arrival */}
        <section className="page-hero act" data-sc-act="flow" data-sc-drift="#0c0b0b" aria-labelledby="about-title">
          <div className="page-hero__inner" data-sc-in data-sc-stagger="80">
            <h1 id="about-title" className="display display--xl">
              Moving markets, money and every investor forward.
            </h1>
            <p className="lede">
              We are a small team building the infrastructure we wished existed when we started
              investing: research, execution and portfolio tracking that all speak to each other,
              instead of fighting for a tab.
            </p>
          </div>
          <svg className="page-hero__line" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={LINE} vectorEffect="non-scaling-stroke" />
          </svg>
        </section>

        {/* 2. The timeline: one pinned act, four full-viewport beats */}
        <section
          id="story"
          className="story act"
          data-sc-act="pin"
          data-sc-span="5"
          data-sc-drift="#121316"
          aria-label="Our story"
        >
          <div data-sc-stage ref={stageRef} className="story__stage">
            <div className="story__years" aria-hidden="true">
              {beats.map((b) => (
                <span key={b.year} className="story__year mono" data-sc-cue={b.cue}>
                  {b.year}
                </span>
              ))}
            </div>

            <div className="story__beats">
              {beats.map((b, i) => (
                <article key={b.year} className="story__beat" data-sc-cue={b.cue}>
                  <p className="sr-only">{b.year}</p>
                  <h2 className="display display--lg">{b.title}</h2>
                  <p className="lede">{b.body}</p>
                  <div className="story__visual">{visuals[i]}</div>
                </article>
              ))}
            </div>

            <div className="story__axis" aria-hidden="true">
              <i className="story__fill" />
              {beats.map((b, i) => (
                <span
                  key={b.year}
                  className="story__tick mono"
                  style={{ left: `${(i / (beats.length - 1)) * 100}%`, '--i': i } as CSSProperties}
                >
                  {b.year}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Beliefs */}
        <section className="beliefs act" data-sc-act="flow" data-sc-drift="#0e0a07" aria-labelledby="beliefs-title">
          <div className="beliefs__inner">
            <div className="beliefs__head" data-sc-in data-sc-stagger="70">
              <p className="label">What we believe</p>
              <h2 id="beliefs-title" className="display display--lg">
                The principles behind every product decision.
              </h2>
            </div>
            <dl className="beliefs__list" data-sc-in data-sc-stagger="70">
              {principles.map((p) => (
                <div key={p.title} className="beliefs__row">
                  <dt className="display display--sm">{p.title}</dt>
                  <dd className="body">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 4. A note from the team */}
        <section className="note act" data-sc-act="flow" data-sc-drift="#0e0a07" aria-labelledby="note-title">
          <div className="note__inner" data-sc-in data-sc-stagger="80">
            <h2 id="note-title" className="display display--lg">
              {teamNote.lead}
            </h2>
            <div className="note__body">
              {teamNote.body.map((p) => (
                <p key={p} className="lede">
                  {p}
                </p>
              ))}
            </div>
            <p className="note__sign">The Trahdo team</p>
          </div>
        </section>

        {/* 5. Close */}
        <section className="cta-block act" data-sc-act="flow" data-sc-drift="#0d0907" aria-labelledby="about-cta">
          <div className="cta-block__inner" data-sc-in data-sc-stagger="80">
            <h2 id="about-cta" className="display display--xl">
              Come see what we are building.
            </h2>
            <p className="lede">Three products, one mission. Start with the one that is live today.</p>
            <div className="cta-block__row">
              <Link to="/#get-started" className="btn btn--primary">
                {CTA_LABEL}
                <Arrow />
              </Link>
              <Link to="/careers" className="textlink">
                Careers
                <Arrow size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </ScrollCraftRoot>
  )
}
