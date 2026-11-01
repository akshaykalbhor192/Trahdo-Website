import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LINKS, CTA_LABEL } from '../lib/links'
import { Mark } from '../components/Mark'
import { Field } from './field'

/** The 2nd design lives under /2nd. */
export const BASE = '/2nd'
export const to = (path: string) => (path === '/' ? BASE : `${BASE}${path}`)

/* ----------------------------------------------------------------- field -- */

/**
 * The fixed canvas behind every page. It finds the `[data-scene]` boxes inside `root` after
 * each route change and fills them; with no WebGL it simply is not drawn.
 */
export function FieldCanvas({ root, routeKey }: { root: React.RefObject<HTMLElement | null>; routeKey: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const field = useRef<Field | null>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    // A fresh canvas per mount: a context lost on unmount cannot be reused.
    const canvas = document.createElement('canvas')
    canvas.className = 'q-field'
    host.append(canvas)
    const f = Field.create(canvas)
    if (!f) {
      canvas.remove()
      return
    }
    field.current = f
    // Dev-only handle, so a hidden preview pane (which throttles frames) can be stepped by hand.
    if (import.meta.env.DEV) (window as unknown as { __qfield?: Field }).__qfield = f
    if (root.current) f.scan(root.current)
    f.start()
    const onResize = () => f.resize()
    const onMove = (e: PointerEvent) => f.pointer(e.clientX, e.clientY, e.pointerType === 'mouse')
    const onLeave = () => f.pointer(-9999, -9999, false)
    const onVis = () => (document.hidden ? f.stop() : f.start())
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      f.destroy()
      canvas.remove()
      field.current = null
    }
  }, [root])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (root.current) field.current?.scan(root.current)
    })
    return () => cancelAnimationFrame(id)
  }, [root, routeKey])

  return <div ref={ref} aria-hidden="true" />
}

/* ------------------------------------------------------------------ type -- */

/**
 * A headline whose words rise out of a mask one after another. `*words*` are set in the light
 * italic with the dawn gradient, which runs once across the whole phrase rather than once per
 * word. The sentence stays whole for screen readers.
 */
export function Title({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  id,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
  id?: string
}) {
  // Each emphasised word knows its place in its phrase (--gi of --gn) to show its slice of the ramp.
  const words: { word: string; em: boolean; gi: number; group: number[] }[] = []
  let group: number[] | null = null
  for (const raw of text.split(' ')) {
    if (raw.startsWith('*')) group = []
    const em = group !== null
    if (group) group.push(words.length)
    words.push({ word: raw.replaceAll('*', ''), em, gi: group ? group.length - 1 : 0, group: group ?? [] })
    if (raw.endsWith('*')) group = null
  }
  return (
    <Tag id={id} className={`q-title ${className}`} data-r aria-label={text.replaceAll('*', '')}>
      {words.map(({ word, em, gi, group }, i) => (
        <Fragment key={i}>
          <span className="q-title__m" aria-hidden="true">
            <span
              className={`q-title__w${em ? ' q-em' : ''}`}
              style={{ '--d': `${delay + i * 55}ms`, '--gi': gi, '--gn': group.length || 1 } as CSSProperties}
            >
              {word}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}

/** A small mono label with a lit dot: what this section is. */
export function Label({ children, tone = 'dusk' }: { children: ReactNode; tone?: 'dusk' | 'jade' }) {
  return (
    <p className={`q-label q-label--${tone}`} data-r>
      <i aria-hidden="true" />
      {children}
    </p>
  )
}

/* --------------------------------------------------------------- buttons -- */

export function Btn({
  children,
  variant = 'primary',
  href,
  to: path,
  className = '',
}: {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  href?: string
  to?: string
  className?: string
}) {
  const cls = `q-btn q-btn--${variant} ${className}`
  const inner = (
    <>
      <span className="q-btn__text">{children}</span>
      <span className="q-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16">{href ? <path d="M5 11 11 5M6.5 5H11v4.5" /> : <path d="M3 8h9.5M8.5 4 12.5 8l-4 4" />}</svg>
      </span>
    </>
  )
  if (href)
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
        <span className="q-sr"> (opens in a new tab)</span>
      </a>
    )
  return (
    <Link className={cls} to={path ?? to('/')}>
      {inner}
    </Link>
  )
}

export function Live({ children = 'Live' }: { children?: ReactNode }) {
  return (
    <span className="q-live">
      <i aria-hidden="true" />
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------- nav -- */

const navLinks = [
  { to: '/#intelligence', label: 'Market Intelligence' },
  { to: '/#advisor', label: 'F&O Advisor' },
  { to: '/about', label: 'About' },
  { to: '/security', label: 'Security' },
]

function Logo() {
  return (
    <Link to={to('/')} className="q-logo" aria-label="Trahdo home">
      <span className="q-logo__mark">
        <Mark />
      </span>
      trahdo
    </Link>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)
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
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <header className="q-nav" data-scrolled={scrolled} data-open={open}>
      <div className="q-nav__bar">
        <Logo />
        <nav aria-label="Primary">
          <ul className="q-nav__links">
            {navLinks.map((l) => (
              <li key={l.label}>{l.to.includes('#') ? <Link to={to(l.to)}>{l.label}</Link> : <NavLink to={to(l.to)}>{l.label}</NavLink>}</li>
            ))}
          </ul>
        </nav>
        <div className="q-nav__end">
          <Btn to={to('/#start')} className="q-btn--sm">
            {CTA_LABEL}
          </Btn>
        </div>
        <button
          type="button"
          className="q-nav__toggle"
          aria-expanded={open}
          aria-controls="q-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpenAt(open ? null : here)}
        >
          <span />
        </button>
      </div>
      {open ? (
        <div id="q-sheet" className="q-sheet">
          <nav aria-label="Menu">
            {[...navLinks, { to: '/careers', label: 'Careers' }].map((l, i) => (
              <Link key={l.label} to={to(l.to)} style={{ '--i': i } as CSSProperties}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="q-sheet__end">
            <Btn to={to('/#start')}>{CTA_LABEL}</Btn>
          </div>
        </div>
      ) : null}
    </header>
  )
}

/* ---------------------------------------------------------------- footer -- */

export function Footer() {
  return (
    <footer className="q-footer">
      <div className="q-wrap">
        <div className="q-footer__top">
          <div className="q-footer__brand">
            <Logo />
            <p>See what is moving. Make the call. Check it.</p>
          </div>
          <div className="q-footer__cols">
            <div>
              <h2>Products</h2>
              <a href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
                Market Intelligence
              </a>
              <a href={LINKS.foAdvisor} target="_blank" rel="noopener noreferrer">
                F&amp;O Advisor
              </a>
            </div>
            <div>
              <h2>Company</h2>
              <Link to={to('/about')}>About</Link>
              <Link to={to('/careers')}>Careers</Link>
            </div>
            <div>
              <h2>Trust</h2>
              <Link to={to('/security')}>Security</Link>
            </div>
          </div>
        </div>
        <p className="q-footer__fine">
          Investing involves risk, including possible loss of principal. Trahdo Market Intelligence and F&amp;O Advisor are products
          of Trahdo. F&amp;O Advisor is an analysis tool for education, not investment advice; calls can be wrong, and trading
          derivatives can lose you more than you put in. Market figures on this site are sample data.
        </p>
        <div className="q-footer__meta">
          <span>© {new Date().getFullYear()} Trahdo</span>
          <span>Made for the 09:15 to 15:30 crowd</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to the open ↑
          </button>
        </div>
      </div>
      <div className="q-footer__word" aria-hidden="true">
        trahdo
      </div>
    </footer>
  )
}
