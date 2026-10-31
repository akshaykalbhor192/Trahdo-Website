import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LINKS, CTA_LABEL } from '../lib/links'
import { Mark } from '../components/Mark'
import { EVENT_ALERT, SERIES, SESSION_MINUTES, clockLabel, fmtPct, pct } from '../session/data'
import { principles } from '../content'
import { reducedMotion, spotlight, useProgress } from '../v2/motion'
import { FUNNEL, GRADED, HEAT, NIFTY_Y, RING, VOLUME, WATCH } from './field'
import { Btn, Label, Live, Title, to } from './ui'
import miShot from '../assets/market-intelligence.webp'
import foShot from '../assets/fo-front.webp'

const NIFTY = SERIES.NIFTY.price
const niftyMove = pct(NIFTY[0], NIFTY[SESSION_MINUTES])
const at = (minute: number) => `${(minute / SESSION_MINUTES) * 100}%`

/* ================================================================ hero == */

function Hero() {
  const ref = useRef<HTMLElement>(null)
  useProgress(ref, 'pass')

  // The NIFTY readout hangs off the line's end; if the headline reaches that far, drop it below.
  useEffect(() => {
    const hero = ref.current
    const now = hero?.querySelector<HTMLElement>('.q-hero__now')
    const words = hero?.querySelectorAll<HTMLElement>('.q-hero__title .q-hero__m')
    if (!hero || !now || !words) return
    const fit = () => {
      now.style.removeProperty('--drop')
      const n = now.getBoundingClientRect()
      let drop = 0
      for (const w of words) {
        const r = w.getBoundingClientRect()
        if (r.left < n.right + 12 && r.right > n.left - 12 && r.top < n.bottom && r.bottom + 12 > n.top) {
          drop = Math.max(drop, r.bottom + 12 - n.top)
        }
      }
      if (drop) now.style.setProperty('--drop', `${Math.ceil(drop)}px`)
    }
    fit()
    void document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(hero)
    return () => ro.disconnect()
  }, [])

  return (
    <section className="q-hero" ref={ref} aria-labelledby="q-hero-title">
      <div className="q-hero__field" data-scene="line" aria-hidden="true">
        <span className="q-hero__now" style={{ top: `${NIFTY_Y(1) * 100}%` }}>
          <b>NIFTY 50</b>
          <span className="q-up">{fmtPct(niftyMove)}</span>
          <small>15:30 · sample session</small>
        </span>
        <span className="q-hero__open" style={{ top: `${NIFTY_Y(0) * 100}%` }}>
          09:15 · open
        </span>
      </div>

      <div className="q-wrap q-hero__copy">
        <a className="q-pill" href="#intelligence">
          <Live />
          <span>Market Intelligence and F&amp;O Advisor</span>
          <span className="q-pill__go" aria-hidden="true">
            →
          </span>
        </a>
        <h1 id="q-hero-title" className="q-hero__title" aria-label="Clarity at market speed.">
          <span className="q-hero__line" aria-hidden="true">
            {'Clarity at'.split(' ').map((w, i) => (
              <span key={w} className="q-hero__m">
                <span style={{ '--d': `${120 + i * 90}ms` } as CSSProperties}>{w}</span>
              </span>
            ))}
          </span>
          <span className="q-hero__line q-hero__line--em" aria-hidden="true">
            {'market speed.'.split(' ').map((w, i) => (
              <span key={w} className="q-hero__m">
                <span style={{ '--d': `${320 + i * 90}ms`, '--gi': i, '--gn': 2 } as CSSProperties}>{w}</span>
              </span>
            ))}
          </span>
        </h1>
        <p className="q-hero__lede">
          Trahdo reads a loud Indian market for you: live NSE and BSE intelligence that explains every move, and index calls you
          can check before you act.
        </p>
        <div className="q-row q-hero__cta">
          <Btn to={to('/#start')}>{CTA_LABEL}</Btn>
          <Btn to={to('/#intelligence')} variant="ghost">
            See how it works
          </Btn>
        </div>
      </div>

      <div className="q-wrap q-hero__meta" aria-hidden="true">
        <span>NSE · BSE</span>
        <span>NIFTY · BANKNIFTY · FINNIFTY · SENSEX</span>
        <span className="q-hero__scroll">
          Scroll the session <i />
        </span>
      </div>
    </section>
  )
}

/* =========================================================== manifesto == */

const manifesto =
  'Most market screens shout. Ten tickers, five tabs, a dozen alerts nobody explains. Trahdo is built the other way round: see what moved and why, then get a call you can check, with the odds on the table and every miss on the record.'

function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const [calm, setCalm] = useState(false)
  const onP = useCallback((p: number) => setCalm(p > 0.52), [])
  useProgress(ref, 'pin', onP)
  const words = manifesto.split(' ')
  const turn = words.indexOf('Trahdo')
  return (
    <section className="q-manifesto" ref={ref} aria-label="Why Trahdo" style={{ '--n': words.length } as CSSProperties}>
      <div className="q-manifesto__stage">
        <div className="q-manifesto__field" data-scene={calm ? 'line' : 'noise'} aria-hidden="true" />
        <div className="q-wrap">
          <p className="q-manifesto__text">
            {words.map((w, i) => (
              <span key={i} className={i === turn ? 'is-turn is-brand' : i > turn ? 'is-turn' : undefined} style={{ '--i': i } as CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

/* =========================================================== the acts == */

interface Step {
  scene: string
  title: string
  body: string
}

function Act({
  id,
  label,
  title,
  steps,
  numbered = false,
  aside,
  viz,
  tone,
}: {
  id: string
  label: string
  title: string
  steps: Step[]
  numbered?: boolean
  aside: ReactNode
  viz: (step: number) => ReactNode
  tone: 'mi' | 'adv'
}) {
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const onP = useCallback((p: number) => setStep(Math.min(Math.floor(p * steps.length), steps.length - 1)), [steps.length])
  useProgress(ref, 'pin', onP)
  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + ((i + 0.5) / steps.length) * (el.offsetHeight - window.innerHeight), behavior: 'smooth' })
  }
  return (
    <section id={id} className={`q-act q-act--${tone}`} ref={ref} style={{ '--steps': steps.length } as CSSProperties} aria-labelledby={`${id}-title`}>
      <div className="q-act__stage">
        <div className="q-wrap q-act__grid">
          <div className="q-act__copy">
            <Label>{label}</Label>
            <Title id={`${id}-title`} text={title} className="q-h2" />
            <ol className="q-steps">
              {steps.map((s, i) => (
                <li key={s.title} data-on={i === step} data-past={i < step} style={{ '--i': i } as CSSProperties}>
                  <button type="button" onClick={() => jump(i)} aria-current={i === step ? 'step' : undefined}>
                    {numbered ? <span className="q-steps__n">{String(i + 1).padStart(2, '0')}</span> : null}
                    {s.title}
                  </button>
                  <p>{s.body}</p>
                  <i className="q-steps__bar" aria-hidden="true" />
                </li>
              ))}
            </ol>
            <div className="q-act__aside">{aside}</div>
          </div>
          <div className="q-act__viz" data-scene={steps[step].scene} data-step={step}>
            {viz(step)}
            <span className="q-tag q-act__sample">Sample data</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------- market intelligence -- */

const miSteps: Step[] = [
  {
    scene: 'heat',
    title: 'The whole market, one screen',
    body: 'Live NSE and BSE indices, sector heat and top movers, streaming in as they move. Not after the fact.',
  },
  {
    scene: 'volume',
    title: 'Alerts on rules you can read',
    body: 'Volume above 2.5× its 30-minute average, or a move beyond 1.5% in fifteen minutes. Every alert names the rule it tripped.',
  },
  {
    scene: 'orb',
    title: 'Ask why, and get the reason',
    body: 'The AI copilot answers in plain words, from the same data you are looking at.',
  },
]

function Copilot({ on }: { on: boolean }) {
  const text = `${EVENT_ALERT.symbol} volume ran to ${EVENT_ALERT.value.toFixed(1)}× its 30-minute average at ${clockLabel(EVENT_ALERT.minute)}. Metals moved with it, which is why your watchlist turned green after midday.`
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0))
  useEffect(() => {
    if (!on || reducedMotion()) return
    let i = 0
    const id = window.setInterval(() => {
      i += 2
      setN(Math.min(i, text.length))
      if (i >= text.length) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [on, text])
  return (
    <div className="q-chat">
      <p className="q-chat__q">Why did my watchlist turn green after lunch?</p>
      <div className="q-chat__a">
        <span className="q-chat__who">
          <span className="q-logo__mark">
            <Mark />
          </span>
          Copilot
        </span>
        <p aria-label={text}>
          <span aria-hidden="true">{text.slice(0, n)}</span>
          <i aria-hidden="true" />
        </p>
      </div>
    </div>
  )
}

function MiViz(step: number) {
  const { bins, event, size } = VOLUME
  return (
    <>
      <div className="q-ov q-heat" data-on={step === 0}>
        {HEAT.map((t, i) => (
          <div
            key={t.name}
            className="q-heat__tile"
            style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%`, width: `${t.w * 100}%`, height: `${t.h * 100}%`, '--i': i } as CSSProperties}
          >
            <span>{t.name}</span>
            <b className={t.move >= 0 ? 'q-up' : 'q-down'}>{fmtPct(t.move, 1)}</b>
          </div>
        ))}
      </div>
      <div className="q-ov q-vol" data-on={step === 1}>
        <p className="q-vol__name">
          <b>{EVENT_ALERT.symbol}</b> price, then volume in five-minute bars
        </p>
        <div className="q-vol__call" style={{ left: `${((event + 0.5) / bins.length) * 100}%`, top: `${(1 - bins[event] * 0.5) * 100}%` }}>
          <span className="q-vol__chip">
            <i aria-hidden="true">!</i>
            <span>
              <b>
                {clockLabel(EVENT_ALERT.minute)} · Volume {EVENT_ALERT.value.toFixed(1)}×
              </b>
              <small>its 30-minute average</small>
            </span>
          </span>
        </div>
        <ol className="q-vol__axis">
          {[0, 105, 225, 375].map((m) => (
            <li key={m} style={{ left: at(Math.min(m, bins.length * size)) }}>
              {clockLabel(m)}
            </li>
          ))}
        </ol>
      </div>
      <div className="q-ov q-orb" data-on={step === 2}>
        <Copilot on={step === 2} />
      </div>
    </>
  )
}

/* ---------------------------------------------------------- f&o advisor -- */

const advSteps: Step[] = [
  { scene: 'watch', title: 'Watch', body: 'NIFTY 50, BANKNIFTY, FINNIFTY and SENSEX stream in with price, change and the current call.' },
  { scene: 'weigh', title: 'Weigh', body: 'Breadth, the option chain, technicals, sectors and global cues add up to one number.' },
  { scene: 'ring', title: 'Call', body: 'Only above 65% does it make a call, with an entry, a stop and a target.' },
  { scene: 'check', title: 'Check', body: 'Fifteen minutes later the call is graded against what happened. The misses stay in the table.' },
]

function AdvViz(step: number) {
  const hits = GRADED.filter((c) => c.hit).length
  return (
    <>
      <div className="q-ov q-watch" data-on={step === 0}>
        {WATCH.map((w, i) => (
          <div key={w.name} style={{ top: `${(i / 4) * 100}%`, '--i': i } as CSSProperties}>
            <b>{w.name}</b>
            <span className={w.move >= 0 ? 'q-up' : 'q-down'}>{fmtPct(w.move)}</span>
          </div>
        ))}
      </div>
      <div className="q-ov q-weigh" data-on={step === 1}>
        {FUNNEL.inputs.map((name, k) => (
          <span key={name} className="q-weigh__in" style={{ top: `${FUNNEL.srcY(k) * 100}%`, right: `${(1 - FUNNEL.srcX) * 100 + 2}%`, '--i': k } as CSSProperties}>
            {name}
          </span>
        ))}
        <span className="q-weigh__out" style={{ left: `${FUNNEL.sink[0] * 100}%`, top: `${FUNNEL.sink[1] * 100}%` }}>
          One number
        </span>
      </div>
      <div className="q-ov q-ring" data-on={step === 2}>
        <div className="q-ring__core">
          <p className="q-ring__pct">
            {Math.round(RING.value * 100)}
            <span>%</span>
          </p>
          <p className="q-ring__what">Move likelihood</p>
          <p className="q-ring__call">
            BANKNIFTY <span className="q-buy">BUY</span>
          </p>
          <dl className="q-ring__plan">
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
        <span className="q-ring__bar">65% bar</span>
      </div>
      <div className="q-ov q-check" data-on={step === 3}>
        <p className="q-check__sum">
          <b className="q-up">{hits} hit</b> · <b className="q-down">{GRADED.length - hits} missed</b> · graded 15 min later
        </p>
        {GRADED.map((c, i) => (
          <span
            key={c.minute}
            className={`q-check__dot ${c.hit ? 'is-hit' : 'is-miss'}`}
            data-alt={i % 2 === 1}
            style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, '--i': i } as CSSProperties}
          >
            <b>{clockLabel(c.minute)}</b>
            {c.side} · {c.hit ? 'Hit' : 'Miss'}
          </span>
        ))}
      </div>
    </>
  )
}

/* ============================================================ products == */

function ProductCard({
  name,
  title,
  body,
  img,
  w,
  h,
  alt,
  href,
  cta,
  points,
  i,
}: {
  name: string
  title: string
  body: string
  img: string
  w: number
  h: number
  alt: string
  href: string
  cta: string
  points: string[]
  i: number
}) {
  const ref = useRef<HTMLElement>(null)
  useProgress(ref, 'enter')
  return (
    <article className="q-prod" ref={ref} onPointerMove={spotlight} style={{ '--k': i } as CSSProperties}>
      <div className="q-prod__inner">
        <div className="q-prod__text">
          <p className="q-prod__name">
            <span className="q-logo__mark">
              <Mark />
            </span>
            {name}
            <Live />
          </p>
          <Title text={title} as="h3" className="q-h3" />
          <p className="q-prod__body">{body}</p>
          <ul className="q-prod__points">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Btn href={href}>{cta}</Btn>
        </div>
        <figure className="q-prod__shot">
          <img src={img} width={w} height={h} loading="lazy" alt={alt} />
        </figure>
      </div>
    </article>
  )
}

function Products() {
  return (
    <section id="products" className="q-section q-products" aria-labelledby="q-products-title">
      <div className="q-wrap">
        <div className="q-head">
          <Label>Two products, both live</Label>
          <Title id="q-products-title" text="Read the market. *Then make the call.*" className="q-h2" />
        </div>
        <div className="q-prods">
          <ProductCard
            i={0}
            name="Market Intelligence"
            title="Markets move fast. *Stay ahead of the close.*"
            body="One dashboard for live indices, AI-generated briefs, and alerts that catch what you would miss."
            points={['Live NSE and BSE indices', 'Smart alerts on readable rules', 'An AI copilot that explains why']}
            img={miShot}
            w={1600}
            h={1000}
            alt="Trahdo Market Intelligence at dashboard.trahdo.com: live market data, smart alerts and an AI copilot."
            href={LINKS.marketIntelligence}
            cta="Open Market Intelligence"
          />
          <ProductCard
            i={1}
            name="F&O Advisor"
            title="Index calls you can *check, before you act.*"
            body="Live for NIFTY, BANKNIFTY, FINNIFTY and SENSEX. A call only when the odds clear 65%, graded against what happened next."
            points={['Four indices, streaming', 'Entry, stop and target on every call', 'Every call graded, misses kept']}
            img={foShot}
            w={1600}
            h={1000}
            alt="F&O Advisor's front page at fo-advisor.vercel.app: Index calls you can check, before you act."
            href={LINKS.foAdvisor}
            cta="Open F&O Advisor"
          />
        </div>
      </div>
    </section>
  )
}

/* ========================================================== principles == */

function Principles() {
  return (
    <section className="q-section" aria-labelledby="q-pr-title">
      <div className="q-wrap">
        <div className="q-head q-head--split">
          <div>
            <Label>What we believe</Label>
            <Title id="q-pr-title" text="Four promises, *both products.*" className="q-h2" />
          </div>
          <p className="q-lede" data-r>
            The same rules sit behind Market Intelligence and F&amp;O Advisor, from the first line of code to the support inbox.
          </p>
        </div>
        <ul className="q-beliefs">
          {principles.map((p, i) => (
            <li key={p.title} data-r style={{ '--d': `${i * 90}ms` } as CSSProperties}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ================================================================= faq == */

const facts = [
  {
    q: 'What does F&O Advisor cover?',
    a: 'Live prices and calls for NIFTY 50, BANKNIFTY, FINNIFTY and SENSEX. Beyond that: NSE sector indices, US index ETFs (QQQ, SPY, DIA, IWM) and US stock baskets.',
  },
  { q: 'How often does it update?', a: 'Prices stream continuously. The analysis runs when you ask for it and looks at the next ten to fifteen minutes.' },
  { q: 'Does either product place trades?', a: 'No. Market Intelligence is read-only, and F&O Advisor shows calls and trade plans. If you act on one, you place the trade yourself, somewhere else.' },
  { q: 'How do I get an F&O Advisor account?', a: 'Accounts are created from inside the app by someone who already has one.' },
]

function Faq() {
  return (
    <section className="q-section" aria-labelledby="q-faq-title">
      <div className="q-wrap q-faq">
        <div>
          <Label>Questions</Label>
          <Title id="q-faq-title" text="Straight *answers.*" className="q-h2" />
        </div>
        <div className="q-faq__list">
          {facts.map((f, i) => (
            <details key={f.q} open={i === 0} data-r style={{ '--d': `${i * 70}ms` } as CSSProperties}>
              <summary>
                {f.q}
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p className="q-fine" data-r>
            F&amp;O Advisor is an analysis tool for education, not investment advice. Calls can be wrong. Trading derivatives can lose
            you more than you put in.
          </p>
        </div>
      </div>
    </section>
  )
}

/* =============================================================== close == */

function Close() {
  return (
    <section id="start" className="q-close" aria-labelledby="q-close-title">
      <div className="q-close__mark" data-scene="mark" aria-hidden="true" />
      <div className="q-wrap q-close__inner">
        <Label>15:30 · The bell</Label>
        <Title id="q-close-title" text="See the next session *clearly.*" className="q-h1" />
        <p className="q-lede" data-r>
          Both products are live today. Start with the one you need, or use them together from the open to the bell.
        </p>
        <div className="q-row q-row--center" data-r>
          <Btn href={LINKS.marketIntelligence}>Open Market Intelligence</Btn>
          <Btn href={LINKS.foAdvisor} variant="ghost">
            Open F&amp;O Advisor
          </Btn>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useEffect(() => {
    document.title = 'Trahdo: clarity at market speed'
  }, [])
  return (
    <main id="main">
      <Hero />
      <Manifesto />
      <Act
        id="intelligence"
        tone="mi"
        label="Market Intelligence · live"
        title="See what moved, *and why.*"
        steps={miSteps}
        viz={MiViz}
        aside={
          <Btn href={LINKS.marketIntelligence} variant="ghost">
            Open Market Intelligence
          </Btn>
        }
      />
      <Act
        id="advisor"
        tone="adv"
        label="F&O Advisor · live"
        title="Calls with the odds *on the table.*"
        steps={advSteps}
        numbered
        viz={AdvViz}
        aside={
          <>
            <Btn href={LINKS.foAdvisor} variant="ghost">
              Open F&amp;O Advisor
            </Btn>
            <p className="q-fine">Education, not investment advice. Calls can be wrong.</p>
          </>
        }
      />
      <Products />
      <Principles />
      <Faq />
      <Close />
    </main>
  )
}
