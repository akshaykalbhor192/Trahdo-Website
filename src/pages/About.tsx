import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import AboutTimeline from '../components/AboutTimeline'

const values = [
  {
    title: 'Built by traders',
    description:
      'Every feature ships because someone on the team needed it first — not because a roadmap said so.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12h4l2-7 4 14 2-7h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Transparent pricing',
    description:
      'The spread you see before you click is the spread you get filled at. No hidden fees, ever.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="17" r="2.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M18 6 6 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Regulated & secure',
    description:
      'Client funds are held separately, every trade is logged end-to-end, and support is a real person.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'One dashboard, not a dozen',
    description:
      'Research, trade, and track without juggling five tabs and five different logins to do it.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 3 8l9 5 9-5-9-5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M3 12l9 5 9-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function About() {
  return (
    <main className="bg-ink">
      <section
        data-theme="dark"
        className="flex min-h-[85vh] flex-col justify-center bg-ink px-6 sm:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-[1800px]">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
              About Trahdo
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl">
              Moving markets, money and every investor forward.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream-muted">
              We&apos;re a small team building the infrastructure we wished
              existed when we started investing — research, execution and
              portfolio tracking that all speak to each other, instead of
              fighting for a tab.
            </p>
          </Reveal>
        </div>

        <div className="scroll-cue mx-auto mt-16 flex flex-col items-center gap-2 text-cream-muted/50">
          <span className="font-mono text-[10px] uppercase tracking-wider">
            Scroll
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 6 8 10.5 12.5 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      <section
        data-theme="light"
        className="bg-paper px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="mx-auto max-w-[1800px]">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
              Our story
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              From a shared spreadsheet to three products.
            </h2>
          </Reveal>

          <div className="mt-16 max-w-2xl lg:mt-20">
            <AboutTimeline />
          </div>
        </div>
      </section>

      <section
        data-theme="dark"
        className="bg-ink px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
      >
        <div className="mx-auto max-w-[1800px]">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
              What we believe
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl">
              The principles behind every product decision.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 100}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-ember-light">
                  {value.icon}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-cream">
                  {value.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cream-muted/70">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        data-theme="light"
        className="flex min-h-screen flex-col justify-center bg-paper px-6 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-[1800px]">
          <Reveal>
            <div className="max-w-2xl">
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-ember">
                <path
                  d="M0 24V14.4C0 6.4 4.8 1.2 12.8 0L14 3.2C9.6 4.4 7.2 7.2 6.8 11.2H14V24H0ZM18 24V14.4C18 6.4 22.8 1.2 30.8 0L32 3.2C27.6 4.4 25.2 7.2 24.8 11.2H32V24H18Z"
                  fill="currentColor"
                />
              </svg>

              <span className="mt-6 block font-mono text-xs font-medium uppercase tracking-wider text-ember">
                A letter from our founder
              </span>

              <p className="mt-6 font-display text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
                Every investing app I&apos;d used before felt like it was
                built for someone else.
              </p>

              <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/70">
                <p>
                  A broker&apos;s quarterly numbers, an advertiser&apos;s
                  engagement targets, anyone but the person actually holding
                  the portfolio. Trahdo started as a spreadsheet a few of us
                  shared to track our own trades, because nothing else told
                  us the truth fast enough.
                </p>
                <p>
                  Today it&apos;s the same idea, just built for everyone
                  who&apos;s ever refreshed five tabs to check one price. We
                  don&apos;t think that&apos;s a small problem — it&apos;s
                  the whole reason we started.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 font-mono text-xs font-medium text-ink/70">
                  AB
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">No Name</p>
                  <p className="text-sm text-ink/50">Founder &amp; CEO, Trahdo</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        data-theme="dark"
        className="flex min-h-[60vh] flex-col justify-center bg-ink px-6 py-24 text-center sm:px-8 lg:px-12"
      >
        <div className="mx-auto w-full max-w-2xl">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl">
              Come see what we&apos;re building.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-4 text-lg text-cream-muted">
              Three products, one mission. Pick the one that fits how you
              invest.
            </p>
          </Reveal>

          <Reveal delay={200} className="mt-8 flex justify-center">
            <Link
              to="/#products"
              className="rounded-full bg-ember px-8 py-4 font-semibold text-cream shadow-lg shadow-ember/30 transition-transform hover:scale-[1.02]"
            >
              Explore our products
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
