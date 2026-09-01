import { useEffect, useRef, useState } from 'react'

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )

    const resync = () => {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      setInView(rect.top < vh * 0.9 && rect.bottom > 0)
    }

    observer.observe(node)
    document.addEventListener('visibilitychange', resync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', resync)
    }
  }, [threshold])

  return { ref, inView }
}
