import { useRef } from 'react'
import type { FocusEvent } from 'react'
import {
  ALERTS,
  MOMENTUM_THRESHOLD,
  MOMENTUM_WINDOW,
  SECTORS,
  SERIES,
  SESSION_MINUTES,
  STOCKS,
  VOLUME_MULTIPLE,
  VOLUME_WINDOW,
  clockLabel,
  fmtPct,
  linePath,
  pct,
  rangeOf,
} from '../../session/data'
import type { Alert } from '../../session/data'
import { useSessionMinute } from '../../session/clock'
import { LINKS } from '../../lib/links'
import { External } from '../Mark'
import miShot from '../../assets/market-intelligence.webp'

/*
 * Act 4: Trahdo Market Intelligence, as a sideways rail. Pan means breadth: a range of
 * capabilities travelled laterally. The panels are real markup computed from the sample
 * session at the current clock minute, and the page says so on its face.
 */

const W = 400
const H = 96
const [lo, hi] = rangeOf(SERIES.NIFTY.price, 0, SESSION_MINUTES)
const DAY_PATH = linePath(SERIES.NIFTY.price, 0, SESSION_MINUTES, W, H, lo - 0.1, hi + 0.1, 6)

function PanelHead({ title, minute }: { title: string; minute: number }) {
  return (
    <header className="panel__head">
      <h3 className="label">{title}</h3>
      <span className="panel__time mono">
        {clockLabel(minute)}
        <small>Sample</small>
      </span>
    </header>
  )
}

function MarketPanel({ minute }: { minute: number }) {
  const nifty = pct(100, SERIES.NIFTY.price[minute])
  const sectors = SECTORS.map((s) => ({ name: s.name, change: pct(100, s.price[minute]) }))
  const limit = Math.max(1.5, ...sectors.map((s) => Math.abs(s.change)))
  const movers = STOCKS.map((id) => ({ id, change: pct(100, SERIES[id].price[minute]) })).sort(
    (a, b) => b.change - a.change,
  )

  return (
    <article className="panel panel--market">
      <PanelHead title="Live market data" minute={minute} />

      <div className="panel__index">
        <div>
          <span className="panel__big">NIFTY 50</span>
          <span className={`mono panel__delta ${nifty >= 0 ? 'up' : 'down'}`}>{fmtPct(nifty)}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={DAY_PATH} className="panel__ghost" vectorEffect="non-scaling-stroke" />
          <path
            d={DAY_PATH}
            className="panel__live"
            vectorEffect="non-scaling-stroke"
            style={{ clipPath: `inset(0 ${(1 - minute / SESSION_MINUTES) * 100}% 0 0)` }}
          />
        </svg>
      </div>

      <div className="panel__block">
        <h4 className="label">Sectors</h4>
        <ul className="bars" aria-label="Sector moves since the open">
          {sectors.map((s) => (
            <li key={s.name}>
              <span>{s.name}</span>
              <span className="bars__track" aria-hidden="true">
                <i
                  className={s.change >= 0 ? 'bars__up' : 'bars__down'}
                  style={{ transform: `scaleX(${Math.abs(s.change) / limit})` }}
                />
              </span>
              <span className={`mono ${s.change >= 0 ? 'up' : 'down'}`}>{fmtPct(s.change, 1)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel__block">
        <h4 className="label">Top movers</h4>
        <ul className="movers">
          {movers.map((m) => (
            <li key={m.id}>
              <span>{m.id}</span>
              <span className={`mono ${m.change >= 0 ? 'up' : 'down'}`}>{fmtPct(m.change)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function alertText(a: Alert) {
  return a.kind === 'volume'
    ? { kind: 'Volume spike', detail: `${a.value.toFixed(1)}x the ${VOLUME_WINDOW}-minute average` }
    : {
        kind: 'Momentum',
        detail: `${fmtPct(a.value * 100, 1)} in ${MOMENTUM_WINDOW} minutes`,
      }
}

function AlertsPanel({ minute }: { minute: number }) {
  const fired = ALERTS.filter((a) => a.minute <= minute && a.minute < 130).reverse()

  return (
    <article className="panel panel--alerts">
      <PanelHead title="Smart alerts" minute={minute} />
      <p className="panel__rule">
        The sample runs two rules over five symbols: volume above {VOLUME_MULTIPLE}x the{' '}
        {VOLUME_WINDOW}-minute average, or a move beyond {(MOMENTUM_THRESHOLD * 100).toFixed(1)}% in{' '}
        {MOMENTUM_WINDOW} minutes. An alert exists only if a rule fires.
      </p>
      {fired.length ? (
        <ul className="alerts" aria-live="polite">
          {fired.map((a) => {
            const t = alertText(a)
            return (
              <li key={a.id} className="alerts__row">
                <span className="mono alerts__time">{clockLabel(a.minute)}</span>
                <span className="alerts__sym">{a.symbol}</span>
                <span className="alerts__kind">{t.kind}</span>
                <span className="alerts__detail mono">{t.detail}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="panel__empty">Watching. Nothing has fired yet at {clockLabel(minute)}.</p>
      )}
      <p className="panel__note">
        News clusters, the third alert type in the product, need a live feed and are not part of
        this sample.
      </p>
    </article>
  )
}

function CopilotPanel({ minute }: { minute: number }) {
  const mover = STOCKS.map((id) => ({ id, change: pct(100, SERIES[id].price[minute]) })).sort(
    (a, b) => Math.abs(b.change) - Math.abs(a.change),
  )[0]
  const alert = ALERTS.filter((a) => a.symbol === mover.id && a.minute <= minute).at(-1)
  let line = `${mover.id} is ${fmtPct(mover.change)} since the open.`
  if (alert) {
    const p = SERIES[mover.id].price
    const total = p[minute] - 100
    const after = p[minute] - p[Math.max(alert.minute - 1, 0)]
    const share = total !== 0 ? Math.min(Math.max(after / total, 0), 1) * 100 : 0
    line += ` ${share.toFixed(0)}% of that came after the ${alertText(alert).kind.toLowerCase()} alert at ${clockLabel(alert.minute)}.`
  } else {
    line += ' No alert has fired for it yet.'
  }

  return (
    <article className="panel panel--copilot">
      <PanelHead title="AI Copilot" minute={minute} />
      <p className="panel__quote">Ask why anything moved today and get a sourced, live answer.</p>
      <div className="readout">
        <h4 className="label">Sample read-out, not Copilot output</h4>
        <p>{line}</p>
      </div>
      <p className="panel__note">
        This line is computed from the sample data so you can see the question being asked. In
        the product the copilot answers with sources.
      </p>
    </article>
  )
}

function ProductPanel() {
  return (
    <article className="panel panel--shot">
      <header className="panel__head">
        <h3 className="label">The product</h3>
        <span className="panel__time mono">
          Real screen<small>Sign-in</small>
        </span>
      </header>
      <img
        src={miShot}
        width="1600"
        height="1000"
        loading="lazy"
        alt="Trahdo Market Intelligence sign-in screen. It reads: Markets move fast. Stay ahead of the close. Live market data, Smart Alerts, AI Copilot."
      />
      <a className="textlink" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
        Open Market Intelligence
        <External />
      </a>
    </article>
  )
}

export default function Research() {
  const minute = useSessionMinute()
  const sectionRef = useRef<HTMLElement>(null)

  // Keyboard focus on a panel that is panned off screen: translate the panel's position in the
  // rail into the page scroll that brings it to the middle. (The stage clips its overflow, so
  // the browser's own focus-scrolling cannot reach it. Under reduced motion the rail is a
  // native scroll region and the browser handles focus itself.)
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = sectionRef.current
    const rail = section?.querySelector<HTMLElement>('.research__rail')
    const item = (e.target as HTMLElement).closest<HTMLElement>('.research__lead, .panel')
    if (!section || !rail || !item) return
    const r = item.getBoundingClientRect()
    if (r.left >= 0 && r.right <= window.innerWidth) return
    const vw = window.innerWidth
    const over = rail.scrollWidth - vw
    if (over <= 0) return
    const extra = parseFloat(rail.dataset.scPan ?? '0') || 0
    const target = item.offsetLeft + item.offsetWidth / 2 - vw / 2
    const p = Math.min(Math.max(target / (over * (1 + extra)), 0), 1)
    const top = section.getBoundingClientRect().top + window.scrollY
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
    window.scrollTo({ top: top + p * travel, behavior: 'instant' })
  }

  return (
    <section
      ref={sectionRef}
      onFocusCapture={onFocus}
      id="research"
      className="act research"
      data-sc-act="pan"
      data-sc-span="3.6"
      data-sc-drift="#121316"
      data-t0="55"
      data-t1="100"
      data-pinned="true"
      aria-labelledby="research-title"
    >
      <div data-sc-stage className="research__stage">
        <div className="research__rail" data-sc-pan="0.05">
          <div className="research__lead">
            <p className="label">Trahdo Market Intelligence</p>
            <h2 id="research-title" className="display display--lg">
              Markets move fast. Stay ahead of the close.
            </h2>
            <p className="body">
              Live indices, smart alerts and a copilot that explains why. The panels beside this
              run on a sample session, not live prices, and follow the clock below as you
              scroll.
            </p>
            <a className="btn btn--mi" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
              Open Market Intelligence
              <External />
            </a>
          </div>
          <MarketPanel minute={minute} />
          <AlertsPanel minute={minute} />
          <CopilotPanel minute={minute} />
          <ProductPanel />
        </div>
      </div>
    </section>
  )
}
