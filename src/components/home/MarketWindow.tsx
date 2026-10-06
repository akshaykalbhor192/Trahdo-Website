import {
  ALERTS,
  SECTORS,
  SERIES,
  STOCKS,
  clockLabel,
  fmtPct,
  linePath,
  pct,
  rangeOf,
} from '../../session/data'
import type { Alert } from '../../session/data'
import { Mark } from '../Mark'

/*
 * The hero's centrepiece: a Market Intelligence style window, computed from the sample
 * session at the current clock minute. Nothing in it is a picture: the chart is the index
 * series, the watchlist and heat map read the same arrays, and the alert toast appears only
 * when the page's own volume rule fires. It says on its face that it is a sample.
 */
const VIEW = 60 // minutes of the session the chart frames
const W = 600
const H = 190
const [lo, hi] = rangeOf(SERIES.NIFTY.price, 0, VIEW)
const PAD = 0.06
const yLo = lo - PAD
const yHi = hi + PAD
const LINE = linePath(SERIES.NIFTY.price, 0, VIEW, W, H, yLo, yHi, 14)
const AREA = `${LINE}L${W} ${H}L0 ${H}Z`
const yAt = (m: number) => 14 + (1 - (SERIES.NIFTY.price[m] - yLo) / (yHi - yLo)) * (H - 28)
const TIMES = [0, 15, 30, 45, 60]

function Spark({ symbol, minute }: { symbol: (typeof STOCKS)[number]; minute: number }) {
  const from = Math.max(0, minute - 30)
  const to = Math.max(minute, from + 2)
  const values = SERIES[symbol].price
  const [a, b] = rangeOf(values, from, to)
  const d = linePath(values, from, to, 64, 20, a - 0.02, b + 0.02, 2)
  return (
    <svg viewBox="0 0 64 20" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function MarketWindow({ minute }: { minute: number }) {
  const m = Math.min(Math.max(minute, 0), VIEW)
  const index = SERIES.NIFTY.price[m]
  const change = pct(100, index)
  const sectors = SECTORS.map((s) => ({ name: s.name, change: pct(100, s.price[m]) }))
  const limit = Math.max(1, ...sectors.map((s) => Math.abs(s.change)))
  const fired = ALERTS.filter((a) => a.minute <= m && a.minute <= VIEW)
  const toast: Alert | undefined = fired.at(-1)
  const flagged = new Set(fired.map((a) => a.symbol))

  return (
    <div
      className="win"
      role="img"
      aria-label="Illustrative sample of the Market Intelligence dashboard: the NIFTY 50 chart, a watchlist and a sector heat map, computed from a sample trading session. Not live prices."
    >
      <div className="win__bar" aria-hidden="true">
        <span className="win__brand">
          <Mark />
          Market Intelligence
        </span>
        <span className="win__clock mono">{clockLabel(m)} IST</span>
        <span className="win__tag mono">Sample session</span>
      </div>

      <div className="win__body" aria-hidden="true">
        <aside className="win__list">
          <h3 className="label">Watchlist</h3>
          <ul>
            {STOCKS.map((id) => {
              const c = pct(100, SERIES[id].price[m])
              return (
                <li key={id} data-flag={flagged.has(id)}>
                  <span className="win__sym">
                    {flagged.has(id) ? <i /> : null}
                    {id}
                  </span>
                  <Spark symbol={id} minute={m} />
                  <span className={`mono ${c >= 0 ? 'up' : 'down'}`}>{fmtPct(c)}</span>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="win__main">
          <div className="win__head">
            <div>
              <span className="label">NIFTY 50</span>
              <strong className="win__value mono">{index.toFixed(2)}</strong>
            </div>
            <span className={`win__delta mono ${change >= 0 ? 'up' : 'down'}`}>
              {change >= 0 ? '▲' : '▼'} {fmtPct(change).replace(/^[+-]/, '')}
            </span>
          </div>

          <div className="win__chart">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="win-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--mi-accent)" stopOpacity="0.28" />
                  <stop offset="1" stopColor="var(--mi-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="win__grid" vectorEffect="non-scaling-stroke" />
              ))}
              <g style={{ clipPath: `inset(0 ${(1 - m / VIEW) * 100}% 0 0)` }}>
                <path d={AREA} fill="url(#win-fill)" />
                <path d={LINE} className="win__line" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>
            <i className="win__dot" style={{ left: `${(m / VIEW) * 100}%`, top: `${(yAt(m) / H) * 100}%` }} />
            {toast ? (
              <div className="win__toast" key={toast.id}>
                <span className="win__bolt" />
                <div>
                  <strong>
                    {toast.symbol} · {toast.kind === 'volume' ? 'Volume spike' : 'Momentum'}
                  </strong>
                  <span className="mono">
                    {clockLabel(toast.minute)} ·{' '}
                    {toast.kind === 'volume' ? `${toast.value.toFixed(1)}x the 30-minute average` : `${fmtPct(toast.value * 100, 1)} in 15 minutes`}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <div className="win__axis mono">
            {TIMES.map((t) => (
              <span key={t}>{clockLabel(t)}</span>
            ))}
          </div>

          <ul className="win__heat">
            {sectors.map((s) => {
              const a = Math.min(Math.abs(s.change) / limit, 1)
              return (
                <li
                  key={s.name}
                  style={{
                    backgroundColor: `color-mix(in oklab, ${s.change >= 0 ? 'var(--up)' : 'var(--down)'} ${(10 + a * 34).toFixed(0)}%, transparent)`,
                  }}
                >
                  <span>{s.name}</span>
                  <b className="mono">{fmtPct(s.change, 1)}</b>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
