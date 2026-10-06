import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CTA_LABEL } from '../lib/links'
import { Mark } from './Mark'

const links = [
  { to: '/about', label: 'About' },
  { to: '/#products', label: 'Products' },
  { to: '/careers', label: 'Careers' },
  { to: '/security', label: 'Security' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)
  // The sheet is open for one specific location, so any navigation closes it.
  const { pathname, hash } = useLocation()
  const here = pathname + hash
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === here

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="nav" data-scrolled={scrolled} data-open={open}>
      <div className="nav__inner">
        <Link to="/" className="wordmark" aria-label="Trahdo home">
          <Mark />
          <span>trahdo</span>
        </Link>

        <nav aria-label="Primary">
          <ul className="nav__links">
            {links.map((link) => (
              <li key={link.label}>
                {link.to.includes('#') ? (
                  <Link to={link.to} className="nav__link">
                    {link.label}
                  </Link>
                ) : (
                  <NavLink to={link.to} className="nav__link">
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/#get-started" className="btn btn--primary nav__cta">
          {CTA_LABEL}
        </Link>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpenAt(open ? null : here)}
        >
          <span />
        </button>
      </div>

      {open ? (
        <div id="nav-sheet" className="nav__sheet">
          {links.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
          <Link to="/#get-started" className="btn btn--primary">
            {CTA_LABEL}
          </Link>
        </div>
      ) : null}
    </header>
  )
}
