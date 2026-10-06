import { Link } from 'react-router-dom'
import ScrollCraftRoot from '../components/ScrollCraftRoot'
import { Arrow } from '../components/Mark'
import { LINKS } from '../lib/links'
import { careersHow } from '../content'

/*
 * Careers. There are no roles to list, so the page says so. The line below is flat on
 * purpose: a session with nothing in it, and a cursor waiting at the end.
 */
export default function Careers() {
  return (
    <ScrollCraftRoot className="careers" title="Careers | Trahdo">
      <main id="main">
        <section className="page-hero page-hero--flat act" data-sc-act="flow" data-sc-drift="#0c0b0b" aria-labelledby="careers-title">
          <div className="page-hero__inner" data-sc-in data-sc-stagger="80">
            <h1 id="careers-title" className="display display--xl">
              No open roles yet.
            </h1>
            <p className="lede">
              We are a small team building fast, and this page has not caught up yet. Open roles,
              culture and how we work will land here.
            </p>
            <div className="page-hero__row">
              {LINKS.careersContact ? (
                <a className="btn btn--primary" href={LINKS.careersContact}>
                  Get in touch
                  <Arrow />
                </a>
              ) : (
                <Link to="/about" className="btn btn--primary">
                  Read our story
                  <Arrow />
                </Link>
              )}
              <Link to="/" className="textlink">
                Back to home
                <Arrow size={14} />
              </Link>
            </div>
          </div>
          <div className="flatline" aria-hidden="true">
            <i />
            <b />
          </div>
        </section>

        <section className="beliefs act" data-sc-act="flow" data-sc-drift="#0e0a07" aria-labelledby="how-title">
          <div className="beliefs__inner">
            <div className="beliefs__head" data-sc-in data-sc-stagger="70">
              <p className="label">How we build</p>
              <h2 id="how-title" className="display display--lg">
                What you can expect to find here.
              </h2>
            </div>
            <dl className="beliefs__list" data-sc-in data-sc-stagger="70">
              {careersHow.map((p) => (
                <div key={p.title} className="beliefs__row">
                  <dt className="display display--sm">{p.title}</dt>
                  <dd className="body">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </ScrollCraftRoot>
  )
}
