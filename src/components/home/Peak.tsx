import { useCallback, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  EVENT_ALERT,
  ORDER_MINUTE,
  ORDER_PRICE,
  ORDER_QTY,
  SAMPLE_SPREAD,
  SERIES,
  SESSION_MINUTES,
  STARTING_CAPITAL,
  clockLabel,
  fmtINR,
  fmtPct,
  fmtSignedINR,
  linePath,
  pct,
  portfolioValue,
  rangeOf,
} from '../../session/data'
import { useSessionMinute, useSessionTime } from '../../session/clock'

/*
 * Act 6, the peak: ONE MOMENT, THREE VIEWS.
 *
 * Three layers share one time axis (11:00 to the 15:30 bell). A single vertical "now" line
 * sweeps all three as the visitor scrolls. At 11:42 the sample volume spike fires in Market
 * Intelligence; two minutes later a one-click order lands in Trahdo App; from then on the
 * portfolio layer is the result. The line, the order and the P&L are computed from the same
 * seeded arrays the rest of the page uses.
 *
 * The cursor and the reveal are driven from the clock via a CSS variable (--s), so scrolling
 * never re-renders this component; text readouts re-render once per session minute.
 */

const T0 = 105
const T1 = SESSION_MINUTES
const SPAN = T1 - T0
const W = 1000
const H = 100

const price = SERIES.TATASTEEL.price
const volume = SERIES.TATASTEEL.volume
const [lo, hi] = rangeOf(price, T0, T1)
const yLo = Math.min(lo, ORDER_PRICE) - 0.25
const yHi = hi + 0.25
const yOf = (p: number) => 8 + (1 - (p - yLo) / (yHi - yLo)) * (H - 16)
const xOf = (m: number) => ((m - T0) / SPAN) * W
const pctX = (m: number) => `${((m - T0) / SPAN) * 100}%`

const PRICE_PATH = linePath(price, T0, T1, W, H, yLo, yHi, 8)

const VOLUME_PATH = (() => {
  const vmax = Math.max(...volume.slice(T0, T1 + 1))
  let d = ''
  for (let i = T0; i <= T1; i++) {
    d += `M${xOf(i).toFixed(1)} ${H} V${(H - (volume[i] / vmax) * 30).toFixed(1)}`
  }
  return d
})()

const AREA_PATH = (() => {
  let d = `M${xOf(ORDER_MINUTE).toFixed(1)} ${yOf(ORDER_PRICE).toFixed(1)}`
  for (let i = ORDER_MINUTE; i <= T1; i++) d += `L${xOf(i).toFixed(1)} ${yOf(price[i]).toFixed(1)}`
  d += `L${xOf(T1).toFixed(1)} ${yOf(ORDER_PRICE).toFixed(1)}Z`
  return d
})()
const FILL_LINE = `M${xOf(ORDER_MINUTE).toFixed(1)} ${yOf(ORDER_PRICE).toFixed(1)}H${W}`

const pvSeries = Array.from({ length: SESSION_MINUTES + 1 }, (_, m) => portfolioValue(m))
const [, pvHi] = rangeOf(pvSeries, T0, T1)
const PV_PATH = linePath(pvSeries, T0, T1, W, H, STARTING_CAPITAL - 260, pvHi + 160, 8)
const pvY = (v: number) => 8 + (1 - (v - (STARTING_CAPITAL - 260)) / (pvHi + 160 - (STARTING_CAPITAL - 260))) * (H - 16)
const BASE_LINE = `M0 ${pvY(STARTING_CAPITAL).toFixed(1)}H${W}`

const AXIS = [11, 12, 13, 14, 15].map((h) => ({ label: `${h}:00`, minute: h * 60 - (9 * 60 + 15) }))

type Layer = 'research' | 'trade' | 'track'

function Plot({ layer, children, ghost, live, marker }: {
  layer: Layer
  children?: ReactNode
  ghost: ReactNode
  live: ReactNode
  marker?: { minute: number; y: number; on: boolean }
}) {
  return (
    <div className={`peak__plot peak__plot--${layer}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <g className="peak__ghost">{ghost}</g>
      </svg>
      <div className="peak__live">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          {live}
        </svg>
      </div>
      {marker ? (
        <i
          className="peak__dot"
          data-on={marker.on}
          style={{ left: pctX(marker.minute), top: `${marker.y}%` } as CSSProperties}
        />
      ) : null}
      <span className="peak__rowcursor" aria-hidden="true" />
      <span
        className="peak__rowmoment"
        data-on={marker?.on ?? false}
        style={{ left: pctX(EVENT_ALERT.minute) } as CSSProperties}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export default function Peak() {
  const stageRef = useRef<HTMLDivElement>(null)
  const minute = useSessionMinute()

  const onTime = useCallback((t: number) => {
    const s = Math.min(Math.max((t - T0) / SPAN, 0), 1)
    stageRef.current?.style.setProperty('--s', s.toFixed(4))
  }, [])
  useSessionTime(onTime)

  const m = Math.min(Math.max(minute, T0), T1)
  const alertOn = minute >= EVENT_ALERT.minute
  const orderOn = minute >= ORDER_MINUTE
  const closed = minute >= T1 - 1

  const px = price[m]
  const stockChange = pct(100, px)
  const pv = portfolioValue(m)
  const pnl = pv - STARTING_CAPITAL
  const bid = Math.round(px * 100) / 100
  const ask = Math.round((px + SAMPLE_SPREAD) * 100) / 100

  return (
    <section
      id="session"
      className="act peak"
      data-sc-act="pin"
      data-sc-span="5.2"
      data-sc-drift="#0a0a0b"
      data-t0={T0}
      data-t1={T1}
      data-q0="0.07"
      data-q1="0.9"
      data-pinned="true"
      aria-labelledby="peak-title"
    >
      <div
        data-sc-stage
        ref={stageRef}
        className="peak__stage"
        data-sc-verify-state={`${minute}`}
        data-sc-verify-hold={closed ? 'true' : undefined}
      >
        <div className="peak__top">
          <div>
            <h2 id="peak-title" className="display display--md">
              The same minute, as an alert, an order and a result.
            </h2>
          </div>
          <div className="peak__clock" aria-live="off">
            <span className="mono">{clockLabel(m)}</span>
            <small className="label">{closed ? 'Market closed' : 'Sample session'}</small>
          </div>
        </div>

        <div className="peak__grid">
          {/* Research */}
          <div className="peak__row peak__row--1">
          <div className="peak__lab">
            <h3 className="display display--sm">Research</h3>
            <p className="label">Market Intelligence</p>
            <span className="peak__cap">A rule fires on the volume.</span>
          </div>
          <Plot
            layer="research"
            marker={{ minute: EVENT_ALERT.minute, y: (yOf(price[EVENT_ALERT.minute]) / H) * 100, on: alertOn }}
            ghost={
              <>
                <path d={VOLUME_PATH} className="peak__vol" vectorEffect="non-scaling-stroke" />
                <path d={PRICE_PATH} className="peak__line" vectorEffect="non-scaling-stroke" />
              </>
            }
            live={
              <>
                <path d={VOLUME_PATH} className="peak__vol peak__vol--on" vectorEffect="non-scaling-stroke" />
                <path d={PRICE_PATH} className="peak__line peak__line--mi" vectorEffect="non-scaling-stroke" />
              </>
            }
          >
            <span className="peak__pill peak__pill--mi" data-on={alertOn} style={{ left: pctX(EVENT_ALERT.minute) }}>
              {clockLabel(EVENT_ALERT.minute)} · Volume spike {EVENT_ALERT.value.toFixed(1)}x
            </span>
          </Plot>
          <div className="peak__read mono">
            <span className="peak__sym">TATASTEEL</span>
            <strong>{px.toFixed(2)}</strong>
            <span className={stockChange >= 0 ? 'up' : 'down'}>{fmtPct(stockChange)}</span>
          </div>
          </div>

          {/* Trade */}
          <div className="peak__row peak__row--2">
          <div className="peak__lab">
            <h3 className="display display--sm">Trade</h3>
            <p className="label">Trahdo App</p>
            <span className="peak__cap">One click, spread on screen.</span>
          </div>
          <Plot
            layer="trade"
            marker={{ minute: ORDER_MINUTE, y: (yOf(ORDER_PRICE) / H) * 100, on: orderOn }}
            ghost={<path d={PRICE_PATH} className="peak__line" vectorEffect="non-scaling-stroke" />}
            live={
              <>
                <path d={PRICE_PATH} className="peak__line peak__line--app" vectorEffect="non-scaling-stroke" />
                <path d={AREA_PATH} className="peak__area" />
                <path d={FILL_LINE} className="peak__fill" vectorEffect="non-scaling-stroke" />
              </>
            }
          >
            <span className="peak__pill peak__pill--app" data-on={orderOn} style={{ left: pctX(ORDER_MINUTE) }}>
              {clockLabel(ORDER_MINUTE)} · Bought {ORDER_QTY} at {ORDER_PRICE.toFixed(2)}
            </span>
          </Plot>
          <div className="peak__read mono">
            <span className="peak__sym">Bid / ask</span>
            <strong>
              {bid.toFixed(2)} / {ask.toFixed(2)}
            </strong>
            <span>Spread {SAMPLE_SPREAD.toFixed(2)}</span>
          </div>
          </div>

          {/* Track */}
          <div className="peak__row peak__row--3">
          <div className="peak__lab">
            <h3 className="display display--sm">Track</h3>
            <p className="label">Your portfolio</p>
            <span className="peak__cap">What it did, from the fill.</span>
          </div>
          <Plot
            layer="track"
            marker={{ minute: ORDER_MINUTE, y: (pvY(STARTING_CAPITAL) / H) * 100, on: orderOn }}
            ghost={
              <>
                <path d={BASE_LINE} className="peak__base" vectorEffect="non-scaling-stroke" />
                <path d={PV_PATH} className="peak__line" vectorEffect="non-scaling-stroke" />
              </>
            }
            live={
              <>
                <path d={BASE_LINE} className="peak__base peak__base--on" vectorEffect="non-scaling-stroke" />
                <path d={PV_PATH} className="peak__line peak__line--pv" vectorEffect="non-scaling-stroke" />
              </>
            }
          >
            <span className="peak__pill peak__pill--pv" data-on={orderOn} style={{ left: pctX(ORDER_MINUTE) }}>
              P&amp;L from {clockLabel(ORDER_MINUTE)}
            </span>
          </Plot>
          <div className="peak__read mono">
            <span className="peak__sym">Portfolio</span>
            <strong>{fmtINR(pv)}</strong>
            <span className={pnl > 0 ? 'up' : pnl < 0 ? 'down' : ''}>
              {orderOn ? `${fmtSignedINR(pnl)} · ${fmtPct((pnl / STARTING_CAPITAL) * 100)}` : 'Waiting for a fill'}
            </span>
          </div>
          </div>

          {/* One cursor across all three layers (desktop). */}
          <div className="peak__over" aria-hidden="true">
            <span className="peak__moment" data-on={alertOn} style={{ left: pctX(EVENT_ALERT.minute) }} />
            <span className="peak__cursor" />
          </div>
        </div>

        <div className="peak__axis" aria-hidden="true">
          {AXIS.map((a) => (
            <span key={a.label} className="mono" style={{ left: pctX(a.minute) }}>
              {a.label}
            </span>
          ))}
          <span className="mono peak__bell" style={{ left: '100%' }}>
            15:30
          </span>
        </div>

        <p className="peak__note">
          Synthetic session, prices rebased to 100 at the open. A sample order of {ORDER_QTY} units
          on {fmtINR(STARTING_CAPITAL)}, no fees modelled. Not live prices, not advice.
        </p>
      </div>
    </section>
  )
}
