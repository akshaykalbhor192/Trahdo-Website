import { useEffect } from 'react'

/*
 * Paced scrolling.
 *
 * The page is made of scroll-driven moments (a clock, an alert, an order, a result). A hard
 * wheel flick or a fast trackpad swipe would carry the visitor straight over them, so the wheel
 * is eased and capped instead of being handed to the browser raw:
 *
 *   - each wheel notch moves the page a little less than the browser would (WHEEL_GAIN),
 *   - the page can only run so far ahead of where it is (LEAD, in viewports), so a flick
 *     cannot queue up ten screens of travel,
 *   - and the page can only move so fast (MAX_SPEED, in viewports per 60Hz frame), so even the
 *     hardest flick plays every act at a pace the eye can follow.
 *
 * It does not touch: touch scrolling (the native fling stays), the scrollbar, keyboard
 * Home/End, pinch zoom, scroll regions inside the page, or visitors who ask for reduced
 * motion. Anything else that moves the page (hash links, the dock) is treated as an external
 * jump: the smoother simply adopts the new position.
 */
const LERP = 0.075
const WHEEL_GAIN = 0.75
const LEAD = 1
const MAX_SPEED = 0.035
const KEY_STEP = 0.85

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

function insideScroller(node: EventTarget | null) {
  let el = node instanceof Element ? node : null
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el)
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true
    el = el.parentElement
  }
  return false
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = window.scrollY
    let current = target
    let written = target
    let frame = 0
    let last = 0

    const maxY = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3)
      last = now
      const ease = (target - current) * (1 - Math.pow(1 - LERP, dt))
      const cap = MAX_SPEED * window.innerHeight * dt
      current += clamp(ease, -cap, cap)
      if (Math.abs(target - current) < 0.4) {
        current = target
        frame = 0
      } else {
        frame = requestAnimationFrame(tick)
      }
      written = current
      window.scrollTo({ top: current, behavior: 'instant' })
    }

    const nudge = (delta: number) => {
      if (!frame) {
        current = target = written = window.scrollY
        last = performance.now()
      }
      const lead = LEAD * window.innerHeight
      target = clamp(target + delta, Math.max(current - lead, 0), Math.min(current + lead, maxY()))
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      if (insideScroller(e.target)) return
      e.preventDefault()
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      nudge(e.deltaY * unit * WHEEL_GAIN)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return
      const active = document.activeElement
      if (active && active !== document.body && active !== document.documentElement) return
      const vh = window.innerHeight
      let delta = 0
      if (e.key === 'PageDown') delta = vh * KEY_STEP
      else if (e.key === 'PageUp') delta = -vh * KEY_STEP
      else if (e.key === ' ') delta = (e.shiftKey ? -1 : 1) * vh * KEY_STEP
      else if (e.key === 'ArrowDown') delta = 90
      else if (e.key === 'ArrowUp') delta = -90
      if (!delta) return
      e.preventDefault()
      nudge(delta)
    }

    // Anything else that moved the page (hash link, dock jump, scrollbar drag) is adopted.
    const onScroll = () => {
      if (Math.abs(window.scrollY - written) > 1.5) {
        current = target = written = window.scrollY
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
}
