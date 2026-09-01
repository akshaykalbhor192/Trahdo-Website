import Reveal from './Reveal'
import FeatureVisual from './FeatureVisual'

const steps = [
  {
    index: '01',
    title: 'Research',
    description:
      'Live quotes, earnings, and analyst calls in one feed — no more switching between five tabs to check a price.',
  },
  {
    index: '02',
    title: 'Trade',
    description:
      'Place stock, ETF, and options orders in milliseconds, with the spread shown upfront, never hidden in the fill.',
  },
  {
    index: '03',
    title: 'Track',
    description:
      'Performance, risk, and tax lots update the moment they change, not at the end of the month.',
  },
]

export default function Features() {
  return (
    <section
      data-theme="light"
      className="flex min-h-screen flex-col justify-center bg-paper px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
                What you get
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
                From idea to portfolio, in three steps.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
                One dashboard for the whole lifecycle of an investment — from
                the first idea to the moment you check your return.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <FeatureVisual />
          </Reveal>
        </div>

        <div className="mt-20 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.index} delay={160 + i * 120}>
              <div className="border-t border-ink/10 pt-6">
                <span className="font-mono text-sm text-ink/40">
                  {step.index}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/60">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
