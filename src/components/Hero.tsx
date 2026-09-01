import heroBg from '../assets/hero-bg.png'

export default function Hero() {
  return (
    <section
      data-theme="dark"
      className="relative min-h-screen bg-ink bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] flex-col px-6 sm:px-8 lg:px-12">
        <div className="flex flex-1 flex-col justify-center pt-24 pb-24">
          <span className="reveal inline-flex w-fit items-center gap-2 rounded-full border border-cream/40 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-cream/90">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-ember" />
            Now in early access
          </span>

          <h1 className="reveal mt-8 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-cream [animation-delay:120ms] sm:text-6xl lg:text-7xl">
            Investing built for the way markets actually move.
          </h1>

          <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-cream-muted [animation-delay:240ms]">
            Trahdo gives you one place to research, trade and track your
            portfolio — without the sprawl of a dozen disconnected apps.
          </p>

          <div className="reveal mt-10 flex flex-wrap items-center gap-4 [animation-delay:360ms]">
            <a
              href="#get-started"
              className="rounded-full bg-ember px-7 py-3.5 font-semibold text-cream shadow-lg shadow-ember/30 transition-transform hover:scale-[1.02]"
            >
              Start trading
            </a>
            <a
              href="#product"
              className="rounded-full border border-cream/50 px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              See live markets
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
