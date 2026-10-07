import { Link } from 'react-router-dom'
import { LINKS } from '../../lib/links'
import { Arrow, External, Mark } from '../Mark'

/*
 * Act 3. The turn: three products, one session. Each product identity appears for the first
 * time, side by side, on its own ground. Market Intelligence is live; Trahdo App and F&O
 * Advisor are coming soon, and say so. The two warmer panes arrive by a wipe, because this is
 * the beat where one thing becomes three parts of one thing.
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
            Research it. Trade it. Know the risk.
          </h2>
          <p className="lede">
            Three products for one market day, built to fit together instead of fighting for a tab.
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
              One dashboard for live indices, AI-generated briefs, and alerts that catch what you would
              miss. Real-time NSE/BSE data, smart alerts, and an AI copilot that explains why.
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

          <article className="product product--app" data-sc-reveal="left" data-sc-reveal-at="0.2 0.46">
            <header className="product__id">
              <Mark />
              <span>
                trahdo <small>App</small>
              </span>
            </header>
            <h3 className="display display--md">A terminal built for speed.</h3>
            <p className="body">
              Buy and sell with the live market in front of you, in one click. A full trading terminal for
              people who live in the market all day.
            </p>
            <div className="product__foot">
              <span className="product__status">
                <i /> Coming soon
              </span>
              {LINKS.appNotify ? (
                <a className="btn btn--primary" href={LINKS.appNotify} target="_blank" rel="noopener noreferrer">
                  Get notified
                  <External />
                </a>
              ) : (
                <Link className="btn btn--ghost" to="/#trade">
                  Preview the ticket
                  <Arrow />
                </Link>
              )}
            </div>
          </article>

          <article className="product product--adv" data-sc-reveal="left" data-sc-reveal-at="0.3 0.56">
            <header className="product__id">
              <Mark />
              <span>
                trahdo <small>F&amp;O Advisor</small>
              </span>
            </header>
            <h3 className="display display--md">Know the risk before you trade.</h3>
            <p className="body">
              F&amp;O Advisor explains futures and options positions and their risk in plain language.
            </p>
            <div className="product__foot">
              <span className="product__status">
                <i /> Coming soon
              </span>
              {LINKS.advisorNotify ? (
                <a className="btn btn--adv" href={LINKS.advisorNotify} target="_blank" rel="noopener noreferrer">
                  Get notified
                  <External />
                </a>
              ) : (
                <Link className="btn btn--ghost" to="/#advisor">
                  Try the explainer
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
