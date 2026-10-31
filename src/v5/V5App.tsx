import { useEffect, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { FieldCanvas, Footer, Nav } from './ui'
import { useReveal } from '../v2/motion'
import Home from './Home'
import { About, Careers, NotFound, Security } from './Pages'
import './v5.css'

/*
 * Design 5, "Dawn Field", served under /2nd. Shares content, links, the sample session and
 * the motion hooks (src/v2/motion.ts) with the earlier designs; everything visual is its own
 * and scoped under `.qx`. The particle field (src/v5/field.ts) runs behind every page.
 */
export default function V5App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    document.documentElement.classList.add('qx-doc')
    return () => document.documentElement.classList.remove('qx-doc')
  }, [])

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' }))
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  useReveal(rootRef, pathname)

  return (
    <div className="qx" ref={rootRef}>
      <div className="q-sky" aria-hidden="true" />
      {/* The Trahdo mark, wherever it appears: an ink bar over an ember stem. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="q-mark-grad" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0.45" stopColor="#151410" />
            <stop offset="0.46" stopColor="#ff5a1f" />
          </linearGradient>
        </defs>
      </svg>
      <FieldCanvas root={rootRef} routeKey={pathname} />
      <div className="q-grain" aria-hidden="true" />
      <a className="q-skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <Routes>
        <Route path="/2nd" element={<Home />} />
        <Route path="/2nd/about" element={<About />} />
        <Route path="/2nd/security" element={<Security />} />
        <Route path="/2nd/careers" element={<Careers />} />
        <Route path="/2nd/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}
