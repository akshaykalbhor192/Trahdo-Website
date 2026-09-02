import { useEffect, useRef, useState } from 'react'

/**
 * Tracks how far a container has scrolled through the viewport as a 0-1
 * value: 0 when its top is at 75% down the viewport, 1 once its bottom has
 * passed 25% down the viewport.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let ticking = false

    const update = () => {
      ticking = false
      const vh = window.innerHeight || document.documentElement.clientHeight
      const rect = node.getBoundingClientRect()
      const start = vh * 0.75
      const end = vh * 0.25
      const total = rect.height + (start - end)
      const covered = start - rect.top
      setProgress(Math.min(1, Math.max(0, covered / total)))
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
  }, [])

  return { ref, progress }
}
