import { Link } from 'react-router-dom'
import { LINKS } from '../../lib/links'
import { Arrow, External, Mark } from '../Mark'

/*
 * Act 3. The turn: two products, one session. Both product identities appear for the first
 * time, side by side, each on its own ground. The warm pane arrives by a wipe, because this
 * is the beat where one thing becomes two halves of one thing.
 */
export default function Place() {
  return (
    <section
      id="products"
      className="act place"
      data-sc-act="flow"
      data-sc-drift="#0e0e10"
      data-t0="55"
      data-t1="55"
      aria-labelledby="place-title"
    >
      <div className="place__inner">
        <div className="place__head" data-sc-in data-sc-stagger="70">
          <h2 id="place-title" className="display display--lg">
            Research it. Trade it. Track it.
          </h2>
          <p className="lede">
            Research, execution and portfolio tracking that all speak to each other, instead of
            fighting for a tab.
          </p>
        </div>

        <div className="place__panes">
          <article className="product product--mi" data-sc-in>
            <header className="product__id">
              <Mark />
              <span>
                trahdo <small>Market Intelligence</small>
              </span>
            </header>
            <h3 className="display display--md">Markets move fast. Stay ahead of the close.</h3>
            <p className="body">
              One dashboard for live indices, AI-generated briefs, and alerts that catch what
              you would miss. Real-time NSE/BSE data, smart alerts, and an AI copilot that
              explains why.
            </p>
            <div className="product__foot">
              <span className="product__status">
                <i /> Live now
              </span>
              <a className="btn btn--mi" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
                Open Market Intelligence
                <External />
              </a>
            </div>
          </article>

          <article className="product product--app" data-sc-reveal="left" data-sc-reveal-at="0.22 0.5">
            <header className="product__id">
              <Mark />
              <span>
                trahdo <small>App</small>
              </span>
            </header>
            <h3 className="display display--md">A terminal built for speed.</h3>
            <p className="body">
              Level 2 order books, scanners, and one-click execution. A full trading terminal
              for people who live in the market all day.
            </p>
            <div className="product__foot">
              <span className="product__status">
                <i /> Early access
              </span>
              {LINKS.appEarlyAccess ? (
                <a className="btn btn--primary" href={LINKS.appEarlyAccess} target="_blank" rel="noopener noreferrer">
                  Join early access
                  <External />
                </a>
              ) : (
                <Link className="btn btn--ghost" to="/#trade">
                  See the ticket
                  <Arrow />
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
