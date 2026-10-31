import { Fragment, useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LINKS, CTA_LABEL } from '../lib/links'
import { Arrow, External, Mark } from '../components/Mark'
import { linePath, rangeOf } from '../session/data'

/** The new design lives under /1st. */
export const BASE = '/1st'
export const to = (path: string) => (path === '/' ? BASE : `${BASE}${path}`)

/* ------------------------------------------------------------------ type -- */

/**
 * A headline whose words rise out of a mask, one after another. `*word*` marks the words set in
 * italic serif (the accent voice). The full sentence is kept for screen readers.
 */
export function Rise({ text, as: Tag = 'h2', className = '', delay = 0, id }: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string; delay?: number; id?: string }) {
  const words: { word: string; em: boolean }[] = []
  let italic = false
  for (const raw of text.split(' ')) {
    if (raw.startsWith('*')) italic = true
    words.push({ word: raw.replaceAll('*', ''), em: italic })
    if (raw.endsWith('*')) italic = false
  }
  return (
    <Tag id={id} className={`nx-rise ${className}`} data-r aria-label={text.replaceAll('*', '')}>
      {words.map(({ word, em }, i) => {
        // The space sits between the masks: inside an inline-block it would be trimmed.
        return (
          <Fragment key={i}>
            <span className="nx-rise__w" aria-hidden="true">
              <span style={{ '--d': `${delay + i * 55}ms` } as CSSProperties} className={em ? 'nx-em' : undefined}>
                {word}
              </span>
            </span>{' '}
          </Fragment>
        )
      })}
    </Tag>
  )
}

export function Eyebrow({ children, tone }: { children: ReactNode; tone?: 'ember' | 'green' | 'night' }) {
  return (
    <p className={`nx-eyebrow ${tone ? `nx-eyebrow--${tone}` : ''}`} data-r>
      <i aria-hidden="true" />
      {children}
    </p>
  )
}

/* --------------------------------------------------------------- buttons -- */

type BtnProps = { children: ReactNode; variant?: 'ink' | 'ghost' | 'ember' | 'paper'; href?: string; to?: string; className?: string }

export function Btn({ children, variant = 'ink', href, to: path, className = '' }: BtnProps) {
  const cls = `nx-btn nx-btn--${variant} ${className}`
  const inner = (
    <>
      <span className="nx-btn__label">{children}</span>
      <span className="nx-btn__icon" aria-hidden="true">
        {href ? <External /> : <Arrow />}
      </span>
    </>
  )
  if (href)
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  return (
    <Link className={cls} to={path ?? to('/')}>
      {inner}
    </Link>
  )
}

export function Live({ children = 'Live now' }: { children?: ReactNode }) {
  return (
    <span className="nx-live">
      <i aria-hidden="true" />
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- charts -- */

/** A line (and optional area) for a slice of a series, scaled to a w x h box. */
export function Line({
  values,
  from = 0,
  to: end = values.length - 1,
  w = 600,
  h = 200,
  area = false,
  className = '',
  pad = 8,
}: {
  values: number[]
  from?: number
  to?: number
  w?: number
  h?: number
  area?: boolean
  className?: string
  pad?: number
}) {
  const [lo, hi] = rangeOf(values, from, end)
  const d = linePath(values, from, end, w, h, lo, hi, pad)
  const id = `g${Math.round(values[from] * 1000)}${from}${end}${w}`
  return (
    <svg className={`nx-line ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      {area ? (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d}L${w} ${h}L0 ${h}Z`} fill={`url(#${id})`} className="nx-line__area" />
        </>
      ) : null}
      <path d={d} pathLength={1} className="nx-line__stroke" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/* ------------------------------------------------------------------- nav -- */

const navLinks = [
  { to: '/#products', label: 'Products' },
  { to: '/#advisor', label: 'F&O Advisor' },
  { to: '/about', label: 'About' },
  { to: '/security', label: 'Security' },
  { to: '/careers', label: 'Careers' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
  const { pathname, hash } = useLocation()
  const here = pathname + hash
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === here

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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
    <header className="nx-nav" data-scrolled={scrolled} data-open={open}>
      <div className="nx-nav__bar">
        <Link to={to('/')} className="nx-mark" aria-label="Trahdo home">
          <Mark />
          <span>trahdo</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="nx-nav__links">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.to.includes('#') ? (
                  <Link to={to(l.to)}>{l.label}</Link>
                ) : (
                  <NavLink to={to(l.to)}>{l.label}</NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="nx-nav__end">
          <a className="nx-nav__plain" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
            Sign in
          </a>
          <Btn to={to('/#start')} className="nx-btn--sm">
            {CTA_LABEL}
          </Btn>
        </div>
        <button
          type="button"
          className="nx-nav__toggle"
          aria-expanded={open}
          aria-controls="nx-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpenAt(open ? null : here)}
        >
          <span />
        </button>
      </div>
      {open ? (
        <div id="nx-sheet" className="nx-nav__sheet">
          {navLinks.map((l, i) => (
            <Link key={l.label} to={to(l.to)} style={{ '--i': i } as CSSProperties}>
              {l.label}
              <Arrow />
            </Link>
          ))}
          <Btn to={to('/#start')}>{CTA_LABEL}</Btn>
        </div>
      ) : null}
    </header>
  )
}

/* ---------------------------------------------------------------- footer -- */

export function Footer() {
  return (
    <footer className="nx-footer">
      <div className="nx-wrap">
        <div className="nx-footer__top">
          <div className="nx-footer__lede">
            <p className="nx-serif">
              See what is moving. Make the call. <em>Check it.</em>
            </p>
            <div className="nx-footer__ctas">
              <Btn href={LINKS.marketIntelligence} variant="paper">
                Market Intelligence
              </Btn>
              <Btn href={LINKS.foAdvisor} variant="ghost">
                F&amp;O Advisor
              </Btn>
            </div>
          </div>
          <div className="nx-footer__cols">
            <div>
              <h2>Products</h2>
              <ul>
                <li>
                  <a href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
                    Market Intelligence
                  </a>
                </li>
                <li>
                  <a href={LINKS.foAdvisor} target="_blank" rel="noopener noreferrer">
                    F&amp;O Advisor
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Company</h2>
              <ul>
                <li>
                  <Link to={to('/about')}>About</Link>
                </li>
                <li>
                  <Link to={to('/careers')}>Careers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>Trust</h2>
              <ul>
                <li>
                  <Link to={to('/security')}>Security</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="nx-footer__fine">
          Investing involves risk, including possible loss of principal. Trahdo Market Intelligence and F&amp;O Advisor are
          products of Trahdo. F&amp;O Advisor is an analysis tool for education, not investment advice; calls can be wrong,
          and trading derivatives can lose you more than you put in. Market figures on this site are sample data.
        </p>
        <div className="nx-footer__meta">
          <span>© {new Date().getFullYear()} Trahdo</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top ↑
          </button>
        </div>
      </div>
      <div className="nx-footer__giant" aria-hidden="true">
        trahdo
      </div>
    </footer>
  )
}
