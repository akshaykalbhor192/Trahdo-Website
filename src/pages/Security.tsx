import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import ScrollCraftRoot from '../components/ScrollCraftRoot'
import { Arrow, External } from '../components/Mark'
import { LINKS, CTA_LABEL } from '../lib/links'
import { securityLanes, trustCentre } from '../content'

/*
 * Security. Two products do different jobs, so they are protected differently. Each lane is
 * an ordered path: Market Intelligence ends at a wall (it never reaches your money), Trahdo
 * App passes every order through its checks. The steps are the previous site's own claims,
 * drawn as a path rather than a settings panel (the old panel was a painted fake).
 */

type Lane = (typeof securityLanes)['intelligence']

function LanePath({ lane, tone }: { lane: Lane; tone: 'mi' | 'app' }) {
  return (
    <article className={`lane lane--${tone}`} data-sc-in>
      <p className="label lane__name">{lane.name}</p>
      <h3 className="display display--md lane__title">{lane.heading}</h3>
      <ol className="lane__steps">
        {lane.steps.map((step, i) => (
          <li key={step.title} style={{ '--n': i } as CSSProperties}>
            <span className="lane__node" aria-hidden="true" />
            <h4>{step.title}</h4>
            <p className="body">{step.body}</p>
          </li>
        ))}
        <li className="lane__end" aria-label={tone === 'mi' ? 'Your money: no path from here' : 'Your money: protected account'}>
          <span className="lane__node lane__node--end" aria-hidden="true" />
          <h4>{tone === 'mi' ? 'Your money' : 'Your money, protected'}</h4>
          <p className="body">
            {tone === 'mi' ? 'No path from this product to it.' : 'Reached only through the steps above.'}
          </p>
        </li>
      </ol>
    </article>
  )
}

export default function Security() {
  return (
    <ScrollCraftRoot className="security" title="Security | Trahdo">
      <main id="main">
        <section className="page-hero act" data-sc-act="flow" data-sc-drift="#0c0b0b" aria-labelledby="sec-title">
          <div className="page-hero__inner" data-sc-in data-sc-stagger="80">
            <h1 id="sec-title" className="display display--xl">
              Built to protect both sides of investing.
            </h1>
            <p className="lede">
              Trahdo Market Intelligence keeps you informed without ever touching your money.
              Trahdo App executes real orders, and carries the custody-grade protections that
              come with it. One account, one security standard, two very different jobs.
            </p>
            <div className="page-hero__row">
              <a href="#protections" className="btn btn--primary">
                See how we protect you
                <Arrow />
              </a>
              <a href="#contact" className="textlink">
                Report a vulnerability
                <Arrow size={14} />
              </a>
            </div>
          </div>
        </section>

        <section id="protections" className="lanes act" data-sc-act="flow" data-sc-drift="#101114" aria-labelledby="lanes-title">
          <div className="lanes__inner">
            <div className="lanes__head" data-sc-in data-sc-stagger="70">
              <p className="label">Two products, one standard</p>
              <h2 id="lanes-title" className="display display--lg">
                Protected differently, because they do different jobs.
              </h2>
            </div>
            <div className="lanes__grid">
              <LanePath lane={securityLanes.intelligence} tone="mi" />
              <LanePath lane={securityLanes.app} tone="app" />
            </div>
          </div>
        </section>

        <section className="account act" data-sc-act="flow" data-sc-drift="#0e0a07" aria-labelledby="account-title">
          <div className="account__inner" data-sc-in data-sc-stagger="80">
            <h2 id="account-title" className="display display--lg">
              See and control everything, in one place.
            </h2>
            <p className="lede">
              One login for Trahdo Market Intelligence and Trahdo App. Review every active
              session, lock withdrawals to a trusted bank account, and get an alert the moment
              someone signs in from a new device.
            </p>
          </div>
        </section>

        <section className="trust act" data-sc-act="flow" data-sc-drift="#0e0a07" aria-labelledby="trust-title">
          <div className="trust__inner">
            <div className="trust__head" data-sc-in data-sc-stagger="70">
              <p className="label">Compliance</p>
              <h2 id="trust-title" className="display display--lg">
                Open about how we keep both products safe.
              </h2>
              <p className="body">
                These pages are being prepared. Each will be published here as it is ready.
              </p>
            </div>
            <ul className="trust__list" data-sc-in data-sc-stagger="70">
              {trustCentre.map((item) => (
                <li key={item.title}>
                  <div>
                    <h3 className="display display--sm">{item.title}</h3>
                    <p className="body">{item.body}</p>
                  </div>
                  <span className="tag mono">
                    {item.title === 'Status and incidents' && LINKS.statusPage ? (
                      <a href={LINKS.statusPage} target="_blank" rel="noopener noreferrer">
                        Open <External size={12} />
                      </a>
                    ) : (
                      'In preparation'
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="cta-block act" data-sc-act="flow" data-sc-drift="#0d0907" aria-labelledby="contact-title">
          <div className="cta-block__inner" data-sc-in data-sc-stagger="80">
            <h2 id="contact-title" className="display display--xl">
              Found something that worries you?
            </h2>
            <p className="lede">
              Our security team reads every report personally. We do not believe in legal threats
              for good-faith research.
            </p>
            <div className="cta-block__row">
              {LINKS.securityContact ? (
                <a className="btn btn--primary" href={LINKS.securityContact}>
                  Report a vulnerability
                  <Arrow />
                </a>
              ) : (
                <span className="btn" aria-disabled="true" role="note">
                  Reporting channel: coming
                </span>
              )}
              <Link to="/#get-started" className="textlink">
                {CTA_LABEL}
                <Arrow size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </ScrollCraftRoot>
  )
}
