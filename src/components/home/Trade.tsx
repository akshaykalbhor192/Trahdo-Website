import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { LINKS } from '../../lib/links'
import { External } from '../Mark'
import emberLight from '../../assets/ember-light.webp'

/*
 * Act 5: Trahdo App. A flow section the visitor operates. A simulated market ticks, the
 * ladder shows the spread before anything is clicked, and Buy / Sell fills at the price on
 * screen. It is a sample market: no real orders, and the page says so.
 */

const LEVELS = 5
const STEP = 0.01
const SPREAD = 0.03
const LOT = 100

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Fill {
  id: number
  side: 'BUY' | 'SELL'
  qty: number
  price: number
}
interface State {
  bid: number
  sizes: number[] // [asks..., bids...] depth per level
  position: number // signed quantity
  avg: number
  fills: Fill[]
  next: number
}

type Action =
  | { type: 'tick'; rand: number; sizes: number[] }
  | { type: 'trade'; side: 'BUY' | 'SELL' }
  | { type: 'flatten' }

const round2 = (v: number) => Math.round(v * 100) / 100
const bidOf = (bid: number) => round2(bid)
const askOf = (bid: number) => round2(bid + SPREAD)
const money = (v: number) => `${v > 0 ? '+' : v < 0 ? '-' : ''}₹${Math.abs(v).toFixed(2)}`

function reducer(s: State, a: Action): State {
  if (a.type === 'tick') {
    const move = Math.round((a.rand - 0.5) * 5) / 100
    return { ...s, bid: round2(Math.max(s.bid + move, 90)), sizes: a.sizes }
  }
  if (a.type === 'trade') {
    const price = a.side === 'BUY' ? askOf(s.bid) : bidOf(s.bid)
    const signed = a.side === 'BUY' ? LOT : -LOT
    const total = s.position + signed
    let avg = s.avg
    if (s.position === 0 || Math.sign(s.position) === Math.sign(signed)) {
      avg = (s.avg * Math.abs(s.position) + price * LOT) / (Math.abs(s.position) + LOT)
    } else if (Math.sign(total) !== Math.sign(s.position) && total !== 0) {
      avg = price
    }
    if (total === 0) avg = 0
    const fill: Fill = { id: s.next, side: a.side, qty: LOT, price }
    return { ...s, position: total, avg, fills: [fill, ...s.fills].slice(0, 3), next: s.next + 1 }
  }
  if (a.type === 'flatten' && s.position !== 0) {
    const side = s.position > 0 ? 'SELL' : 'BUY'
    const price = side === 'SELL' ? bidOf(s.bid) : askOf(s.bid)
    const fill: Fill = { id: s.next, side, qty: Math.abs(s.position), price }
    return { ...s, position: 0, avg: 0, fills: [fill, ...s.fills].slice(0, 3), next: s.next + 1 }
  }
  return s
}

function initialSizes(rand: () => number) {
  return Array.from({ length: LEVELS * 2 }, () => Math.round(200 + rand() * 1800))
}

export default function Trade() {
  const sectionRef = useRef<HTMLElement>(null)
  const rng = useMemo(() => mulberry32(11), [])
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    bid: 100,
    sizes: initialSizes(mulberry32(5)),
    position: 0,
    avg: 0,
    fills: [],
    next: 1,
  }))
  const [live, setLive] = useState(false)

  // Tick only while the section is on screen, and never under reduced motion.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      dispatch({
        type: 'tick',
        rand: rng(),
        sizes: Array.from({ length: LEVELS * 2 }, () => Math.round(200 + rng() * 1800)),
      })
    }, 900)
    return () => window.clearInterval(id)
  }, [live, rng])

  const ask = askOf(state.bid)
  const bid = bidOf(state.bid)
  const asks = Array.from({ length: LEVELS }, (_, k) => ({
    price: round2(ask + (LEVELS - 1 - k) * STEP),
    size: state.sizes[k],
  }))
  const bids = Array.from({ length: LEVELS }, (_, k) => ({
    price: round2(bid - k * STEP),
    size: state.sizes[LEVELS + k],
  }))
  const maxSize = Math.max(...state.sizes)
  const mark = state.position > 0 ? bid : ask
  const pnl = state.position === 0 ? 0 : state.position * (mark - state.avg)

  return (
    <section
      id="trade"
      ref={sectionRef}
      className="act trade"
      data-sc-act="flow"
      data-sc-drift="#0e0a07"
      data-t0="100"
      data-t1="103"
      aria-labelledby="trade-title"
    >
      <img className="trade__light" src={emberLight} width="1540" height="1021" alt="" loading="lazy" />
      <div className="trade__inner">
        <div className="trade__copy" data-sc-in data-sc-stagger="70">
          <p className="label">Trahdo App · Coming soon</p>
          <h2 id="trade-title" className="display display--lg">
            A terminal built for speed.
          </h2>
          <p className="lede">
            Trahdo App is where you buy and sell. Watch the live market, see the price and the spread,
            and place your order in one click.
          </p>

          <ul className="brief">
            <li>
              <b>Live market</b>
              <span>Prices and order depth for the stock in front of you, updating as the market moves.</span>
            </li>
            <li>
              <b>Buy</b>
              <span>One click to buy at the best available price.</span>
            </li>
            <li>
              <b>Sell</b>
              <span>One click to sell, with the spread shown before you click, never hidden in the fill.</span>
            </li>
          </ul>

          <p className="body trade__how">
            Try it. The market in the ticket is simulated: it ticks, the spread moves with it, and your fill is
            the price you saw. No real orders.
          </p>
          {LINKS.appNotify ? (
            <a className="btn btn--primary" href={LINKS.appNotify} target="_blank" rel="noopener noreferrer">
              Get notified
              <External />
            </a>
          ) : (
            <p className="trade__soon label">Launch details coming</p>
          )}
        </div>

        <div className="desk" data-sc-in role="group" aria-label="Sample order ticket and order book">
          <header className="desk__head">
            <h3 className="label">TATASTEEL · sample</h3>
            <span className="desk__sim label">Simulated market. No real orders.</span>
          </header>

          <div className="ladder" aria-label="Order book, five levels each side">
            <div className="ladder__cols label" aria-hidden="true">
              <span>Price</span>
              <span>Quantity</span>
            </div>
            <p className="ladder__tag ladder__tag--ask label">Asks · sellers</p>
            <ul className="ladder__side ladder__side--ask">
              {asks.map((l) => (
                <li key={`a${l.price.toFixed(2)}`}>
                  <i style={{ transform: `scaleX(${l.size / maxSize})` }} />
                  <span className="mono">{l.price.toFixed(2)}</span>
                  <span className="mono">{l.size.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
            <div className="ladder__spread mono">
              Spread {SPREAD.toFixed(2)} · {((SPREAD / bid) * 100).toFixed(2)}%
            </div>
            <p className="ladder__tag ladder__tag--bid label">Bids · buyers</p>
            <ul className="ladder__side ladder__side--bid">
              {bids.map((l) => (
                <li key={`b${l.price.toFixed(2)}`}>
                  <i style={{ transform: `scaleX(${l.size / maxSize})` }} />
                  <span className="mono">{l.price.toFixed(2)}</span>
                  <span className="mono">{l.size.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ticket">
            <button type="button" className="btn btn--primary ticket__buy" onClick={() => dispatch({ type: 'trade', side: 'BUY' })}>
              Buy {LOT} at <span className="mono">{ask.toFixed(2)}</span>
            </button>
            <button type="button" className="btn btn--ghost ticket__sell" onClick={() => dispatch({ type: 'trade', side: 'SELL' })}>
              Sell {LOT} at <span className="mono">{bid.toFixed(2)}</span>
            </button>
          </div>

          <dl className="position">
            <div>
              <dt className="label">Position</dt>
              <dd className="mono">{state.position === 0 ? 'Flat' : `${state.position > 0 ? '+' : ''}${state.position}`}</dd>
            </div>
            <div>
              <dt className="label">Average</dt>
              <dd className="mono">{state.position === 0 ? '-' : state.avg.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="label">Open P&amp;L</dt>
              <dd className={`mono ${pnl > 0 ? 'up' : pnl < 0 ? 'down' : ''}`}>
                {state.position === 0 ? '-' : money(pnl)}
              </dd>
            </div>
          </dl>

          <div className="fills" aria-live="polite">
            {state.fills.length ? (
              <ul>
                {state.fills.map((f) => (
                  <li key={f.id}>
                    <span className={f.side === 'BUY' ? 'up' : 'down'}>{f.side}</span>
                    <span className="mono">{f.qty}</span>
                    <span className="mono">@ {f.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="fills__empty">No fills yet.</p>
            )}
            {state.position !== 0 ? (
              <button type="button" className="textlink fills__flat" onClick={() => dispatch({ type: 'flatten' })}>
                Close position
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
