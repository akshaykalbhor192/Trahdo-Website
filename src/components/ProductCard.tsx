import type { ReactNode } from 'react'
import Reveal from './Reveal'

export default function ProductCard({
  eyebrow,
  name,
  tagline,
  description,
  href,
  reverse = false,
  external = false,
  visual,
}: {
  eyebrow: string
  name: string
  tagline: string
  description: string
  href: string
  reverse?: boolean
  external?: boolean
  visual: ReactNode
}) {
  return (
    <Reveal>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="group grid items-center gap-10 rounded-3xl border border-cream/10 bg-cream/5 p-8 transition-colors hover:bg-cream/8 sm:p-12 lg:grid-cols-2 lg:gap-16"
      >
        <div className={reverse ? 'lg:order-2' : ''}>{visual}</div>

        <div className={reverse ? 'lg:order-1' : ''}>
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
            {eyebrow}
          </span>
          <h3 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            {name}
          </h3>
          <p className="mt-2 text-lg text-cream-muted">{tagline}</p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream-muted/80">
            {description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-cream">
            Visit product
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
          </span>
        </div>
      </a>
    </Reveal>
  )
}
