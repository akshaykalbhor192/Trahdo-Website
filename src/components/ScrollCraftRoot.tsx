import { useEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Mounts the vendored Scroll-Craft engine over one route's markup and tears it down when the
 * route changes. The engine reads data-sc-* attributes from the DOM React rendered; it never
 * creates page DOM. It also owns scroll restoration for the route, because a hash target on
 * a pinned act is only at its right position once the engine has set that act's height.
 */
export default function ScrollCraftRoot({
  children,
  className,
  rootRef,
  title,
}: {
  children: ReactNode
  className?: string
  rootRef?: RefObject<HTMLDivElement | null>
  title?: string
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const ref = rootRef ?? innerRef
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const root = ref.current
    if (!root || !window.ScrollCraft) return
    const sc = window.ScrollCraft.mount(root)

    let frame = 0
    const relayout = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => sc.layout())
    }
    // Content that changes height after mount (images, fonts, state) must re-measure the acts.
    const ro = new ResizeObserver(relayout)
    ro.observe(root)
    root.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', relayout, { once: true })
    })

    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
      sc.destroy()
    }
  }, [ref])

  useEffect(() => {
    if (title) document.title = title
  }, [title])

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
