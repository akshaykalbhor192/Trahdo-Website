import Reveal from './Reveal'

const pillars = [
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
]

export default function AboutTrahdo() {
  return (
    <section
      id="about"
      data-theme="dark"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
      style={{
        backgroundImage:
          'radial-gradient(55% 50% at 88% 0%, rgba(200,112,60,0.22), transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(227,161,95,0.14), transparent 60%)',
      }}
    >
      <div className="relative mx-auto w-full max-w-[1800px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
                About Trahdo
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl">
                Moving markets, money and every investor forward.
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-col justify-end">
            <Reveal delay={160}>
              <p className="max-w-md text-lg leading-relaxed text-cream-muted/80">
                We&apos;re a small team building the infrastructure we wished
                existed when we started investing — research, execution and
                portfolio tracking that all speak to each other, instead of
                fighting for a tab.
              </p>
            </Reveal>

            <Reveal delay={240} className="mt-6">
              <a
                href="#products"
                className="group inline-flex w-fit items-center gap-2 font-semibold text-cream transition-colors hover:text-ember-light"
              >
                Learn more
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-3 sm:gap-8">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 100}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-ember-light">
                {pillar.icon}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-cream">
                {pillar.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-cream-muted/70">
                {pillar.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
