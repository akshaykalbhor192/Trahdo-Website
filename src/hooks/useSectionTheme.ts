import { useEffect, useState } from 'react'

export type SectionTheme = 'dark' | 'light'

export function useSectionTheme(navHeight: number) {
  const [theme, setTheme] = useState<SectionTheme>('dark')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-theme]'),
    )

    let ticking = false

    const update = () => {
      ticking = false
      setScrolled(window.scrollY > 8)

      const probeY = navHeight + 1

      for (const el of sections) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= probeY && rect.bottom > probeY) {
          setTheme(el.dataset.theme === 'light' ? 'light' : 'dark')
          return
        }
      }
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
  }, [navHeight])

  return { theme, scrolled }
}
