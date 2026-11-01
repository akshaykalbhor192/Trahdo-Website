import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { LINKS, CTA_LABEL } from '../lib/links'
import { Mark } from '../components/Mark'
import {
  CALLS,
  EVENT_ALERT,
  SECTORS,
  SERIES,
  SESSION_MINUTES,
  STOCKS,
  VOLUME_MULTIPLE,
  clockLabel,
  fmtPct,
  pct,
} from '../session/data'
import { principles, teamNote } from '../content'
import { Btn, Eyebrow, Line, Live, Rise, to } from './ui'
import { reducedMotion, spotlight, useCountUp, useProgress } from './motion'
import miShot from '../assets/market-intelligence.webp'
import foShot from '../assets/fo-hero.webp'
import watch from '../assets/fo-watch.webp'
import weigh from '../assets/fo-weigh.webp'
import call from '../assets/fo-call.webp'
import check from '../assets/fo-check.webp'

const END = SESSION_MINUTES
const NIFTY = SERIES.NIFTY.price
const dayMove = (values: number[]) => pct(values[0], values[END])

/* ================================================================ hero == */

/**
 * The product window. Everything in it is the sample session (src/session/data.ts), drawn
 * live: the chart strokes itself in, the alert toast lands, two cursors work the screen.
 */
function Dashboard() {
  const alertStock = SERIES[EVENT_ALERT.symbol]
  return (
    <div className="nx-dash" role="img" aria-label="Trahdo Market Intelligence with a sample session: a NIFTY 50 chart, a watchlist, sector moves, an AI brief and a volume alert.">
      <div className="nx-dash__chrome">
        <span className="nx-dash__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="nx-dash__url">dashboard.trahdo.com</span>
        <span className="nx-tag">Sample session</span>
      </div>
      <div className="nx-dash__body">
        <aside className="nx-dash__list">
          <p className="nx-dash__label">Watchlist</p>
          {STOCKS.map((id) => {
            const c = dayMove(SERIES[id].price)
            return (
              <div key={id} className="nx-dash__row">
                <span>{id}</span>
                <Line values={SERIES[id].price} w={80} h={24} pad={2} className={c >= 0 ? 'is-up' : 'is-down'} />
                <b className={`nx-num ${c >= 0 ? 'is-up' : 'is-down'}`}>{fmtPct(c)}</b>
              </div>
            )
          })}
        </aside>
        <div className="nx-dash__main">
          <div className="nx-dash__head">
            <div>
              <p className="nx-dash__label">NIFTY 50 · rebased to 100</p>
              <p className="nx-dash__price nx-num">
                {NIFTY[END].toFixed(2)} <small className={dayMove(NIFTY) >= 0 ? 'is-up' : 'is-down'}>{fmtPct(dayMove(NIFTY))}</small>
              </p>
            </div>
            <div className="nx-dash__seg" aria-hidden="true">
              <span className="is-on">1D</span>
              <span>1W</span>
              <span>1M</span>
            </div>
          </div>
          <Line values={NIFTY} w={760} h={220} area className="nx-dash__chart is-ink" />
          <div className="nx-dash__axis nx-num" aria-hidden="true">
            <span>09:15</span>
            <span>11:00</span>
            <span>12:45</span>
            <span>14:15</span>
            <span>15:30</span>
          </div>
        </div>
        <aside className="nx-dash__side">
          <div className="nx-dash__card">
            <p className="nx-dash__label">AI brief</p>
            <p className="nx-dash__brief">
              Metals lead after a volume surge in {EVENT_ALERT.symbol} at {clockLabel(EVENT_ALERT.minute)}. Banks steady, FMCG lags.
            </p>
          </div>
          <div className="nx-dash__card">
            <p className="nx-dash__label">Sectors</p>
            {SECTORS.slice(0, 5).map((s, i) => {
              const c = dayMove(s.price)
              return (
                <div key={s.name} className="nx-dash__sector">
                  <span>{s.name}</span>
                  <i style={{ '--w': `${Math.min(Math.abs(c) * 60, 100)}%`, '--i': i } as CSSProperties} className={c >= 0 ? 'is-up' : 'is-down'} />
                </div>
              )
            })}
          </div>
        </aside>
      </div>

      <div className="nx-toast" aria-hidden="true">
        <span className="nx-toast__icon">!</span>
        <div>
          <b>
            {alertStock.name} · Volume {EVENT_ALERT.value.toFixed(1)}×
          </b>
          <span>
            Above {VOLUME_MULTIPLE}× the 30-min average · {clockLabel(EVENT_ALERT.minute)}
          </span>
        </div>
      </div>

      <span className="nx-cursor nx-cursor--a" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M1 1l5.2 13 1.9-5.4L13.6 7z" />
        </svg>
        <em>You</em>
      </span>
      <span className="nx-cursor nx-cursor--b" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M1 1l5.2 13 1.9-5.4L13.6 7z" />
        </svg>
        <em>AI copilot</em>
      </span>
    </div>
  )
}

function Hero() {
  const winRef = useRef<HTMLDivElement>(null)
  useProgress(winRef, 'enter')

  return (
    <section className="nx-hero" aria-labelledby="nx-hero-title">
      <div className="nx-hero__bg" aria-hidden="true">
        <div className="nx-hero__grid" />
        <div className="nx-hero__glow" />
      </div>
      <div className="nx-wrap nx-hero__copy">
        <a className="nx-announce" href="#products" data-r>
          <span className="nx-announce__pill">New</span>
          Market Intelligence and F&amp;O Advisor are both live
          <span aria-hidden="true">→</span>
        </a>
        <Rise as="h1" id="nx-hero-title" text="Investing, built for the way markets *actually move.*" className="nx-display nx-display--hero" />
        <p className="nx-lede" data-r style={{ '--d': '420ms' } as CSSProperties}>
          See what is moving across the market, and get index calls you can check before you act. One calm place for the
          whole session.
        </p>
        <div className="nx-hero__cta" data-r style={{ '--d': '520ms' } as CSSProperties}>
          <Btn to={to('/#start')}>{CTA_LABEL}</Btn>
        </div>
        <ul className="nx-hero__facts" data-r style={{ '--d': '620ms' } as CSSProperties}>
          <li>
            <b>NSE · BSE</b> real-time data
          </li>
          <li>
            <b>65%</b> bar before any call
          </li>
          <li>
            <b>15 min</b> later, every call graded
          </li>
        </ul>
      </div>
      <div className="nx-hero__stage" ref={winRef}>
        <div className="nx-hero__window">
          <Dashboard />
        </div>
      </div>
    </section>
  )
}

/* ============================================================= marquee == */

const covered = ['NIFTY 50', 'BANKNIFTY', 'FINNIFTY', 'SENSEX', 'NSE sectors', 'BSE', 'QQQ', 'SPY', 'DIA', 'IWM']

function Marquee() {
  const row = (
    <ul aria-hidden="true">
      {covered.map((c) => (
        <li key={c}>
          <Mark />
          {c}
        </li>
      ))}
    </ul>
  )
  return (
    <section className="nx-marquee" aria-label={`Covers ${covered.join(', ')}`}>
      <p className="nx-marquee__label">What Trahdo covers</p>
      <div className="nx-marquee__track">
        {row}
        {row}
      </div>
    </section>
  )
}

/* =============================================================== story == */

const chapters = [
  {
    n: '01',
    title: 'See what is *moving.*',
    body: 'Live NSE and BSE data, sector moves and alerts that fire on rules you can read: volume above 2.5× its 30-minute average, or a move beyond 1.5% in fifteen minutes.',
  },
  {
    n: '02',
    title: 'Make the *call.*',
    body: 'F&O Advisor weighs breadth, the option chain, technicals and global cues into one number. Only above 65% does it make a call, with an entry, a stop and a target.',
  },
  {
    n: '03',
    title: '*Check* it.',
    body: 'Fifteen minutes later, every call is graded against what happened next. The misses stay in the table, right next to the hits.',
  },
]

function SeePanel() {
  return (
    <div className="nx-panel nx-panel--see">
      <p className="nx-panel__label">Sector moves · sample session</p>
      <div className="nx-heat">
        {SECTORS.map((s, i) => {
          const c = dayMove(s.price)
          const k = Math.min(Math.abs(c) / 2.2, 1)
          return (
            <div
              key={s.name}
              className={`nx-heat__cell ${c >= 0 ? 'is-up' : 'is-down'}`}
              style={{ '--k': k.toFixed(2), '--i': i } as CSSProperties}
            >
              <span>{s.name}</span>
              <b className="nx-num">{fmtPct(c)}</b>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CallPanel() {
  return (
    <div className="nx-panel nx-panel--call">
      <p className="nx-panel__label">F&amp;O Advisor · illustration</p>
      <div className="nx-callcard">
        <div className="nx-callcard__top">
          <span>BANKNIFTY</span>
          <span className="nx-pill nx-pill--up">BUY</span>
        </div>
        <p className="nx-callcard__big nx-num">72%</p>
        <p className="nx-callcard__sub">Move likelihood · next 10–15 min</p>
        <div className="nx-meter" aria-hidden="true">
          <i style={{ '--w': '72%' } as CSSProperties} />
          <b style={{ left: '65%' }}>65% bar</b>
        </div>
        <dl className="nx-callcard__plan nx-num">
          <div>
            <dt>Entry</dt>
            <dd>55,128</dd>
          </div>
          <div>
            <dt>Stop</dt>
            <dd>55,098</dd>
          </div>
          <div>
            <dt>Target</dt>
            <dd>55,184</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function CheckPanel() {
  return (
    <div className="nx-panel nx-panel--check">
      <p className="nx-panel__label">Graded after 15 min · sample rule</p>
      <ul className="nx-ledger nx-num">
        {CALLS.slice(0, 6).map((c, i) => (
          <li key={c.minute} style={{ '--i': i } as CSSProperties}>
            <span>{clockLabel(c.minute)}</span>
            <span className={c.side === 'BUY' ? 'is-up' : 'is-down'}>{c.side}</span>
            <span>{fmtPct(c.best * 100)}</span>
            <span className={`nx-grade ${c.hit ? 'is-hit' : 'is-miss'}`}>{c.hit ? 'Hit' : 'Miss'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const panels = [<SeePanel key="see" />, <CallPanel key="call" />, <CheckPanel key="check" />]

function Story() {
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const onP = useCallback((p: number) => setStep(Math.min(Math.floor(p * 3), 2)), [])
  useProgress(ref, 'pin', onP)

  return (
    <section className="nx-story" ref={ref} aria-label="How Trahdo works: see, call, check">
      <div className="nx-story__stage">
        <div className="nx-wrap nx-story__grid">
          <div className="nx-story__text">
            <p className="nx-story__count nx-num">
              <span>{chapters[step].n}</span> / 03
            </p>
            <div className="nx-story__chapters">
              {chapters.map((c, i) => (
                <article key={c.n} className="nx-story__chapter" data-on={i === step} aria-hidden={i !== step}>
                  <h2 className="nx-display nx-display--lg" dangerouslySetInnerHTML={{ __html: c.title.replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
                  <p className="nx-lede">{c.body}</p>
                </article>
              ))}
            </div>
            <div className="nx-story__bar" aria-hidden="true">
              <i />
            </div>
          </div>
          <div className="nx-story__visual">
            <svg className="nx-ring" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="96" className="nx-ring__track" />
              <circle cx="100" cy="100" r="96" className="nx-ring__fill" pathLength={1} />
            </svg>
            {panels.map((p, i) => (
              <div key={i} className="nx-story__panel" data-on={i === step} aria-hidden={i !== step}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============================================================== bento == */

function Copilot() {
  const text = `${EVENT_ALERT.symbol} volume jumped to ${EVENT_ALERT.value.toFixed(1)}× its 30-minute average at ${clockLabel(EVENT_ALERT.minute)}, and metals moved with it. That is why your watchlist lit up.`
  const ref = useRef<HTMLParagraphElement>(null)
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0))
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 1)), 22)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [text])
  return (
    <div className="nx-chat">
      <p className="nx-chat__q">Why is my watchlist green today?</p>
      <p className="nx-chat__a" ref={ref} aria-label={text}>
        <span aria-hidden="true">{text.slice(0, n)}</span>
        <i aria-hidden="true" />
      </p>
    </div>
  )
}

function Bento() {
  const steel = SERIES.TATASTEEL.price
  return (
    <section className="nx-section nx-bento" aria-labelledby="nx-bento-title">
      <div className="nx-wrap">
        <div className="nx-head nx-head--center">
          <Eyebrow tone="green">Market Intelligence</Eyebrow>
          <Rise id="nx-bento-title" text="The whole market, *on one calm screen.*" className="nx-display nx-display--lg" />
          <p className="nx-lede" data-r>
            One dashboard for live indices, AI-generated briefs and alerts that catch what you would miss. No juggling five tabs
            and five logins.
          </p>
        </div>

        <div className="nx-bento__grid">
          <article className="nx-card nx-card--wide" onPointerMove={spotlight} data-r>
            <div className="nx-card__text">
              <h3>Real-time NSE &amp; BSE data</h3>
              <p>Indices, stocks and sectors streaming in as they move, not after the fact.</p>
            </div>
            <div className="nx-card__chart">
              <div className="nx-card__ticker nx-num">
                <span>TATASTEEL</span>
                <b className="is-up">{fmtPct(dayMove(steel))}</b>
                <span className="nx-tag">Sample</span>
              </div>
              <Line values={steel} w={700} h={180} area className="is-up nx-draw" />
            </div>
          </article>

          <article className="nx-card" onPointerMove={spotlight} data-r>
            <div className="nx-card__text">
              <h3>Alerts on rules you can read</h3>
              <p>No black box. Each alert says exactly which rule it tripped.</p>
            </div>
            <div className="nx-stack">
              <div className="nx-stack__item">
                <b>Volume surge</b>
                <span>Above 2.5× the 30-minute average</span>
              </div>
              <div className="nx-stack__item">
                <b>Fast move</b>
                <span>Beyond 1.5% in 15 minutes</span>
              </div>
              <div className="nx-stack__item">
                <b>{EVENT_ALERT.symbol}</b>
                <span>Fired at {clockLabel(EVENT_ALERT.minute)} · sample</span>
              </div>
            </div>
          </article>

          <article className="nx-card" onPointerMove={spotlight} data-r>
            <div className="nx-card__text">
              <h3>An AI copilot that explains why</h3>
              <p>Ask in plain words. Get the reason, not just the number.</p>
            </div>
            <Copilot />
          </article>

          <article className="nx-card" onPointerMove={spotlight} data-r>
            <div className="nx-card__text">
              <h3>Sector heat at a glance</h3>
              <p>See where the money is rotating before the close.</p>
            </div>
            <div className="nx-bars">
              {SECTORS.map((s, i) => {
                const c = dayMove(s.price)
                return (
                  <div key={s.name} className="nx-bars__col">
                    <i className={c >= 0 ? 'is-up' : 'is-down'} style={{ '--h': `${Math.min(Math.abs(c) * 38 + 8, 100)}%`, '--i': i } as CSSProperties} />
                    <span>{s.name}</span>
                  </div>
                )
              })}
            </div>
          </article>

          <article className="nx-card nx-card--ink" onPointerMove={spotlight} data-r>
            <div className="nx-card__text">
              <h3>Read-only by design</h3>
              <p>Market Intelligence cannot place a trade or move a rupee. Insight, with no access to your money.</p>
            </div>
            <div className="nx-lock" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <rect x="9" y="21" width="30" height="21" rx="5" />
                <path d="M15 21v-6a9 9 0 0 1 18 0v6" />
                <circle cx="24" cy="31" r="2.5" />
              </svg>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ============================================================ products == */

function Products() {
  return (
    <section id="products" className="nx-section nx-products" aria-labelledby="nx-products-title">
      <div className="nx-wrap">
        <div className="nx-head">
          <Eyebrow>Two products</Eyebrow>
          <Rise id="nx-products-title" text="Two products. *One session.*" className="nx-display nx-display--lg" />
        </div>
        <div className="nx-products__grid">
          <article className="nx-product nx-product--mi" data-r>
            <header>
              <span className="nx-product__name">
                <Mark /> Market Intelligence
              </span>
              <Live />
            </header>
            <h3 className="nx-display nx-display--md">
              Markets move fast. <em>Stay ahead of the close.</em>
            </h3>
            <p>Real-time NSE/BSE data, smart alerts, and an AI copilot that explains why.</p>
            <div className="nx-product__shot">
              <img src={miShot} width="1600" height="1000" loading="lazy" alt="Trahdo Market Intelligence at dashboard.trahdo.com: live market data, smart alerts and an AI copilot." />
            </div>
            <Btn href={LINKS.marketIntelligence}>Open Market Intelligence</Btn>
          </article>
          <article className="nx-product nx-product--adv" data-r style={{ '--d': '120ms' } as CSSProperties}>
            <header>
              <span className="nx-product__name">
                <Mark /> F&amp;O Advisor
              </span>
              <Live />
            </header>
            <h3 className="nx-display nx-display--md">
              Index calls you can <em>check, before you act.</em>
            </h3>
            <p>Live for NIFTY, BANKNIFTY, FINNIFTY and SENSEX. A call only when the odds clear 65%, graded against what happened next.</p>
            <div className="nx-product__shot">
              <img src={foShot} width="1400" height="746" loading="lazy" alt="F&O Advisor: Index calls you can check, before you act." />
            </div>
            <Btn href={LINKS.foAdvisor} variant="ember">
              Open F&amp;O Advisor
            </Btn>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ============================================================= advisor == */

function Stat({ value, suffix, label, digits = 0 }: { value: number; suffix: string; label: string; digits?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const v = useCountUp(ref, value)
  return (
    <div className="nx-stat" ref={ref} data-r>
      <p className="nx-stat__value nx-num">
        {v.toFixed(digits)}
        <span>{suffix}</span>
      </p>
      <p className="nx-stat__label">{label}</p>
    </div>
  )
}

const steps = [
  { name: 'Watch', img: watch, w: 1100, h: 572, text: 'Four indices stream in with price, change and the current call.' },
  { name: 'Weigh', img: weigh, w: 1100, h: 898, text: 'Breadth, the option chain, technicals, sectors and global cues add up to one number.' },
  { name: 'Call', img: call, w: 1100, h: 546, text: 'Only above 65% does it make a call, with an entry, a stop and a target.' },
  { name: 'Check', img: check, w: 1100, h: 742, text: 'Fifteen minutes later the call is graded. Misses stay in the table.' },
]

const facts = [
  {
    q: 'What does it cover?',
    a: 'Live prices and calls for NIFTY 50, BANKNIFTY, FINNIFTY and SENSEX. Beyond that: NSE sector indices, US index ETFs (QQQ, SPY, DIA, IWM) and US stock baskets.',
  },
  { q: 'How often does it update?', a: 'Prices stream continuously. The analysis runs when you ask for it and looks at the next ten to fifteen minutes.' },
  { q: 'Does it place trades?', a: 'No. It shows calls and trade plans. If you act on one, you place the trade yourself, somewhere else.' },
  { q: 'How do I get an account?', a: 'Accounts are created from inside the app by someone who already has one.' },
]

function Advisor() {
  const railRef = useRef<HTMLElement>(null)
  useProgress(railRef, 'pin')

  return (
    <section id="advisor" className="nx-night" aria-labelledby="nx-adv-title">
      <div className="nx-section nx-wrap">
        <div className="nx-head">
          <Eyebrow tone="ember">F&amp;O Advisor · live</Eyebrow>
          <Rise id="nx-adv-title" text="Index calls you can check, *before you act.*" className="nx-display nx-display--lg" />
          <p className="nx-lede" data-r>
            F&amp;O Advisor reads the index through the session, makes a call only when the odds clear 65%, and grades every
            call against what happened next.
          </p>
        </div>
        <div className="nx-stats">
          <Stat value={65} suffix="%" label="The bar a call has to clear before it is made at all." />
          <Stat value={15} suffix=" min" label="After every call, it is graded against what actually happened." />
          <Stat value={4} suffix=" indices" label="NIFTY 50, BANKNIFTY, FINNIFTY and SENSEX, live." />
        </div>
      </div>

      <section className="nx-rail" ref={railRef} aria-label="How a call is made">
        <div className="nx-rail__stage">
          <div className="nx-wrap nx-rail__head">
            <p className="nx-rail__title">How a call is made</p>
            <div className="nx-rail__dots" aria-hidden="true">
              {steps.map((s) => (
                <i key={s.name} />
              ))}
            </div>
          </div>
          <ol className="nx-rail__track">
            {steps.map((s, i) => (
              <li key={s.name} className="nx-step">
                <div className="nx-step__text">
                  <span className="nx-num">0{i + 1}</span>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                </div>
                <div className="nx-step__img">
                  <img src={s.img} width={s.w} height={s.h} loading="lazy" alt={`F&O Advisor ${s.name} screen, sample data.`} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="nx-section nx-wrap nx-faq">
        <div className="nx-faq__head">
          <Rise text="Straight *answers.*" className="nx-display nx-display--md" />
          <Btn href={LINKS.foAdvisor} variant="ember">
            Open F&amp;O Advisor
          </Btn>
        </div>
        <div className="nx-faq__list">
          {facts.map((f, i) => (
            <details key={f.q} className="nx-faq__item" open={i === 0} data-r>
              <summary>
                {f.q}
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p className="nx-fine">
            F&amp;O Advisor is an analysis tool for education, not investment advice. Calls can be wrong. Trading derivatives can
            lose you more than you put in. Screens shown with sample data.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================= beliefs == */

function Belief() {
  const quoteRef = useRef<HTMLDivElement>(null)
  useProgress(quoteRef, 'pass')
  const words = teamNote.lead.split(' ')

  return (
    <section className="nx-section nx-belief" aria-labelledby="nx-belief-title">
      <div className="nx-wrap">
        <div className="nx-scrub" ref={quoteRef}>
          <p className="nx-scrub__mark" aria-hidden="true">
            “
          </p>
          <h2 id="nx-belief-title" className="nx-display nx-display--lg">
            {words.map((w, i) => (
              <span key={i} style={{ '--t': (i / words.length).toFixed(3) } as CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </h2>
          <p className="nx-scrub__by">The Trahdo team</p>
        </div>

        <div className="nx-principles">
          <div className="nx-principles__aside">
            <Eyebrow>What we believe</Eyebrow>
            <Btn to={to('/about')} variant="ghost">
              Read our story
            </Btn>
          </div>
          <ol>
            {principles.map((p, i) => (
              <li key={p.title} data-r>
                <span className="nx-num">0{i + 1}</span>
                <h3 className="nx-display nx-display--sm">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ================================================================= cta == */

function Start() {
  const ref = useRef<HTMLElement>(null)
  useProgress(ref, 'enter')
  return (
    <section id="start" className="nx-start" ref={ref} aria-labelledby="nx-start-title">
      <Line values={NIFTY} w={1200} h={260} area className="nx-start__line is-ember" />
      <div className="nx-wrap nx-start__inner">
        <p className="nx-start__clock nx-num">15:30 · Market closed</p>
        <Rise id="nx-start-title" text="Tomorrow’s session starts *with you ready.*" className="nx-display nx-display--xl" />
        <p className="nx-lede" data-r>
          Both products are live today. Pick the one you need, or use them together.
        </p>
        <div className="nx-doors">
          <a className="nx-door nx-door--mi" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer" data-r>
            <span className="nx-door__name">
              <Mark /> Market Intelligence
            </span>
            <span className="nx-door__what">See what is moving</span>
            <span className="nx-door__go" aria-hidden="true">
              ↗
            </span>
          </a>
          <a className="nx-door nx-door--adv" href={LINKS.foAdvisor} target="_blank" rel="noopener noreferrer" data-r style={{ '--d': '100ms' } as CSSProperties}>
            <span className="nx-door__name">
              <Mark /> F&amp;O Advisor
            </span>
            <span className="nx-door__what">Make the call. Check it.</span>
            <span className="nx-door__go" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useEffect(() => {
    document.title = 'Trahdo: investing built for the way markets actually move'
  }, [])
  return (
    <main id="main">
      <Hero />
      <Marquee />
      <Story />
      <Bento />
      <Products />
      <Advisor />
      <Belief />
      <Start />
    </main>
  )
}
