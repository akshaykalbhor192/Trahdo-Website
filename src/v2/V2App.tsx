import { useEffect, useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer, Nav } from './ui'
import { useReveal } from './motion'
import Home from './Home'
import { About, Careers, NotFound, Security } from './Pages'
import './v2.css'

/*
 * The redesigned site, served under /1st so it can be compared with the current one (see
 * VersionToggle). It shares content, links and the sample session with the current site, and
 * nothing else: its own type, colour, layout and motion, all scoped under `.nx`.
 */
export default function V2App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { pathname, hash } = useLocation()

  // The current site paints <html> dark; the new one is on paper.
  useLayoutEffect(() => {
    document.documentElement.classList.add('nx-doc')
    return () => document.documentElement.classList.remove('nx-doc')
  }, [])

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' }))
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  useReveal(rootRef, pathname)

  return (
    <div className="nx" ref={rootRef}>
      <a className="nx-skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <Routes>
        <Route path="/1st" element={<Home />} />
        <Route path="/1st/about" element={<About />} />
        <Route path="/1st/security" element={<Security />} />
        <Route path="/1st/careers" element={<Careers />} />
        <Route path="/1st/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}
