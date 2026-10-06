import { useEffect, useSyncExternalStore } from 'react'
import { SESSION_MINUTES } from './data'

/*
 * The session clock: one number (minutes since the 09:15 open, fractional) shared by the
 * hero, the rail, the research panels and the peak.
 *
 * Time is authored on the page. Every act that sits inside the trading day carries
 *   data-t0 / data-t1    minutes at the start and end of the act
 *   data-q0 / data-q1    (pinned acts only) the pin progress that maps to t0 and t1
 * The clock is the interpolation across whichever act is under the middle of the viewport.
 */

let t = 0
const listeners = new Set<() => void>()

export function getTime() {
  return t
}

export function subscribeTime(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function setTime(next: number) {
  const v = Math.min(Math.max(next, 0), SESSION_MINUTES)
  if (Math.abs(v - t) < 0.005) return
  t = v
  listeners.forEach((fn) => fn())
}

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)

/** Progress through a pinned act (0 to 1 across its pinned travel), same maths as the engine. */
export function pinProgress(el: Element) {
  const r = el.getBoundingClientRect()
  const travel = Math.max(r.height - window.innerHeight, 1)
  return clamp01(-r.top / travel)
}

function readTime(root: HTMLElement): number {
  const acts = Array.from(root.querySelectorAll<HTMLElement>('[data-t0]'))
  if (!acts.length) return 0
  const vh = window.innerHeight
  let active = acts[0]
  for (const el of acts) {
    if (el.getBoundingClientRect().top <= vh * 0.5) active = el
  }
  const t0 = parseFloat(active.dataset.t0 ?? '0')
  const t1 = parseFloat(active.dataset.t1 ?? String(t0))
  const r = active.getBoundingClientRect()
  let q: number
  if (active.dataset.pinned === 'true') {
    const q0 = parseFloat(active.dataset.q0 ?? '0')
    const q1 = parseFloat(active.dataset.q1 ?? '1')
    q = clamp01((pinProgress(active) - q0) / Math.max(q1 - q0, 0.001))
  } else {
    q = clamp01((vh * 0.5 - r.top) / Math.max(r.height, 1))
  }
  return t0 + (t1 - t0) * q
}

/** Home page only: keeps the clock in step with the scroll position. */
export function useSessionClockDriver(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const update = () => {
      frame = 0
      setTime(readTime(root))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    // Fonts and layout settle after the first paint, so the first reading can be stale.
    const settle = window.setTimeout(schedule, 400)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.clearTimeout(settle)
      if (frame) cancelAnimationFrame(frame)
      setTime(0)
    }
  }, [rootRef])
}

/** Whole minute of the session. Components re-render at most once per minute of scroll. */
export function useSessionMinute() {
  return useSyncExternalStore(
    subscribeTime,
    () => Math.floor(t),
    () => 0,
  )
}

/** Fractional time for code that writes CSS variables directly and should not re-render. */
export function useSessionTime(onTime: (minute: number) => void) {
  useEffect(() => {
    onTime(t)
    return subscribeTime(() => onTime(t))
  }, [onTime])
}
