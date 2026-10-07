import { useId, useState } from 'react'
import { LINKS } from '../../lib/links'
import { External } from '../Mark'
import { RANGE, SPOT, STRATEGIES, explain, payoff, summarise } from '../../session/payoff'
import type { StrategyId } from '../../session/payoff'

/*
 * Act: F&O Advisor. It explains positions and risk, so the demonstration is the thing itself:
 * pick a strategy and see, in plain language and on a payoff line, what it does at expiry. All
 * numbers are illustrative (spot 100, made-up strikes and premiums, per unit). The maths is real,
 * the figures are not a quote and not advice, and the page says so.
 */
const W = 600
const H = 230
const STEPS = 120
const [x0, x1] = RANGE

export default function Advisor() {
  const [id, setId] = useState<StrategyId>('long-call')
  const [spot, setSpot] = useState(105)
  const sliderId = useId()
  const strategy = STRATEGIES.find((s) => s.id === id) ?? STRATEGIES[0]
  const summary = summarise(strategy.legs)

  const values = Array.from({ length: STEPS + 1 }, (_, i) => {
    const s = x0 + ((x1 - x0) * i) / STEPS
    return { s, v: payoff(strategy.legs, s) }
  })
  const vMax = Math.max(...values.map((p) => p.v), 1)
  const vMin = Math.min(...values.map((p) => p.v), -1)
  const pad = (vMax - vMin) * 0.12
  const top = vMax + pad
  const bottom = vMin - pad
  const X = (s: number) => ((s - x0) / (x1 - x0)) * W
  const Y = (v: number) => ((top - v) / (top - bottom)) * H
  const line = values.map((p, i) => `${i === 0 ? 'M' : 'L'}${X(p.s).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('')
  const y0 = Y(0)
  const area = `${line}L${W} ${y0.toFixed(1)}L0 ${y0.toFixed(1)}Z`
  const at = payoff(strategy.legs, spot)
  const fmt = (v: number) => `${v > 0 ? '+' : v < 0 ? '-' : ''}${Math.abs(v).toFixed(2)}`

  return (
    <section
      id="advisor"
      className="act advisor"
      data-sc-act="flow"
      data-sc-drift="#0c1118"
      data-t0="103"
      data-t1="105"
      aria-labelledby="advisor-title"
    >
      <div className="advisor__inner">
        <div className="advisor__copy" data-sc-in data-sc-stagger="70">
          <p className="label">F&amp;O Advisor · Coming soon</p>
          <h2 id="advisor-title" className="display display--lg">
            Know what a position can do before you take it.
          </h2>
          <p className="lede">
            F&amp;O Advisor explains futures and options positions and their risk in plain language.
          </p>
          <p className="body advisor__how">
            Try it: choose a position and move the expiry price. The figures are illustrative, per unit,
            before costs, and are not a recommendation.
          </p>
          {LINKS.advisorNotify ? (
            <a className="btn btn--adv" href={LINKS.advisorNotify} target="_blank" rel="noopener noreferrer">
              Get notified
              <External />
            </a>
          ) : (
            <p className="advisor__soon label">Launch details coming</p>
          )}
        </div>

        <div className="lab" data-sc-in role="group" aria-label="Illustrative option payoff explainer">
          <header className="lab__head">
            <h3 className="label">Payoff at expiry</h3>
            <span className="label">Illustrative numbers</span>
          </header>

          <div className="lab__picker" role="radiogroup" aria-label="Position">
            {STRATEGIES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={s.id === id}
                className="lab__choice"
                onClick={() => setId(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="lab__chart">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <clipPath id="lab-up">
                  <rect x="0" y="0" width={W} height={y0} />
                </clipPath>
                <clipPath id="lab-down">
                  <rect x="0" y={y0} width={W} height={H - y0} />
                </clipPath>
              </defs>
              <path d={area} className="lab__gain" clipPath="url(#lab-up)" />
              <path d={area} className="lab__loss" clipPath="url(#lab-down)" />
              <line x1="0" x2={W} y1={y0} y2={y0} className="lab__zero" vectorEffect="non-scaling-stroke" />
              <line x1={X(SPOT)} x2={X(SPOT)} y1="0" y2={H} className="lab__spot" vectorEffect="non-scaling-stroke" />
              <path d={line} className="lab__line" vectorEffect="non-scaling-stroke" />
            </svg>
            <i className="lab__marker" style={{ left: `${(X(spot) / W) * 100}%`, top: `${(Y(at) / H) * 100}%` }} />
            <span className="lab__tag mono" style={{ left: `${(X(SPOT) / W) * 100}%` }}>
              Now {SPOT}
            </span>
          </div>

          <div className="lab__slider">
            <label htmlFor={sliderId} className="label">
              Price at expiry
            </label>
            <input
              id={sliderId}
              type="range"
              min={x0}
              max={x1}
              step={0.5}
              value={spot}
              onChange={(e) => setSpot(parseFloat(e.target.value))}
            />
            <output className="mono" htmlFor={sliderId}>
              {spot.toFixed(1)}
            </output>
          </div>

          <dl className="lab__facts">
            <div>
              <dt className="label">At {spot.toFixed(1)}</dt>
              <dd className={`mono ${at > 0 ? 'up' : at < 0 ? 'down' : ''}`}>{fmt(at)}</dd>
            </div>
            <div>
              <dt className="label">Most you can lose</dt>
              <dd className="mono">{summary.maxLoss === null ? 'No limit' : summary.maxLoss.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="label">Most you can make</dt>
              <dd className="mono">{summary.maxProfit === null ? 'No limit' : summary.maxProfit.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="label">Break-even</dt>
              <dd className="mono">{summary.breakevens.map((b) => b.toFixed(2)).join(', ') || '-'}</dd>
            </div>
          </dl>

          <p className="lab__says" aria-live="polite">
            {explain(strategy)}
          </p>
        </div>
      </div>
    </section>
  )
}
