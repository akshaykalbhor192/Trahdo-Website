import { useEffect, useRef, useState } from 'react'

/**
 * Tracks each item's signed pixel distance from a fixed "focus line" in the
 * viewport as the page scrolls normally. Negative = scrolled past (above the
 * line), positive = still approaching (below the line), 0 = centered on it.
 */
export function useFocusScroll(count: number, focusFraction = 0.42) {
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const [distances, setDistances] = useState<number[]>(() =>
    new Array(count).fill(9999),
  )

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const vh = window.innerHeight || document.documentElement.clientHeight
      const focusY = vh * focusFraction

      const next = itemRefs.current.map((el) => {
        if (!el) return 9999
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        return center - focusY
      })
      setDistances(next)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', update)
    }
  }, [focusFraction])

  return { itemRefs, distances }
}
