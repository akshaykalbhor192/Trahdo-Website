import { Link } from 'react-router-dom'
import { LINKS } from '../lib/links'
import { Arrow, Mark } from './Mark'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div>
            <Link to="/" className="wordmark" aria-label="Trahdo home">
              <Mark />
              <span>trahdo</span>
            </Link>
            <p className="footer__lede">
              Three products, one session. Research it, trade it, understand the risk.
            </p>
            {LINKS.social.length ? (
              <ul className="footer__social">
                {LINKS.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} rel="noopener noreferrer" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="footer__cols">
            <div>
              <h2 className="label">Products</h2>
              <ul>
                <li>
                  <a href={LINKS.marketIntelligence} target="_blank" rel="noopener noreferrer">
                    Market Intelligence
                  </a>
                </li>
                <li>
                  <Link to="/#trade">Trahdo App</Link>
                </li>
                <li>
                  <Link to="/#advisor">F&amp;O Advisor</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="label">Company</h2>
              <ul>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/careers">Careers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="label">Trust</h2>
              <ul>
                <li>
                  <Link to="/security">Security</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            Investing involves risk, including possible loss of principal. Trahdo Market
            Intelligence, Trahdo App and F&amp;O Advisor are products of Trahdo. Not FDIC insured. Not bank
            guaranteed. May lose value.
          </p>
          <div className="footer__meta">
            <span>© {new Date().getFullYear()} Trahdo</span>
            <button
              type="button"
              className="footer__top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            >
              Back to top
              <span style={{ display: 'inline-flex', transform: 'rotate(-90deg)' }}>
                <Arrow size={12} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
