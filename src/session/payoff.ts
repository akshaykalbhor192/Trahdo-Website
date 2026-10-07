/*
 * Option payoffs at expiry, for the F&O Advisor explainer.
 *
 * Everything here is arithmetic on ILLUSTRATIVE numbers: spot 100, made-up strikes and
 * premiums, per unit, before costs and taxes. It explains what a position does; it is not a
 * recommendation, a price quote, or a margin figure.
 */

export type StrategyId = 'long-call' | 'long-put' | 'bull-call-spread' | 'short-put'

export interface Leg {
  type: 'call' | 'put'
  /** +1 bought, -1 sold */
  side: 1 | -1
  strike: number
  premium: number
}

export interface Strategy {
  id: StrategyId
  name: string
  legs: Leg[]
}

export const SPOT = 100
export const RANGE: [number, number] = [85, 115]

export const STRATEGIES: Strategy[] = [
  { id: 'long-call', name: 'Buy a call', legs: [{ type: 'call', side: 1, strike: 100, premium: 3 }] },
  { id: 'long-put', name: 'Buy a put', legs: [{ type: 'put', side: 1, strike: 100, premium: 2.8 }] },
  {
    id: 'bull-call-spread',
    name: 'Bull call spread',
    legs: [
      { type: 'call', side: 1, strike: 100, premium: 3 },
      { type: 'call', side: -1, strike: 106, premium: 0.9 },
    ],
  },
  { id: 'short-put', name: 'Sell a put', legs: [{ type: 'put', side: -1, strike: 98, premium: 1.6 }] },
]

/** Profit or loss per unit at expiry if the underlying ends at `spot`. */
export function payoff(legs: Leg[], spot: number): number {
  let total = 0
  for (const leg of legs) {
    const intrinsic = leg.type === 'call' ? Math.max(spot - leg.strike, 0) : Math.max(leg.strike - spot, 0)
    total += leg.side * (intrinsic - leg.premium)
  }
  return total
}

export interface Summary {
  /** Largest possible gain, or null when it has no limit. */
  maxProfit: number | null
  /** Largest possible loss as a positive number, or null when it has no limit. */
  maxLoss: number | null
  breakevens: number[]
}

/** Scan a wide range so unlimited and floor/ceiling cases are found, not assumed. */
export function summarise(legs: Leg[]): Summary {
  const hiS = 400
  const step = 0.25
  let best = -Infinity
  let worst = Infinity
  const breakevens: number[] = []
  let prev = payoff(legs, 0)
  for (let s = 0; s <= hiS; s += step) {
    const v = payoff(legs, s)
    best = Math.max(best, v)
    worst = Math.min(worst, v)
    if (s > 0 && ((prev < 0 && v >= 0) || (prev > 0 && v <= 0))) {
      const s0 = s - step
      breakevens.push(s0 + (step * Math.abs(prev)) / (Math.abs(prev) + Math.abs(v)))
    }
    prev = v
  }
  // Still climbing or falling at the edge of the scan means there is no limit that way.
  const edge = payoff(legs, hiS)
  const near = payoff(legs, hiS - 20)
  return {
    maxProfit: edge - near > 0.5 ? null : best,
    maxLoss: edge - near < -0.5 ? null : Math.max(-worst, 0),
    breakevens,
  }
}

const n = (v: number) => v.toFixed(2)

/** One plain-language paragraph, built from the same numbers as the chart. */
export function explain(strategy: Strategy): string {
  const s = summarise(strategy.legs)
  const [a, b] = strategy.legs
  switch (strategy.id) {
    case 'long-call':
      return `You pay ${n(a.premium)} for the right to buy at ${a.strike}. The most you can lose is that ${n(a.premium)}, if it ends at or below ${a.strike}. You start to profit above ${n(s.breakevens[0])}, and there is no cap on the upside.`
    case 'long-put':
      return `You pay ${n(a.premium)} for the right to sell at ${a.strike}. The most you can lose is that ${n(a.premium)}, if it ends at or above ${a.strike}. You start to profit below ${n(s.breakevens[0])}.`
    case 'bull-call-spread': {
      const net = a.premium - b.premium
      return `You buy the ${a.strike} call and sell the ${b.strike} call, for a net cost of ${n(net)}. The most you can lose is ${n(net)}. The most you can make is ${n(b.strike - a.strike - net)}, once it ends at or above ${b.strike}. You break even at ${n(s.breakevens[0])}.`
    }
    case 'short-put':
      return `You collect ${n(a.premium)} and agree to buy at ${a.strike} if it ends below that. The most you can make is the ${n(a.premium)} you collected. You lose money below ${n(s.breakevens[0])}, and the loss grows to ${n(s.maxLoss ?? 0)} if the underlying falls to zero.`
  }
}
