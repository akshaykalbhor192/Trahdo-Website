import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { LINKS, CTA_LABEL } from '../lib/links'
import { Mark } from '../components/Mark'
import { careersHow, principles, securityLanes, teamNote, timeline, trustCentre } from '../content'
import { spotlight, useProgress } from '../v2/motion'
import { Btn, Label, Title, to } from './ui'
import miShot from '../assets/market-intelligence.webp'

function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

function PageHero({ label, title, lede, scene, children }: { label: string; title: string; lede: string; scene: string; children?: ReactNode }) {
  return (
    <section className="q-phero">
      <div className="q-wrap q-phero__grid">
        <div className="q-phero__copy">
          <Label>{label}</Label>
          <Title as="h1" text={title} className="q-h1" delay={120} />
          <p className="q-lede" data-r style={{ '--d': '380ms' } as CSSProperties}>
            {lede}
          </p>
          {children ? (
            <div className="q-row" data-r style={{ '--d': '480ms' } as CSSProperties}>
              {children}
            </div>
          ) : null}
        </div>
        <div className="q-phero__scene" data-scene={scene} aria-hidden="true" />
      </div>
    </section>
  )
}

function Closing({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="q-close q-close--page">
      <div className="q-close__mark" data-scene="mark" aria-hidden="true" />
      <div className="q-wrap q-close__inner">
        <Title text={title} className="q-h1" />
        <div className="q-row q-row--center" data-r>
          {children}
        </div>
      </div>
    </section>
  )
}

function Cards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="q-cards">
      {items.map((p, i) => (
        <li key={p.title} className="q-card" onPointerMove={spotlight} data-r style={{ '--d': `${i * 80}ms` } as CSSProperties}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </li>
      ))}
    </ul>
  )
}

/* ================================================================ about == */

export function About() {
  useTitle('About | Trahdo')
  const tlRef = useRef<HTMLOListElement>(null)
  useProgress(tlRef, 'pass')
  return (
    <main id="main">
      <PageHero
        label="About Trahdo"
        title="Moving every investor *forward.*"
        lede="We are a small team building what we wished existed when we started investing: research and calls that speak to each other, instead of fighting for a tab."
        scene="line"
      />
      <section className="q-section">
        <div className="q-wrap q-note">
          <Title text={teamNote.lead} className="q-h2" />
          <div className="q-note__body">
            {teamNote.body.map((p) => (
              <p key={p} data-r>
                {p}
              </p>
            ))}
            <p className="q-note__sign" data-r>
              <span className="q-logo__mark">
                <Mark />
              </span>
              The Trahdo team
            </p>
          </div>
        </div>
      </section>
      <section className="q-section">
        <div className="q-wrap">
          <div className="q-head">
            <Label>Our story</Label>
            <Title text="From a shared spreadsheet to *two live products.*" className="q-h2" />
          </div>
          <ol className="q-timeline" ref={tlRef}>
            <i className="q-timeline__line" aria-hidden="true" />
            {timeline.map((m, i) => (
              <li key={m.year} data-r style={{ '--d': `${i * 120}ms` } as CSSProperties}>
                <span className="q-timeline__year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
          <figure className="q-frame" data-r>
            <img src={miShot} width="1600" height="1000" loading="lazy" alt="Trahdo Market Intelligence, the first product" />
          </figure>
        </div>
      </section>
      <section className="q-section">
        <div className="q-wrap">
          <div className="q-head">
            <Label>What we believe</Label>
            <Title text="The principles behind *every decision.*" className="q-h2" />
          </div>
          <Cards items={principles} />
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

function LaneCard({ lane }: { lane: Lane }) {
  return (
    <article className="q-card q-lane" onPointerMove={spotlight} data-r>
      <p className="q-prod__name">
        <span className="q-logo__mark">
          <Mark />
        </span>
        {lane.name}
      </p>
      <h3 className="q-h3">{lane.heading}</h3>
      <ol>
        {lane.steps.map((s) => (
          <li key={s.title}>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
          </li>
        ))}
        <li className="q-lane__end">
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
        label="Security"
        title="Built to protect *both sides of investing.*"
        lede="Neither product can move your money. Market Intelligence is read-only. F&O Advisor shows calls and trade plans, and never places an order for you."
        scene="orb"
      >
        <Btn to={to('/security#protections')}>See how we protect you</Btn>
        <Btn to={to('/security#contact')} variant="ghost">
          Report a vulnerability
        </Btn>
      </PageHero>
      <section id="protections" className="q-section">
        <div className="q-wrap">
          <div className="q-head">
            <Label tone="jade">One standard, different jobs</Label>
            <Title text="Protected differently, because they *do different jobs.*" className="q-h2" />
          </div>
          <div className="q-lanes">
            <LaneCard lane={securityLanes.intelligence} />
            <LaneCard lane={securityLanes.advisor} />
          </div>
        </div>
      </section>
      <section className="q-section">
        <div className="q-wrap">
          <div className="q-head q-head--split">
            <div>
              <Label>Compliance</Label>
              <Title text="Open about how we keep *our products safe.*" className="q-h2" />
            </div>
            <p className="q-lede" data-r>
              Market Intelligence signs you in with email or Google. F&amp;O Advisor accounts are created from inside the app by someone who
              already has one. These pages are being prepared, and each will be published here as it is ready.
            </p>
          </div>
          <ul className="q-cards">
            {trustCentre.map((t, i) => (
              <li key={t.title} className="q-card" onPointerMove={spotlight} data-r style={{ '--d': `${i * 80}ms` } as CSSProperties}>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
                {t.title === 'Status and incidents' && LINKS.statusPage ? (
                  <a className="q-tag" href={LINKS.statusPage} target="_blank" rel="noopener noreferrer">
                    Open ↗
                  </a>
                ) : (
                  <span className="q-tag">In preparation</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div id="contact">
        <Closing title="Found something *that worries you?*">
          {LINKS.securityContact ? (
            <Btn href={LINKS.securityContact}>Report a vulnerability</Btn>
          ) : (
            <span className="q-tag q-tag--lg" role="note">
              Reporting channel: coming
            </span>
          )}
          <Btn to={to('/#start')} variant="ghost">
            {CTA_LABEL}
          </Btn>
        </Closing>
      </div>
    </main>
  )
}

/* ============================================================== careers == */

export function Careers() {
  useTitle('Careers | Trahdo')
  return (
    <main id="main">
      <PageHero
        label="Careers"
        title="No open roles *yet.*"
        lede="We are a small team building fast, and this page has not caught up yet. Open roles, culture and how we work will land here."
        scene="weigh"
      >
        {LINKS.careersContact ? <Btn href={LINKS.careersContact}>Get in touch</Btn> : <Btn to={to('/about')}>Read our story</Btn>}
        <Btn to={to('/')} variant="ghost">
          Back to home
        </Btn>
      </PageHero>
      <section className="q-section">
        <div className="q-wrap">
          <div className="q-head">
            <Label>How we build</Label>
            <Title text="What you can expect *to find here.*" className="q-h2" />
          </div>
          <Cards items={careersHow} />
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
      <PageHero label="404 · Off the chart" title="This page is *off the chart.*" lede="The page you are looking for was moved, renamed, or never existed." scene="noise">
        <Btn to={to('/')}>Back to home</Btn>
        <Btn to={to('/#products')} variant="ghost">
          Products
        </Btn>
      </PageHero>
    </main>
  )
}
