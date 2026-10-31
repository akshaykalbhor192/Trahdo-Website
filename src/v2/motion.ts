import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/*
 * The new design's motion layer, with no animation library.
 *
 *   useReveal     adds `data-in` to every `[data-r]` inside the root once it enters the
 *                 viewport. CSS owns what the entrance looks like (see v2.css, "reveal").
 *   useProgress   writes the element's scroll progress (0 to 1) to `--p` on it, every frame
 *                 it changes. Pinned scenes and scrubbed effects read `--p` from CSS, so the
 *                 scroll never re-renders React.
 *   useCountUp    eases a number from 0 to its value the first time it is seen.
 *
 * Everything respects prefers-reduced-motion: reveals are shown at once, progress still
 * updates (it is position, not motion), and counters show their final value.
 */
export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useReveal(rootRef: RefObject<HTMLElement | null>, key?: unknown) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-r]:not([data-in])'))
    if (reducedMotion()) {
      nodes.forEach((n) => n.setAttribute('data-in', ''))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-in', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [rootRef, key])
}

/**
 * Progress of an element through the viewport.
 *   'pin'   0 when its top meets the viewport top, 1 when its bottom meets the viewport bottom
 *           (for tall sections with a sticky stage inside)
 *   'pass'  0 when its top enters from below, 1 when its bottom leaves at the top
 *   'enter' 0 when its top enters from below, 1 when its top reaches the viewport top
 */
export function useProgress(
  ref: RefObject<HTMLElement | null>,
  mode: 'pin' | 'pass' | 'enter' = 'pin',
  onChange?: (p: number) => void,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    let last = -1
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      let p: number
      if (mode === 'pin') p = -r.top / Math.max(r.height - vh, 1)
      else if (mode === 'pass') p = (vh - r.top) / (r.height + vh)
      else p = (vh - r.top) / vh
      p = Math.min(Math.max(p, 0), 1)
      if (Math.abs(p - last) < 0.0005) return
      last = p
      el.style.setProperty('--p', p.toFixed(4))
      onChange?.(p)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, mode, onChange])
}

export function useCountUp(ref: RefObject<HTMLElement | null>, to: number, ms = 1400) {
  const [value, setValue] = useState(() => (reducedMotion() ? to : 0))
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let frame = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const k = Math.min((now - start) / ms, 1)
          setValue(to * (1 - Math.pow(1 - k, 4)))
          if (k < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, to, ms])
  return value
}

/** Cursor-following spotlight: writes --mx/--my (px) on the hovered card. */
export function spotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
