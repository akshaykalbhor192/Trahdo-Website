import Reveal from './Reveal'

export default function ClosingCta() {
  return (
    <section
      data-theme="dark"
      className="flex min-h-screen flex-col justify-center bg-ink px-6 py-24 text-center sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto w-full max-w-2xl">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl">
            Pick your product. Start in minutes.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-4 text-lg text-cream-muted">
            No account minimums, no paperwork sent by mail. Open an account
            and place your first trade today.
          </p>
        </Reveal>

        <Reveal delay={200} className="mt-8 flex justify-center">
          <a
            href="#get-started"
            className="rounded-full bg-ember px-8 py-4 font-semibold text-cream shadow-lg shadow-ember/30 transition-transform hover:scale-[1.02]"
          >
            Start trading
          </a>
        </Reveal>
      </div>
    </section>
  )
}
