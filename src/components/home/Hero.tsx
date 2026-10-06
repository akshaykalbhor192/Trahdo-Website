import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SECTORS, fmtPct, pct } from '../../session/data'
import { useSessionMinute } from '../../session/clock'
import { LINKS, CTA_LABEL } from '../../lib/links'
import { Arrow, External } from '../Mark'
import MarketWindow from './MarketWindow'
import emberLight from '../../assets/ember-light.webp'

/*
 * Act 1. A calm, centred opening: one claim, one action, and the product itself rising from
 * the bottom of the frame. The window is a live-style sample (see MarketWindow). As the visitor
 * scrolls, the clock runs from 09:15 to 10:00, the window lifts into view, and the first
 * alert of the sample session fires.
 *
 * Depth, back to front: ember glow (slowest), dotted dome, floating sector pills (lean most
 * against the pointer), the copy, the window.
 */
const pills = [
  { sector: 'IT', cls: 'a' },
  { sector: 'Banks', cls: 'b' },
  { sector: 'Metals', cls: 'c' },
  { sector: 'Energy', cls: 'd' },
] as const

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null)
  const minute = useSessionMinute()

  // Pointer lean: far things barely move, near things move more.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let frame = 0
    const loop = () => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el.style.setProperty('--px', cx.toFixed(4))
      el.style.setProperty('--py', cy.toFixed(4))
      frame = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = (e.clientX - r.left) / r.width - 0.5
      ty = (e.clientY - r.top) / r.height - 0.5
      if (!frame) frame = requestAnimationFrame(loop)
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="open"
      className="act hero"
      data-sc-act="pin"
      data-sc-span="1.9"
      data-sc-drift="#0c0b0b"
      data-t0="0"
      data-t1="45"
      data-pinned="true"
      aria-labelledby="hero-title"
    >
      <div data-sc-stage ref={stageRef} className="hero__stage" data-sc-verify-state={`${minute}`}>
        <div className="hero__glow" data-sc-parallax="-1.6" aria-hidden="true">
          <img src={emberLight} width="1540" height="1021" alt="" />
        </div>
        <div className="hero__dots" aria-hidden="true" />

        <div className="hero__pills" aria-hidden="true">
          {pills.map((p) => {
            const s = SECTORS.find((x) => x.name === p.sector)!
            const c = pct(100, s.price[Math.min(minute, 60)])
            return (
              <span key={p.sector} className={`pill pill--${p.cls}`}>
                {p.sector}
                <b className={`mono ${c >= 0 ? 'up' : 'down'}`}>{fmtPct(c, 1)}</b>
              </span>
            )
          })}
        </div>

        <div className="hero__copy">
          <Link className="hero__announce" to="/#products">
            <i aria-hidden="true" />
            Now in early access
            <Arrow size={14} />
          </Link>
          <h1 id="hero-title" className="display display--xl hero__title">
            Investing built for the way markets <em>actually move.</em>
          </h1>
          <p className="lede hero__lede">One place to research, trade and track your portfolio.</p>
          <div className="hero__cta">
            <Link to="/#get-started" className="btn btn--primary btn--lift">
              {CTA_LABEL}
              <Arrow />
            </Link>
            <a className="btn btn--ghost" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
              Open Market Intelligence
              <External />
            </a>
          </div>
        </div>

        <div className="hero__window">
          <MarketWindow minute={minute} />
        </div>
      </div>
    </section>
  )
}
