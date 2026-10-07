import { LINKS } from '../../lib/links'
import { Arrow, External, Mark } from '../Mark'
import emberLight from '../../assets/ember-light.webp'
import { SERIES, SESSION_MINUTES, linePath, rangeOf } from '../../session/data'

const W = 1000
const H = 160
const [lo, hi] = rangeOf(SERIES.NIFTY.price, 0, SESSION_MINUTES)
const DAY = linePath(SERIES.NIFTY.price, 0, SESSION_MINUTES, W, H, lo - 0.1, hi + 0.1, 10)
const DAY_AREA = `${DAY}L${W} ${H}L0 ${H}Z`

/*
 * Act 7: the bell. It mirrors the opening: centred, one warm light, a dotted dome. The day's
 * line has completed along the bottom, and the page offers its two real doors, each on its own
 * product ground. The last cue is greet-and-hold so the final screen never empties.
 */
export default function Close() {
  return (
    <section
      id="get-started"
      className="act close"
      data-sc-act="pin"
      data-sc-span="1.3"
      data-sc-drift="#0d0907"
      data-t0="375"
      data-t1="375"
      data-pinned="true"
      aria-labelledby="close-title"
    >
      <div data-sc-stage className="close__stage">
        <div className="close__glow" aria-hidden="true">
          <img src={emberLight} width="1540" height="1021" alt="" loading="lazy" />
        </div>
        <div className="close__dots" aria-hidden="true" />
        <svg className="close__day" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="close-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sc-accent)" stopOpacity="0.22" />
              <stop offset="1" stopColor="var(--sc-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={DAY_AREA} fill="url(#close-fill)" />
          <path d={DAY} className="close__stroke" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="close__copy" data-sc-cue="0 1 0 0">
          <p className="label mono">15:30 · Market closed</p>
          <h2 id="close-title" className="display display--xl">
            That was a whole day, in one place.
          </h2>
          <p className="lede">Research it. Trade it. Know the risk. Start with the product that is live today.</p>

          <div className="close__doors">
            <article className="door door--mi">
              <header className="door__id">
                <Mark />
                <span>
                  trahdo <small>Market Intelligence</small>
                </span>
              </header>
              <p className="door__status">
                <i /> Live now
              </p>
              <a className="btn btn--mi" href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
                Open Market Intelligence
                <External />
              </a>
            </article>

            <article className="door door--app">
              <header className="door__id">
                <Mark />
                <span>
                  trahdo <small>App</small>
                </span>
              </header>
              <p className="door__status">
                <i /> Coming soon
              </p>
              {LINKS.appNotify ? (
                <a className="btn btn--primary" href={LINKS.appNotify} target="_blank" rel="noopener noreferrer">
                  Get notified
                  <Arrow />
                </a>
              ) : (
                <span className="btn" aria-disabled="true" role="note">
                  Launch details coming
                </span>
              )}
            </article>

            <article className="door door--adv">
              <header className="door__id">
                <Mark />
                <span>
                  trahdo <small>F&amp;O Advisor</small>
                </span>
              </header>
              <p className="door__status">
                <i /> Coming soon
              </p>
              {LINKS.advisorNotify ? (
                <a className="btn btn--adv" href={LINKS.advisorNotify} target="_blank" rel="noopener noreferrer">
                  Get notified
                  <Arrow />
                </a>
              ) : (
                <span className="btn" aria-disabled="true" role="note">
                  Launch details coming
                </span>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
