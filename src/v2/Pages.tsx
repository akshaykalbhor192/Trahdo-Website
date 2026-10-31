import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LINKS, CTA_LABEL } from '../lib/links'
import { Mark } from '../components/Mark'
import { careersHow, principles, securityLanes, teamNote, timeline, trustCentre } from '../content'
import { SERIES } from '../session/data'
import { Btn, Eyebrow, Line, Rise, to } from './ui'
import { useProgress } from './motion'
import miShot from '../assets/market-intelligence.webp'

function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

/** The shared opening of every inner page: eyebrow, a rising serif headline, a lede, actions. */
function PageHero({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: ReactNode; children?: ReactNode }) {
  return (
    <section className="nx-phero">
      <div className="nx-hero__bg" aria-hidden="true">
        <div className="nx-hero__grid" />
        <div className="nx-hero__glow" />
      </div>
      <div className="nx-wrap nx-phero__inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Rise as="h1" text={title} className="nx-display nx-display--xl" />
        <p className="nx-lede" data-r style={{ '--d': '380ms' } as CSSProperties}>
          {lede}
        </p>
        {children ? (
          <div className="nx-hero__cta" data-r style={{ '--d': '480ms' } as CSSProperties}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function Closing({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="nx-start nx-start--page">
      <Line values={SERIES.NIFTY.price} w={1200} h={260} area className="nx-start__line is-ember" />
      <div className="nx-wrap nx-start__inner">
        <Rise text={title} className="nx-display nx-display--xl" />
        <div className="nx-hero__cta nx-hero__cta--center" data-r>
          {children}
        </div>
      </div>
    </section>
  )
}

/* ================================================================ about == */

export function About() {
  useTitle('About | Trahdo')
  const lineRef = useRef<HTMLDivElement>(null)
  useProgress(lineRef, 'pass')

  return (
    <main id="main">
      <PageHero
        eyebrow="About Trahdo"
        title="Moving markets, money and *every investor forward.*"
        lede="We are a small team building what we wished existed when we started investing: research and calls that speak to each other, instead of fighting for a tab."
      />

      <section className="nx-section">
        <div className="nx-wrap nx-note">
          <p className="nx-display nx-display--md nx-note__lead">{teamNote.lead}</p>
          <div className="nx-note__body">
            {teamNote.body.map((p) => (
              <p key={p} data-r>
                {p}
              </p>
            ))}
            <p className="nx-note__sign" data-r>
              <Mark /> The Trahdo team
            </p>
          </div>
        </div>
      </section>

      <section className="nx-section nx-timeline" aria-labelledby="nx-tl-title">
        <div className="nx-wrap">
          <div className="nx-head">
            <Eyebrow>Our story</Eyebrow>
            <Rise id="nx-tl-title" text="From a shared spreadsheet to *two live products.*" className="nx-display nx-display--lg" />
          </div>
          <div className="nx-timeline__track" ref={lineRef}>
            <div className="nx-timeline__line" aria-hidden="true">
              <i />
            </div>
            <ol>
              {timeline.map((m, i) => (
                <li key={m.year} data-r style={{ '--d': `${i * 120}ms` } as CSSProperties}>
                  <span className="nx-timeline__dot" aria-hidden="true" />
                  <p className="nx-timeline__year nx-num">{m.year}</p>
                  <h3 className="nx-display nx-display--sm">{m.title}</h3>
                  <p>{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <figure className="nx-shot" data-r>
            <img src={miShot} width="1600" height="1000" loading="lazy" alt="Trahdo Market Intelligence, the first product" />
          </figure>
        </div>
      </section>

      <section className="nx-section nx-belief">
        <div className="nx-wrap nx-principles">
          <div className="nx-principles__aside">
            <Eyebrow>What we believe</Eyebrow>
            <Rise text="The principles behind *every decision.*" className="nx-display nx-display--md" />
          </div>
          <ol>
            {principles.map((p, i) => (
              <li key={p.title} data-r>
                <span className="nx-num">0{i + 1}</span>
                <h3 className="nx-display nx-display--sm">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Closing title="Come see what *we are building.*">
        <Btn to={to('/#start')}>{CTA_LABEL}</Btn>
        <Btn to={to('/careers')} variant="ghost">
          Careers
        </Btn>
      </Closing>
    </main>
  )
}

/* ============================================================= security == */

type Lane = (typeof securityLanes)['intelligence']

function LaneCard({ lane, tone }: { lane: Lane; tone: 'mi' | 'adv' }) {
  return (
    <article className={`nx-lane nx-lane--${tone}`} data-r>
      <p className="nx-lane__name">
        <Mark /> {lane.name}
      </p>
      <h3 className="nx-display nx-display--md">{lane.heading}</h3>
      <ol>
        {lane.steps.map((s, i) => (
          <li key={s.title} style={{ '--i': i } as CSSProperties}>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </li>
        ))}
        <li className="nx-lane__end">
          <h4>Your money</h4>
          <p>No path from this product to it.</p>
        </li>
      </ol>
    </article>
  )
}

export function Security() {
  useTitle('Security | Trahdo')
  return (
    <main id="main">
      <PageHero
        eyebrow="Security"
        title="Built to protect *both sides of investing.*"
        lede="Neither product can move your money. Market Intelligence keeps you informed and is read-only. F&O Advisor shows calls and trade plans, and never places an order for you."
      >
        <Btn to={to('/security#protections')}>See how we protect you</Btn>
        <Btn to={to('/security#contact')} variant="ghost">
          Report a vulnerability
        </Btn>
      </PageHero>

      <section id="protections" className="nx-section">
        <div className="nx-wrap">
          <div className="nx-head">
            <Eyebrow>One standard, different jobs</Eyebrow>
            <Rise text="Protected differently, because they *do different jobs.*" className="nx-display nx-display--lg" />
          </div>
          <div className="nx-lanes">
            <LaneCard lane={securityLanes.intelligence} tone="mi" />
            <LaneCard lane={securityLanes.advisor} tone="adv" />
          </div>
        </div>
      </section>

      <section className="nx-night">
        <div className="nx-section nx-wrap">
          <div className="nx-head">
            <Eyebrow tone="ember">Compliance</Eyebrow>
            <Rise text="Open about how we keep *our products safe.*" className="nx-display nx-display--lg" />
            <p className="nx-lede" data-r>
              Market Intelligence signs you in with email or Google. F&amp;O Advisor accounts are created from inside the app by
              someone who already has one. These pages are being prepared, and each will be published here as it is ready.
            </p>
          </div>
          <ul className="nx-trust">
            {trustCentre.map((t) => (
              <li key={t.title} data-r>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
                {t.title === 'Status and incidents' && LINKS.statusPage ? (
                  <a className="nx-tag" href={LINKS.statusPage} target="_blank" rel="noopener noreferrer">
                    Open ↗
                  </a>
                ) : (
                  <span className="nx-tag">In preparation</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact">
        <Closing title="Found something *that worries you?*">
          {LINKS.securityContact ? (
            <Btn href={LINKS.securityContact}>Report a vulnerability</Btn>
          ) : (
            <span className="nx-btn nx-btn--ghost is-disabled" role="note">
              Reporting channel: coming
            </span>
          )}
          <Btn to={to('/#start')} variant="ghost">
            {CTA_LABEL}
          </Btn>
        </Closing>
      </section>
    </main>
  )
}

/* ============================================================== careers == */

export function Careers() {
  useTitle('Careers | Trahdo')
  return (
    <main id="main">
      <PageHero
        eyebrow="Careers"
        title="No open roles *yet.*"
        lede="We are a small team building fast, and this page has not caught up yet. Open roles, culture and how we work will land here."
      >
        {LINKS.careersContact ? <Btn href={LINKS.careersContact}>Get in touch</Btn> : <Btn to={to('/about')}>Read our story</Btn>}
        <Btn to={to('/')} variant="ghost">
          Back to home
        </Btn>
      </PageHero>
      <div className="nx-flat" aria-hidden="true">
        <i />
        <b />
      </div>
      <section className="nx-section">
        <div className="nx-wrap nx-principles">
          <div className="nx-principles__aside">
            <Eyebrow>How we build</Eyebrow>
            <Rise text="What you can expect *to find here.*" className="nx-display nx-display--md" />
          </div>
          <ol>
            {careersHow.map((p, i) => (
              <li key={p.title} data-r>
                <span className="nx-num">0{i + 1}</span>
                <h3 className="nx-display nx-display--sm">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}

/* ============================================================ not found == */

export function NotFound() {
  useTitle('Page not found | Trahdo')
  return (
    <main id="main">
      <PageHero eyebrow="404 · Off the chart" title="This page is *not on the chart.*" lede="The page you are looking for was moved, renamed, or never existed.">
        <Btn to={to('/')}>Back to home</Btn>
        <Btn to={to('/#products')} variant="ghost">
          Products
        </Btn>
      </PageHero>
    </main>
  )
}
