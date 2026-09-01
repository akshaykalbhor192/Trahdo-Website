import Reveal from './Reveal'

export default function Stats() {
  return (
    <section
      data-theme="light"
      className="flex min-h-screen flex-col justify-center bg-paper px-6 py-20 sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid w-full max-w-[1800px] gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div className="border-t border-ink/10 pt-6">
            <svg
              width="32"
              height="24"
              viewBox="0 0 32 24"
              fill="none"
              className="text-ember"
            >
              <path
                d="M0 24V14.4C0 6.4 4.8 1.2 12.8 0L14 3.2C9.6 4.4 7.2 7.2 6.8 11.2H14V24H0ZM18 24V14.4C18 6.4 22.8 1.2 30.8 0L32 3.2C27.6 4.4 25.2 7.2 24.8 11.2H32V24H18Z"
                fill="currentColor"
              />
            </svg>
            <p className="mt-6 max-w-md font-display text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
              I closed four other trading apps the week I switched to Trahdo.
              Quotes, orders, my actual P&amp;L — it all finally lives in one
              place.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 font-mono text-xs font-medium text-ink/70">
                AK
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Akshay Kalbhor</p>
                <p className="text-sm text-ink/50">
                  Full-time trader, on Trahdo
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="border-t border-ink/10 pt-6">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
              A note from our founder
            </span>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              Every investing app I&apos;d used before felt like it was built
              for someone else — a broker&apos;s quarterly numbers, an
              advertiser&apos;s engagement targets, anyone but the person
              actually holding the portfolio. Trahdo started as a spreadsheet
              three of us shared to track our own trades, because nothing
              else told us the truth fast enough. Today it&apos;s the same
              idea, just built for everyone who&apos;s ever refreshed five
              tabs to check one price.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 font-mono text-xs font-medium text-ink/70">
                AB
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">No Name</p>
                <p className="text-sm text-ink/50">founder &amp; CEO, Trahdo</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
