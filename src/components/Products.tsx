import Reveal from './Reveal'
import ProductCard from './ProductCard'
import { useFocusScroll } from '../hooks/useFocusScroll'
import { textOpacity, imageOpacity } from '../lib/focusFade'
import { ProVisual } from './ProductVisual'
import MarketIntelligenceVisual from './MarketIntelligenceVisual'
import ComingSoonVisual from './ComingSoonVisual'

const products = [
  {
    eyebrow: 'Live now',
    name: 'Trahdo Market Intelligence',
    tagline: 'Markets move fast. Stay ahead of the close.',
    description:
      'One dashboard for live indices, AI-generated briefs, and alerts that catch what you’d miss — real-time NSE/BSE data, smart alerts, and an AI copilot that explains why.',
    href: 'https://unicorn-dashboard-rust.vercel.app/',
    external: true,
    visual: <MarketIntelligenceVisual />,
  },
  {
    eyebrow: 'Trading app',
    name: 'Trahdo App',
    tagline: 'A terminal built for speed.',
    description:
      'Trading App — for traders who live in the market all day.',
    href: '#',
    reverse: true,
    visual: <ProVisual />,
  },
  {
    eyebrow: 'Coming soon',
    name: 'Coming Soon',
    tagline: 'Smple Text.',
    description:
      'Something awesome is coming soon. Be the first to know',
    href: '#',
    visual: <ComingSoonVisual />,
  },
]

export default function Products() {
  const { itemRefs, distances } = useFocusScroll(products.length, 0.5)

  return (
    <section
      id="products"
      data-theme="dark"
      className="scroll-mt-24 bg-ink px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-[1800px]">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
            Our products
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl">
            Three ways to invest, one company behind them.
          </h2>
        </Reveal>

        {/* Desktop: scrolling focus-fade list + sticky image */}
        <div className="mt-8 hidden lg:grid lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            {products.map((product, i) => (
              <div
                key={product.name}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                className="flex min-h-[70vh] flex-col justify-center"
              >
                <a
                  href={product.href}
                  target={product.external ? '_blank' : undefined}
                  rel={product.external ? 'noopener noreferrer' : undefined}
                  className="group block"
                  style={{
                    opacity: textOpacity(distances[i] ?? 9999),
                    pointerEvents:
                      (distances[i] ?? 9999) < 240 ? 'auto' : 'none',
                  }}
                >
                  <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
                    {product.eyebrow}
                  </span>
                  <h3 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-cream xl:text-5xl">
                    {product.tagline}
                  </h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream-muted/80">
                    {product.description}
                  </p>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-sm font-semibold text-cream transition-colors group-hover:bg-cream/10">
                    Visit {product.name}
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
                </a>
              </div>
            ))}
          </div>

          <div className="sticky top-52 self-start">
            <div className="grid">
              {products.map((product, i) => (
                <div
                  key={product.name}
                  className="[grid-area:1/1]"
                  style={{ opacity: imageOpacity(distances[i] ?? 9999) }}
                >
                  {product.visual}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / tablet: simple stacked list, no scroll-linked fade */}
        <div className="mt-16 flex flex-col gap-8 lg:hidden">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
