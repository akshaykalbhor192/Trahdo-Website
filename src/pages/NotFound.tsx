import { Link } from 'react-router-dom'
import ScrollCraftRoot from '../components/ScrollCraftRoot'
import { Arrow } from '../components/Mark'

/* 404. The session line leaves the chart. */
const PATH = 'M0 120 L90 104 L150 112 L230 84 L300 92 L380 60 L440 70 L520 40 L560 48 L600 30 L640 160 L650 400'

export default function NotFound() {
  return (
    <ScrollCraftRoot className="notfound" title="Page not found | Trahdo">
      <main id="main">
        <section className="page-hero act" data-sc-act="flow" data-sc-drift="#0c0b0b" aria-labelledby="nf-title">
          <div className="page-hero__inner" data-sc-in data-sc-stagger="80">
            <p className="label mono">404 · Off the chart</p>
            <h1 id="nf-title" className="display display--xl">
              This page is not on the chart.
            </h1>
            <p className="lede">
              The page you are looking for was moved, renamed, or never existed. The rest of the
              day is right where you left it.
            </p>
            <div className="page-hero__row">
              <Link to="/" className="btn btn--primary">
                Back to home
                <Arrow />
              </Link>
              <Link to="/#products" className="textlink">
                Products
                <Arrow size={14} />
              </Link>
              <Link to="/about" className="textlink">
                About
                <Arrow size={14} />
              </Link>
              <Link to="/security" className="textlink">
                Security
                <Arrow size={14} />
              </Link>
            </div>
          </div>
          <svg className="dropline" viewBox="0 0 700 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
            <path d={PATH} vectorEffect="non-scaling-stroke" />
          </svg>
        </section>
      </main>
    </ScrollCraftRoot>
  )
}
