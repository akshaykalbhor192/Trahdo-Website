import { CALLS, SECTORS, SERIES, SESSION_MINUTES, EVENT_MINUTE, generate, pct, rangeOf } from '../session/data'

/*
 * The Field: one set of a few thousand points of light that becomes every picture on the
 * page. The session line in the hero, the sector heat, the volume spike, the copilot, the
 * four indices, the weighing, the call, the graded calls and finally the Trahdo mark are all
 * the same particles, re-targeted as the visitor scrolls.
 *
 * Layout lives in CSS. Any element with `data-scene="<shape>"` is a box the field can fill;
 * the field reads its rect every frame, weights each box by how close it sits to the middle
 * of the viewport, and steers the particles toward the blend of the nearest two. Changing the
 * attribute (a pinned section stepping on) re-targets the same box, and the particles fly.
 *
 * Every shape is drawn from the sample session in src/session/data.ts, so the pictures are
 * the same numbers the labels print. WebGL points printed like a halftone, no library.
 */

type RGB = readonly [number, number, number]

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]

/* Design 2's colours: ink, warm greys and one ember, green for gains and red for losses. */
export const INK = {
  indigo: hex('#4a463e'),
  violet: hex('#8a7f6e'),
  rose: hex('#d6403a'),
  orange: hex('#e14a12'),
  amber: hex('#ff5a1f'),
  emerald: hex('#0f8a55'),
  ink: hex('#151410'),
  mute: hex('#d6cfc0'),
  track: hex('#c4bba8'),
}

/** The session ramp: ink at the open, warming through bronze to ember at the close. */
const DUSK: RGB[] = [hex('#151410'), hex('#6b4a33'), hex('#e14a12'), hex('#ff5a1f')]
function dusk(k: number, out: number[]) {
  const f = Math.min(Math.max(k, 0), 0.9999) * (DUSK.length - 1)
  const i = Math.floor(f)
  const t = f - i
  const a = DUSK[i]
  const b = DUSK[i + 1]
  out[0] = a[0] + (b[0] - a[0]) * t
  out[1] = a[1] + (b[1] - a[1]) * t
  out[2] = a[2] + (b[2] - a[2]) * t
}

// ------------------------------------------------------------------ shared data

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1)
  return t * t * (3 - 2 * t)
}

/** A series sampled at u in [0, 1], as a y in [pad, 1 - pad] (y grows downward). */
function curve(values: number[], pad = 0.12) {
  const [lo, hi] = rangeOf(values, 0, values.length - 1)
  const span = Math.max(hi - lo, 1e-9)
  const last = values.length - 1
  return (u: number) => {
    const f = Math.min(Math.max(u, 0), 1) * last
    const i = Math.min(Math.floor(f), last - 1)
    const v = values[i] + (values[i + 1] - values[i]) * (f - i)
    return pad + (1 - (v - lo) / span) * (1 - pad * 2)
  }
}

export const NIFTY_Y = curve(SERIES.NIFTY.price, 0.14)

/** The four indices F&O Advisor watches. NIFTY is the page's sample session; the rest are seeded samples too. */
export const WATCH = [
  { name: 'NIFTY 50', price: SERIES.NIFTY.price },
  { name: 'BANKNIFTY', price: generate({ id: 'NIFTY', name: 'BANKNIFTY', seed: 811, drift: 0.00005, sigma: 0.0003 }).price },
  { name: 'FINNIFTY', price: generate({ id: 'NIFTY', name: 'FINNIFTY', seed: 907, drift: -0.00002, sigma: 0.00028 }).price },
  { name: 'SENSEX', price: generate({ id: 'NIFTY', name: 'SENSEX', seed: 276, drift: 0.000035, sigma: 0.00021 }).price },
].map((w) => ({ ...w, move: pct(w.price[0], w.price[SESSION_MINUTES]), y: curve(w.price, 0.2) }))

/** Sector heat as a two-row treemap, biggest movers first. Shared by the particles and the labels. */
export const HEAT = (() => {
  const items = SECTORS.map((s) => ({ name: s.name, move: pct(s.price[0], s.price[SESSION_MINUTES]) })).sort(
    (a, b) => Math.abs(b.move) - Math.abs(a.move),
  )
  const weight = (m: number) => Math.abs(m) + 0.45
  const rows = [items.slice(0, 3), items.slice(3)]
  const totals = rows.map((r) => r.reduce((s, it) => s + weight(it.move), 0))
  const all = totals[0] + totals[1]
  const gap = 0.014
  const out: { name: string; move: number; x: number; y: number; w: number; h: number }[] = []
  let y = 0
  rows.forEach((row, ri) => {
    const h = totals[ri] / all
    let x = 0
    row.forEach((it) => {
      const w = weight(it.move) / totals[ri]
      out.push({ ...it, x: x + gap / 2, y: y + gap / 2, w: w - gap, h: h - gap })
      x += w
    })
    y += h
  })
  return out
})()
const HEAT_MAX = Math.max(...HEAT.map((h) => Math.abs(h.move)))

/** Five-minute volume bars for the event stock, with the 11:42 spike marked. */
export const VOLUME = (() => {
  const v = SERIES.TATASTEEL.volume
  const size = 5
  const bins: number[] = []
  for (let i = 0; i < SESSION_MINUTES; i += size) {
    let s = 0
    for (let k = i; k < i + size; k++) s += v[k]
    bins.push(s / size)
  }
  const max = Math.max(...bins)
  return { bins: bins.map((b) => b / max), event: Math.floor(EVENT_MINUTE / size), size }
})()
const STEEL_Y = curve(SERIES.TATASTEEL.price, 0.08)

/** Graded calls, placed on the NIFTY line at the minute each was made. */
export const GRADED = CALLS.map((c) => {
  const u = c.minute / SESSION_MINUTES
  return { ...c, x: 0.05 + u * 0.9, y: 0.12 + NIFTY_Y(u) * 0.66 }
})

export const FUNNEL = {
  inputs: ['Breadth', 'Option chain', 'Technicals', 'Sectors', 'Global cues'],
  srcX: 0.3,
  sink: [0.9, 0.5] as const,
  srcY: (k: number) => 0.1 + (k / 4) * 0.8,
}

export const RING = { value: 0.72, bar: 0.65, r: 0.42 }

// ----------------------------------------------------------------------- shapes

export interface Buf {
  x: Float32Array
  y: Float32Array
  r: Float32Array
  g: Float32Array
  b: Float32Array
  a: Float32Array
  s: Float32Array
}

const makeBuf = (n: number): Buf => ({
  x: new Float32Array(n),
  y: new Float32Array(n),
  r: new Float32Array(n),
  g: new Float32Array(n),
  b: new Float32Array(n),
  a: new Float32Array(n),
  s: new Float32Array(n),
})

interface Ctx {
  n: number
  t: number
  /** Seconds since this box took this shape. */
  age: number
  /** Box width over height, and its size in px. */
  asp: number
  bw: number
  bh: number
  /** Per-particle uniform randoms, fixed for the life of the page. */
  r1: Float32Array
  r2: Float32Array
  r3: Float32Array
  r4: Float32Array
}

interface Shape {
  /** 'stretch' maps [0,1]² onto the box; 'contain' onto the largest centred square. */
  fit: 'stretch' | 'contain'
  /** Static shapes are computed once per box aspect and cached. */
  still?: boolean
  /** Shimmer, in px, added on top. */
  jitter: number
  fill(o: Buf, c: Ctx): void
}

const tmp = [0, 0, 0]
const set = (o: Buf, i: number, x: number, y: number, col: ArrayLike<number>, a: number, s: number) => {
  o.x[i] = x
  o.y[i] = y
  o.r[i] = col[0]
  o.g[i] = col[1]
  o.b[i] = col[2]
  o.a[i] = a
  o.s[i] = s
}

/** A tiny seeded generator, for shapes that need more randoms than the four per particle. */
function hash(i: number, salt: number) {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 0x632be5ab, 0xc2b2ae35)
  h ^= h >>> 15
  h = Math.imul(h, 0x2c1b3c6d)
  h ^= h >>> 12
  return ((h >>> 0) % 100000) / 100000
}

const shapes: Record<string, Shape> = {
  /** The hero: the NIFTY session as a river of light, indigo at the open to saffron at the close. */
  line: {
    fit: 'stretch',
    jitter: 0,
    fill(o, { n, t, r1, r2, r3, r4 }) {
      for (let i = 0; i < n; i++) {
        const u = (r1[i] + t * 0.008 * (0.6 + r4[i] * 0.8)) % 1
        const y0 = NIFTY_Y(u)
        dusk(u, tmp)
        if (r2[i] < 0.5) {
          set(o, i, u, y0 + (r3[i] - 0.5) * 0.014, tmp, 1, 2.8 + r4[i] * 1.6)
        } else if (r2[i] > 0.985) {
          // the bright head at the close
          const a = r3[i] * Math.PI * 2
          const d = Math.pow(r4[i], 2) * 0.03
          set(o, i, 1 + Math.cos(a) * d * 0.5, NIFTY_Y(1) + Math.sin(a) * d, INK.orange, 1, 3.4)
        } else {
          // the light falling away under the line, on a fixed halftone grid
          const col = (Math.floor(r1[i] * 110) + 0.5) / 110
          const row = Math.floor(Math.pow(r3[i], 1.3) * 18) / 18
          const yc = NIFTY_Y(col)
          dusk(col, tmp)
          const fall = 1 - row
          set(o, i, col, yc + 0.03 + row * (1.06 - yc), tmp, 0.7 * fall ** 1.6 + 0.05, 1.4 + fall * 2.8)
        }
      }
    },
  },

  /** The loud market: two dozen jittering mini-charts scattered across the screen. */
  noise: {
    fit: 'stretch',
    jitter: 0,
    fill(o, { n, t, r1, r2, r3 }) {
      const lines = 24
      const steps = 14
      // a random walk per mini-chart, re-rolled a few times a second so the screen flickers
      const tick = Math.floor(t * 3)
      const table: number[][] = []
      for (let k = 0; k < lines; k++) {
        const row = [0]
        for (let q = 1; q <= steps; q++) row.push(row[q - 1] + hash(k * 97 + q, 4) - 0.5 + (hash(k * 97 + q + tick * 13, 8) - 0.5) * 0.5)
        table.push(row)
      }
      const walk = (k: number, s: number) => table[k][Math.min(s, steps)]
      for (let i = 0; i < n; i++) {
        const k = Math.floor(r1[i] * lines)
        const ox = hash(k, 1) * 0.9 - 0.02
        const oy = hash(k, 2) * 0.86 + 0.07
        const len = 0.1 + hash(k, 3) * 0.14
        const u = r2[i]
        const f = u * steps
        const s = Math.floor(f)
        const a = walk(k, s)
        const b = walk(k, s + 1)
        const v = (a + (b - a) * (f - s)) * 0.034
        const col = hash(k, 6) < 0.45 ? INK.emerald : hash(k, 6) < 0.85 ? INK.rose : INK.violet
        const drift = Math.sin(t * 0.3 + k) * 0.01
        set(o, i, ox + u * len + drift, oy + v + (r3[i] - 0.5) * 0.004, col, 0.26 + hash(k, 7) * 0.3, 2.6 + r3[i] * 1.4)
      }
    },
  },

  /** Sector heat: a treemap of lit tiles, green up, rose down, brighter for bigger moves. */
  heat: {
    fit: 'stretch',
    still: true,
    jitter: 0.6,
    fill(o, { n, asp, bw, bh }) {
      const areas = HEAT.map((h) => h.w * h.h)
      const total = areas.reduce((a, b) => a + b, 0)
      let i = 0
      HEAT.forEach((tile, ti) => {
        const m = ti === HEAT.length - 1 ? n - i : Math.round((areas[ti] / total) * n)
        // a dot grid sized to the tile's real proportions, leaving the label corner clear
        const wpx = tile.w * asp
        const cols = Math.max(2, Math.round(Math.sqrt((m * wpx) / tile.h) * 1.12))
        const rows = Math.max(2, Math.ceil((m * 1.3) / cols))
        const cells: [number, number][] = []
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++) {
            const fx = (c + 0.5) / cols
            const fy = (r + 0.5) / rows
            // keep the label corner (about 112 x 62 px) clear
            if (fx * tile.w * bw < 112 && fy * tile.h * bh < 62) continue
            cells.push([fx, fy])
          }
        const up = tile.move >= 0
        const mag = Math.abs(tile.move) / HEAT_MAX
        for (let k = 0; k < m && i < n; k++, i++) {
          const [fx, fy] = cells[Math.floor((k / m) * cells.length)]
          const fade = 0.55 + 0.45 * (1 - fy)
          set(o, i, tile.x + fx * tile.w, tile.y + fy * tile.h, up ? INK.emerald : INK.rose, (0.42 + mag * 0.58) * fade, 2.8 + mag * 1.4)
        }
      })
    },
  },

  /** The 11:42 volume spike, under the price it moved. */
  volume: {
    fit: 'stretch',
    still: true,
    jitter: 0.5,
    fill(o, { n, r1, r2, r3 }) {
      const { bins, event } = VOLUME
      const lineN = Math.floor(n * 0.2)
      for (let i = 0; i < lineN; i++) {
        const u = r1[i]
        const hot = u * bins.length >= event - 0.5 && u * bins.length <= event + 5
        set(o, i, u, 0.04 + STEEL_Y(u) * 0.34 + (r2[i] - 0.5) * 0.006, hot ? INK.amber : INK.ink, hot ? 0.95 : 0.55, hot ? 3 : 2.2)
      }
      const sum = bins.reduce((a, b) => a + b, 0)
      let i = lineN
      const rest = n - lineN
      bins.forEach((h, bi) => {
        const m = bi === bins.length - 1 ? n - i : Math.round((h / sum) * rest)
        const hot = bi >= event && bi <= event + 3
        const x = (bi + 0.5) / bins.length
        for (let k = 0; k < m && i < n; k++, i++) {
          const f = (k + 0.5) / m
          const y = 1 - f * h * 0.5
          const col = hot ? (bi === event ? INK.amber : INK.orange) : f > 0.7 ? INK.violet : INK.indigo
          set(o, i, x + (r3[i] - 0.5) * (0.55 / bins.length), y, col, hot ? 1 : 0.5 + f * 0.4, hot ? 3.2 : 2.7)
        }
      })
    },
  },

  /** The copilot: a slowly turning sphere of points with one orbit, a mind at work. */
  orb: {
    fit: 'contain',
    jitter: 0,
    fill(o, { n, t, r1, r2 }) {
      const ringN = Math.floor(n * 0.22)
      const sphereN = n - ringN
      const ga = Math.PI * (3 - Math.sqrt(5))
      const spin = t * 0.22
      const tilt = 0.42
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)
      for (let i = 0; i < sphereN; i++) {
        const yy = 1 - (2 * (i + 0.5)) / sphereN
        const rad = Math.sqrt(1 - yy * yy)
        const th = ga * i + spin
        const x = Math.cos(th) * rad
        const z = Math.sin(th) * rad
        const y2 = yy * ct - z * st
        const z2 = yy * st + z * ct
        const depth = (z2 + 1) / 2
        dusk(0.15 + (y2 + 1) * 0.42, tmp)
        set(o, i, 0.5 + x * 0.34, 0.5 + y2 * 0.34, tmp, 0.12 + depth * 0.75, 1.6 + depth * 2.4)
      }
      for (let i = sphereN; i < n; i++) {
        const a = r1[i] * Math.PI * 2 + t * 0.5
        const ex = Math.cos(a) * 0.47
        const ey = Math.sin(a) * 0.1
        const rot = -0.32
        const front = Math.sin(a) > 0
        set(
          o,
          i,
          0.5 + ex * Math.cos(rot) - ey * Math.sin(rot),
          0.5 + ex * Math.sin(rot) + ey * Math.cos(rot) + (r2[i] - 0.5) * 0.006,
          INK.amber,
          front ? 0.9 : 0.25,
          front ? 2.8 : 1.8,
        )
      }
    },
  },

  /** F&O Advisor, watch: four index lines, one per row, flowing. */
  watch: {
    fit: 'stretch',
    jitter: 0,
    fill(o, { n, t, r1, r2, r3, r4 }) {
      for (let i = 0; i < n; i++) {
        const k = Math.floor(r2[i] * 4)
        const w = WATCH[k]
        const u = (r1[i] + t * 0.01) % 1
        const top = k / 4
        const y = top + 0.03 + w.y(u) * 0.19
        const base = r3[i] < 0.18
        if (r3[i] > 0.97) {
          // a bright head where each index stands now
          const a = r1[i] * Math.PI * 2
          const d = Math.sqrt(r4[i]) * 0.012
          set(o, i, 1 + Math.cos(a) * d * 0.4, top + 0.03 + w.y(1) * 0.19 + Math.sin(a) * d * 1.6, INK.ink, 1, 3.2)
          continue
        }
        if (base) {
          set(o, i, 0.3 + u * 0.7, top + 0.235, INK.mute, 0.35, 1.6)
        } else {
          set(o, i, 0.3 + u * 0.7, y + (r3[i] - 0.5) * 0.008, w.move >= 0 ? INK.emerald : INK.rose, 0.4 + u * 0.55, 2.2 + u * 1.2)
        }
      }
    },
  },

  /** F&O Advisor, weigh: five inputs stream into one point. */
  weigh: {
    fit: 'stretch',
    jitter: 0,
    fill(o, { n, t, r1, r2, r3, r4 }) {
      const cols = [INK.indigo, INK.violet, INK.rose, INK.orange, INK.emerald]
      const [sx, sy] = FUNNEL.sink
      for (let i = 0; i < n; i++) {
        if (r4[i] > 0.92) {
          const a = r1[i] * Math.PI * 2
          const d = Math.pow(r2[i], 1.8) * 0.06
          set(o, i, sx + Math.cos(a) * d * 0.5, sy + Math.sin(a) * d, r3[i] > 0.5 ? INK.ink : INK.amber, 0.9, 3)
          continue
        }
        if (r4[i] > 0.88) {
          // the five inputs, each a small lit node
          const k = Math.floor(r1[i] * 5)
          const a = r2[i] * Math.PI * 2
          const d = Math.sqrt(r3[i]) * 0.012
          set(o, i, FUNNEL.srcX + Math.cos(a) * d * 0.6, FUNNEL.srcY(k) + Math.sin(a) * d * 1.4, cols[k], 0.95, 2.8)
          continue
        }
        const k = Math.floor(r1[i] * 5)
        const u = (r2[i] + t * (0.09 + r3[i] * 0.05)) % 1
        const y0 = FUNNEL.srcY(k)
        const p0x = FUNNEL.srcX
        const mt = 1 - u
        const bx = mt * mt * mt * p0x + 3 * mt * mt * u * 0.55 + 3 * mt * u * u * 0.66 + u * u * u * sx
        const by = mt * mt * mt * y0 + 3 * mt * mt * u * y0 + 3 * mt * u * u * sy + u * u * u * sy
        const spread = (r3[i] - 0.5) * 0.05 * (1 - u)
        const c = cols[k]
        tmp[0] = c[0] + (INK.ink[0] - c[0]) * u * u
        tmp[1] = c[1] + (INK.ink[1] - c[1]) * u * u
        tmp[2] = c[2] + (INK.ink[2] - c[2]) * u * u
        set(o, i, bx, by + spread, tmp, 0.25 + u * 0.65, 2 + u * 1.4)
      }
    },
  },

  /** F&O Advisor, call: the likelihood ring sweeps to 72%, past the 65% bar. */
  ring: {
    fit: 'contain',
    jitter: 0.4,
    fill(o, { n, age, r1, r2, r3 }) {
      const fillTo = RING.value * (1 - Math.pow(1 - Math.min(age / 1.8, 1), 3))
      const R = RING.r
      for (let i = 0; i < n; i++) {
        if (r3[i] < 0.06) {
          // the 65% bar, a radial tick
          const a = RING.bar * Math.PI * 2 - Math.PI / 2
          const rr = R - 0.07 + r1[i] * 0.14
          set(o, i, 0.5 + Math.cos(a) * rr, 0.5 + Math.sin(a) * rr, INK.ink, 0.95, 2.4)
          continue
        }
        if (r3[i] < 0.16) {
          const a = r1[i] * Math.PI * 2
          set(o, i, 0.5 + Math.cos(a) * (R - 0.09), 0.5 + Math.sin(a) * (R - 0.09), INK.mute, 0.3, 1.5)
          continue
        }
        const f = r1[i]
        const a = f * Math.PI * 2 - Math.PI / 2
        const rr = R + (r2[i] - 0.5) * 0.045
        const on = f <= fillTo
        dusk(f / RING.value, tmp)
        set(o, i, 0.5 + Math.cos(a) * rr, 0.5 + Math.sin(a) * rr, on ? tmp : INK.track, on ? 0.95 : 0.4, on ? 3 : 2)
      }
    },
  },

  /** F&O Advisor, check: every call sits on the line where it was made; hits solid, misses hollow. */
  check: {
    fit: 'stretch',
    still: true,
    jitter: 0.5,
    fill(o, { n, asp, r1, r2, r3 }) {
      const lineN = Math.floor(n * 0.3)
      for (let i = 0; i < lineN; i++) {
        const u = r1[i]
        set(o, i, 0.05 + u * 0.9, 0.12 + NIFTY_Y(u) * 0.66 + (r2[i] - 0.5) * 0.004, INK.ink, 0.28, 1.9)
      }
      const per = Math.floor((n - lineN) / Math.max(GRADED.length, 1))
      let i = lineN
      GRADED.forEach((c, ci) => {
        const m = ci === GRADED.length - 1 ? n - i : per
        const rx = 0.032
        const ry = rx * asp
        for (let k = 0; k < m && i < n; k++, i++) {
          const a = r1[i] * Math.PI * 2
          const d = c.hit ? Math.sqrt(r2[i]) : 0.82 + r2[i] * 0.18
          set(
            o,
            i,
            c.x + Math.cos(a) * rx * d,
            c.y + Math.sin(a) * ry * d,
            c.hit ? INK.emerald : INK.rose,
            c.hit ? 0.55 + r3[i] * 0.4 : 0.85,
            c.hit ? 2.6 : 2.4,
          )
        }
      })
    },
  },

  /** Quiet: sparse slow dust over the whole screen. */
  dust: {
    fit: 'stretch',
    jitter: 0,
    fill(o, { n, t, r1, r2, r3, r4 }) {
      for (let i = 0; i < n; i++) {
        const x = (r1[i] + t * 0.004 * (r4[i] - 0.5)) % 1
        const y = (r2[i] + Math.sin(t * 0.15 + r1[i] * 12) * 0.02 + 1) % 1
        dusk(r3[i], tmp)
        set(o, i, x < 0 ? x + 1 : x, y, tmp, 0.06 + Math.pow(r4[i], 3) * 0.3, 1.4 + r4[i] * 1.8)
      }
    },
  },

  /** The close: the Trahdo mark, a flat bar over a slanted stem, as a halftone in dusk light. */
  mark: {
    fit: 'contain',
    still: true,
    jitter: 0.5,
    fill(o, { n }) {
      const quad: [number, number][] = [
        [96, 94],
        [170, 94],
        [104, 196],
        [54, 164],
      ]
      const inQuad = (x: number, y: number) => {
        let inside = false
        for (let a = 0, b = quad.length - 1; a < quad.length; b = a++) {
          const [xa, ya] = quad[a]
          const [xb, yb] = quad[b]
          if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside
        }
        return inside
      }
      // A staggered grid over the mark (200-unit space), two or three particles per dot.
      const halo = Math.floor(n * 0.06)
      const body = n - halo
      const step = Math.sqrt(22660 / (body / 2.4))
      const dots: [number, number][] = []
      for (let row = 0, y = 4 + step / 2; y < 198; y += step * 0.866, row++)
        for (let x = 2 + (row % 2 ? step : step / 2); x < 198; x += step) if (y <= 88 || inQuad(x, y)) dots.push([x, y])
      for (let i = 0; i < body; i++) {
        const [x, y] = dots[i % dots.length]
        const stem = y > 90
        dusk(0.3 + (y / 200) * 0.7, tmp)
        set(o, i, 0.1 + (x / 200) * 0.8, 0.1 + (y / 200) * 0.8, tmp, stem ? 0.72 : 0.9, 4)
      }
      for (let i = body; i < n; i++) {
        const a = hash(i, 3) * Math.PI * 2
        const d = 0.44 + Math.pow(hash(i, 4), 0.6) * 0.3
        set(o, i, 0.5 + Math.cos(a) * d, 0.5 + Math.sin(a) * d, INK.violet, 0.08 + hash(i, 5) * 0.14, 1.6)
      }
    },
  },
}

export type ShapeName = keyof typeof shapes

// ----------------------------------------------------------------------- engine

const VERT = `
attribute vec2 a_pos;
attribute vec4 a_col;
attribute float a_size;
uniform vec2 u_res;
uniform float u_dpr;
varying vec4 v_col;
void main() {
  vec2 c = a_pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  gl_PointSize = a_size * u_dpr * 0.85;
  v_col = a_col;
}`

const FRAG = `
precision mediump float;
varying vec4 v_col;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = (1.0 - smoothstep(0.55, 1.0, r)) * v_col.a;
  gl_FragColor = vec4(v_col.rgb * a, a);
}`

interface Slot {
  el: HTMLElement
  name: string
  since: number
}

export class Field {
  private gl: WebGLRenderingContext
  private n: number
  private dpr = 1
  private w = 0
  private h = 0
  private res: WebGLUniformLocation | null
  private dprLoc: WebGLUniformLocation | null
  private data: Float32Array
  private px: Float32Array
  private py: Float32Array
  private cur: Buf
  private A: Buf
  private B: Buf
  private ctx: Ctx
  private cache = new Map<string, Buf>()
  private slots: Slot[] = []
  private frame = 0
  private t0 = performance.now()
  private last = performance.now()
  private mouse = { x: -9999, y: -9999, on: false }
  private reduced: boolean
  private canvas: HTMLCanvasElement
  private idle: Slot = { el: document.body, name: 'dust', since: 0 }

  static create(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' })
    if (!gl) return null
    try {
      return new Field(canvas, gl)
    } catch {
      return null
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.canvas = canvas
    this.gl = gl
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 760
    this.n = small ? 1700 : 4200
    const n = this.n

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link')
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    this.data = new Float32Array(n * 7)
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW)
    const stride = 7 * 4
    const attr = (name: string, size: number, offset: number) => {
      const loc = gl.getAttribLocation(prog, name)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset * 4)
    }
    attr('a_pos', 2, 0)
    attr('a_col', 4, 2)
    attr('a_size', 1, 6)
    this.res = gl.getUniformLocation(prog, 'u_res')
    this.dprLoc = gl.getUniformLocation(prog, 'u_dpr')
    gl.enable(gl.BLEND)
    // premultiplied "over": on a light page the dots are ink, not light
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    const rnd = (salt: number) => {
      const a = new Float32Array(n)
      for (let i = 0; i < n; i++) a[i] = hash(i, salt)
      return a
    }
    this.ctx = { n, t: 0, age: 0, asp: 1, bw: 1, bh: 1, r1: rnd(101), r2: rnd(202), r3: rnd(303), r4: rnd(404) }
    this.cur = makeBuf(n)
    this.A = makeBuf(n)
    this.B = makeBuf(n)
    this.px = new Float32Array(n)
    this.py = new Float32Array(n)

    this.resize()
    // Start scattered across the screen, so the first picture assembles itself.
    for (let i = 0; i < n; i++) {
      this.px[i] = this.ctx.r3[i] * this.w
      this.py[i] = this.ctx.r4[i] * this.h
      this.cur.a[i] = 0
      this.cur.s[i] = 2
    }
  }

  /** Re-read the boxes on the page (after a route change). */
  scan(root: ParentNode) {
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'))
    this.slots = els.map((el) => this.slots.find((s) => s.el === el) ?? { el, name: '', since: 0 })
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, this.n < 2000 ? 1.75 : 2)
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.uniform2f(this.res, this.w, this.h)
    this.gl.uniform1f(this.dprLoc, this.dpr)
    this.cache.clear()
  }

  pointer(x: number, y: number, on: boolean) {
    this.mouse.x = x
    this.mouse.y = y
    this.mouse.on = on && !this.reduced
  }

  start() {
    if (!this.frame) {
      this.last = performance.now()
      this.frame = requestAnimationFrame(this.tick)
    }
  }

  stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  destroy() {
    this.stop()
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  private shapeInto(slot: Slot, rect: DOMRect, out: Buf, now: number) {
    const shape = shapes[slot.name] ?? shapes.dust
    const asp = shape.fit === 'contain' ? 1 : rect.width / Math.max(rect.height, 1)
    const c = this.ctx
    c.asp = asp
    c.bw = shape.fit === 'contain' ? Math.min(rect.width, rect.height) : rect.width
    c.bh = shape.fit === 'contain' ? c.bw : rect.height
    c.age = (now - slot.since) / 1000
    let src = out
    if (shape.still) {
      const key = `${slot.name}:${Math.round(c.bw)}x${Math.round(c.bh)}`
      let hit = this.cache.get(key)
      if (!hit) {
        hit = makeBuf(this.n)
        shape.fill(hit, c)
        this.cache.set(key, hit)
      }
      src = hit
    } else {
      shape.fill(out, c)
    }
    // map the unit box onto the element
    let bx = rect.left
    let by = rect.top
    let bw = rect.width
    let bh = rect.height
    if (shape.fit === 'contain') {
      const side = Math.min(bw, bh)
      bx += (bw - side) / 2
      by += (bh - side) / 2
      bw = bh = side
    }
    const j = this.reduced ? 0 : shape.jitter
    const t = c.t
    const { r1, r2 } = c
    for (let i = 0; i < this.n; i++) {
      let x = bx + src.x[i] * bw
      let y = by + src.y[i] * bh
      if (j) {
        x += Math.sin(t * 1.3 + r1[i] * 40) * j
        y += Math.cos(t * 1.1 + r2[i] * 40) * j
      }
      out.x[i] = x
      out.y[i] = y
      if (src !== out) {
        out.r[i] = src.r[i]
        out.g[i] = src.g[i]
        out.b[i] = src.b[i]
        out.a[i] = src.a[i]
        out.s[i] = src.s[i]
      }
    }
  }

  private tick = (now: number) => {
    this.frame = requestAnimationFrame(this.tick)
    this.render(now)
  }

  /** One frame of the field at time `now` (ms, performance.now() clock). */
  render(now: number) {
    const dt = Math.min(Math.max((now - this.last) / 16.667, 0), 3)
    this.last = Math.max(now, this.last)
    const c = this.ctx
    c.t = this.reduced ? 0 : (now - this.t0) / 1000

    // Weigh every box by how close its middle is to the middle of the screen.
    const vh = this.h
    let best: { slot: Slot; rect: DOMRect; w: number } | null = null
    let next: { slot: Slot; rect: DOMRect; w: number } | null = null
    for (const slot of this.slots) {
      if (!slot.el.isConnected) continue
      const name = slot.el.dataset.scene ?? ''
      if (name !== slot.name) {
        slot.name = name
        slot.since = now
      }
      const rect = slot.el.getBoundingClientRect()
      if (rect.height === 0) continue
      const d = Math.abs(rect.top + rect.height / 2 - vh / 2) / vh
      const w = 1 - smooth(0.22, 0.62, d)
      if (w <= 0) continue
      const item = { slot, rect, w }
      if (!best || w > best.w) {
        next = best
        best = item
      } else if (!next || w > next.w) next = item
    }

    if (!best) {
      // Nothing to show: drift as dust over the screen.
      best = { slot: this.idle, rect: new DOMRect(0, 0, this.w, this.h), w: 1 }
    }

    this.shapeInto(best.slot, best.rect, this.A, now)
    let wa = 1
    let wb = 0
    if (next && next.w > 0.001) {
      this.shapeInto(next.slot, next.rect, this.B, now)
      wa = best.w / (best.w + next.w)
      wb = 1 - wa
    }

    const { A, B, cur, px, py, data } = this
    const { r1, r4 } = c
    const snap = this.reduced
    const m = this.mouse
    const R = 150
    for (let i = 0; i < this.n; i++) {
      let tx = A.x[i]
      let ty = A.y[i]
      let ta = A.a[i]
      let tr = A.r[i]
      let tg = A.g[i]
      let tb = A.b[i]
      let ts = A.s[i]
      if (wb) {
        tx = tx * wa + B.x[i] * wb
        ty = ty * wa + B.y[i] * wb
        tr = tr * wa + B.r[i] * wb
        tg = tg * wa + B.g[i] * wb
        tb = tb * wa + B.b[i] * wb
        ta = ta * wa + B.a[i] * wb
        ts = ts * wa + B.s[i] * wb
      }
      if (m.on) {
        const dx = tx - m.x
        const dy = ty - m.y
        const d2 = dx * dx + dy * dy
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / R) ** 2
          tx += (dx / d) * f * 46
          ty += (dy / d) * f * 46
          ta = Math.min(ta + f * 0.5, 1)
        }
      }
      if (snap) {
        px[i] = tx
        py[i] = ty
        cur.r[i] = tr
        cur.g[i] = tg
        cur.b[i] = tb
        cur.a[i] = ta
        cur.s[i] = ts
      } else {
        const k = 1 - Math.pow(1 - (0.045 + r4[i] * 0.075), dt)
        const dx = tx - px[i]
        const dy = ty - py[i]
        // a slight curl, so particles arc into place instead of sliding in straight lines
        const curl = (r1[i] - 0.5) * 0.7
        px[i] += (dx - dy * curl) * k
        py[i] += (dy + dx * curl) * k
        const kc = Math.min(k * 1.6, 1)
        cur.r[i] += (tr - cur.r[i]) * kc
        cur.g[i] += (tg - cur.g[i]) * kc
        cur.b[i] += (tb - cur.b[i]) * kc
        cur.a[i] += (ta - cur.a[i]) * kc
        cur.s[i] += (ts - cur.s[i]) * kc
      }
      const o = i * 7
      data[o] = px[i]
      data[o + 1] = py[i]
      data[o + 2] = cur.r[i]
      data[o + 3] = cur.g[i]
      data[o + 4] = cur.b[i]
      data[o + 5] = cur.a[i]
      data[o + 6] = cur.s[i]
    }

    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
    gl.drawArrays(gl.POINTS, 0, this.n)
  }
}
