/*
 * The Session: one synthetic NSE-hours trading day (09:15 to 15:30 IST, 375 minutes).
 *
 * Everything the home page draws (hero line, session rail, research panels, ladder, the
 * three-layer peak) is computed from these arrays. The data is generated from fixed seeds,
 * so it is identical on every load. It is a SAMPLE: it does not track any real price, and
 * every surface that shows it says so. Prices are rebased to 100.00 at the open.
 */

export const OPEN_MINUTE = 9 * 60 + 15 // 09:15
export const SESSION_MINUTES = 375 // 09:15 to 15:30
export const STARTING_CAPITAL = 100_000

export type SymbolId = 'NIFTY' | 'TATASTEEL' | 'INFY' | 'HDFCBANK' | 'RELIANCE' | 'ICICIBANK'

export interface Series {
  id: SymbolId
  name: string
  price: number[] // length SESSION_MINUTES + 1, rebased to 100 at minute 0
  volume: number[] // relative volume, 1 = typical minute
}

export interface Alert {
  id: string
  symbol: SymbolId
  minute: number
  kind: 'volume' | 'momentum'
  /** The measured quantity: volume multiple for 'volume', fractional return for 'momentum'. */
  value: number
}

// ---------------------------------------------------------------- generation

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

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9)
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export interface Burst {
  from: number
  length: number
  /** Total fractional price change spread over the burst. */
  move: number
  /** Volume multiple at the first minute of the burst, easing back to 1. */
  volume: number
}

export interface Spec {
  id: SymbolId
  name: string
  seed: number
  drift: number // per-minute fractional drift
  sigma: number // per-minute fractional noise
  bursts?: Burst[]
}

export function generate(spec: Spec): Series {
  const rand = mulberry32(spec.seed)
  const n = SESSION_MINUTES
  const price: number[] = [100]
  const volume: number[] = []

  for (let i = 0; i <= n; i++) {
    // typical minute volume: U-shaped through the day, with noise
    const x = i / n
    const shape = 1.5 - Math.sin(Math.PI * x) * 0.9
    volume.push(Math.max(0.35, shape * (0.82 + rand() * 0.36)))
  }

  for (let i = 1; i <= n; i++) {
    let step = spec.drift + spec.sigma * gaussian(rand)
    for (const b of spec.bursts ?? []) {
      if (i >= b.from && i < b.from + b.length) {
        const k = i - b.from
        const w = 1 - k / b.length
        step += (b.move / b.length) * (0.6 + 0.8 * w)
        if (k < 6) volume[i] *= 1 + (b.volume - 1) * (1 - k / 6)
      }
    }
    price.push(price[i - 1] * (1 + step))
  }

  return { id: spec.id, name: spec.name, price, volume }
}

// The three stories the page tells. Minutes are counted from the 09:15 open.
export const EVENT_MINUTE = 147 // 11:42
const specs: Spec[] = [
  { id: 'NIFTY', name: 'NIFTY 50', seed: 270, drift: 0.000035, sigma: 0.00022 },
  {
    id: 'TATASTEEL',
    name: 'TATASTEEL',
    seed: 21,
    drift: 0.00002,
    sigma: 0.00055,
    bursts: [{ from: EVENT_MINUTE, length: 20, move: 0.024, volume: 3.6 }],
  },
  {
    id: 'INFY',
    name: 'INFY',
    seed: 33,
    drift: 0.00004,
    sigma: 0.0004,
    bursts: [{ from: 82, length: 15, move: 0.018, volume: 1.5 }],
  },
  {
    id: 'HDFCBANK',
    name: 'HDFCBANK',
    seed: 45,
    drift: -0.00001,
    sigma: 0.00035,
    bursts: [{ from: 43, length: 8, move: -0.003, volume: 3.2 }],
  },
  { id: 'RELIANCE', name: 'RELIANCE', seed: 58, drift: 0.00003, sigma: 0.00038 },
  { id: 'ICICIBANK', name: 'ICICIBANK', seed: 69, drift: 0.00002, sigma: 0.00036 },
]

export const SERIES: Record<SymbolId, Series> = Object.fromEntries(
  specs.map((s) => [s.id, generate(s)]),
) as Record<SymbolId, Series>

export const STOCKS: SymbolId[] = ['TATASTEEL', 'INFY', 'HDFCBANK', 'RELIANCE', 'ICICIBANK']

// Sector bars: generic sector names, synthetic moves.
export interface Sector {
  name: string
  price: number[]
}
const sectorSpecs: Spec[] = [
  { id: 'NIFTY', name: 'Banks', seed: 101, drift: 0.00005, sigma: 0.0006 },
  { id: 'NIFTY', name: 'IT', seed: 102, drift: 0.00011, sigma: 0.0006 },
  { id: 'NIFTY', name: 'Energy', seed: 103, drift: 0.00007, sigma: 0.0006 },
  { id: 'NIFTY', name: 'Metals', seed: 104, drift: 0.00013, sigma: 0.0007 },
  { id: 'NIFTY', name: 'Auto', seed: 105, drift: -0.00005, sigma: 0.0006 },
  { id: 'NIFTY', name: 'Pharma', seed: 106, drift: -0.00004, sigma: 0.00055 },
  { id: 'NIFTY', name: 'FMCG', seed: 107, drift: -0.00008, sigma: 0.0005 },
]
export const SECTORS: Sector[] = sectorSpecs.map((s) => ({
  name: s.name,
  price: generate(s).price,
}))

// ----------------------------------------------------------------- detection

export const VOLUME_WINDOW = 30
export const VOLUME_MULTIPLE = 2.5
export const MOMENTUM_WINDOW = 15
export const MOMENTUM_THRESHOLD = 0.015

/**
 * The same two rules Smart Alerts describes (volume spikes, momentum), run over the sample
 * series. Nothing here is hand-placed: an alert exists only if the rule fires.
 */
export function detectAlerts(series: Series): Alert[] {
  const out: Alert[] = []
  let lastVolume = -999
  let lastMomentum = -999

  for (let i = 1; i < series.price.length; i++) {
    if (i >= VOLUME_WINDOW && i - lastVolume > 20) {
      let sum = 0
      for (let k = i - VOLUME_WINDOW; k < i; k++) sum += series.volume[k]
      const avg = sum / VOLUME_WINDOW
      const multiple = series.volume[i] / avg
      if (multiple >= VOLUME_MULTIPLE) {
        out.push({ id: `${series.id}-v-${i}`, symbol: series.id, minute: i, kind: 'volume', value: multiple })
        lastVolume = i
      }
    }
    if (i >= MOMENTUM_WINDOW && i - lastMomentum > 30) {
      const ret = series.price[i] / series.price[i - MOMENTUM_WINDOW] - 1
      if (Math.abs(ret) >= MOMENTUM_THRESHOLD) {
        out.push({ id: `${series.id}-m-${i}`, symbol: series.id, minute: i, kind: 'momentum', value: ret })
        lastMomentum = i
      }
    }
  }
  return out
}

export const ALERTS: Alert[] = STOCKS.flatMap((id) => detectAlerts(SERIES[id])).sort(
  (a, b) => a.minute - b.minute,
)

// ---------------------------------------------------------- the traced moment

/** The first alert on the event stock: the one the peak follows. */
export const EVENT_ALERT: Alert =
  ALERTS.find((a) => a.symbol === 'TATASTEEL' && a.kind === 'volume') ?? ALERTS[0]

export const SAMPLE_SPREAD = 0.03
export const ORDER_QTY = 500
/** One-click order two minutes after the alert, filled at the displayed ask. */
export const ORDER_MINUTE = EVENT_ALERT.minute + 2
export const ORDER_PRICE = SERIES.TATASTEEL.price[ORDER_MINUTE] + SAMPLE_SPREAD / 2

export function portfolioValue(minute: number): number {
  const m = Math.min(Math.max(Math.floor(minute), 0), SESSION_MINUTES)
  if (m < ORDER_MINUTE) return STARTING_CAPITAL
  return STARTING_CAPITAL + ORDER_QTY * (SERIES.TATASTEEL.price[m] - ORDER_PRICE)
}

// ------------------------------------------------------------------- helpers

export function clockLabel(minute: number): string {
  const total = OPEN_MINUTE + Math.floor(minute)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function pct(from: number, to: number): number {
  return (to / from - 1) * 100
}

export function fmtPct(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${Math.abs(value).toFixed(digits)}%`
}

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
export function fmtINR(value: number): string {
  const sign = value < 0 ? '-' : ''
  return `${sign}₹${inr.format(Math.abs(Math.round(value)))}`
}

export function fmtSignedINR(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}₹${inr.format(Math.abs(Math.round(value)))}`
}

export function clampMinute(minute: number): number {
  return Math.min(Math.max(Math.floor(minute), 0), SESSION_MINUTES)
}

/** SVG path for series values over [from, to] minutes, scaled into a w x h box. */
export function linePath(
  values: number[],
  from: number,
  to: number,
  w: number,
  h: number,
  min: number,
  max: number,
  padY = 0,
): string {
  const span = Math.max(max - min, 1e-6)
  const parts: string[] = []
  for (let i = from; i <= to; i++) {
    const x = ((i - from) / (to - from)) * w
    const y = padY + (1 - (values[i] - min) / span) * (h - padY * 2)
    parts.push(`${i === from ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return parts.join('')
}

export function rangeOf(values: number[], from: number, to: number): [number, number] {
  let lo = Infinity
  let hi = -Infinity
  for (let i = from; i <= to; i++) {
    if (values[i] < lo) lo = values[i]
    if (values[i] > hi) hi = values[i]
  }
  return [lo, hi]
}
