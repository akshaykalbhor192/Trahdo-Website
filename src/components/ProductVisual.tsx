import type { ReactNode } from 'react'

export function BrowserFrame({
  children,
  shadowClassName = 'shadow-2xl shadow-black/40',
  padded = true,
  dark = false,
}: {
  children: ReactNode
  shadowClassName?: string
  padded?: boolean
  dark?: boolean
}) {
  if (dark) {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-cream/10 bg-cream/5 ${shadowClassName}`}
      >
        <div className="flex items-center gap-1.5 border-b border-cream/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
          <span className="ml-3 h-5 w-full max-w-48 rounded-full bg-cream/5" />
        </div>
        <div className={padded ? 'p-5' : ''}>{children}</div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-cream/10 bg-paper ${shadowClassName}`}
    >
      <div className="flex items-center gap-1.5 border-b border-ink/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="ml-3 h-5 w-full max-w-48 rounded-full bg-ink/5" />
      </div>
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </div>
  )
}

export function InvestVisual() {
  const rows = [
    { ticker: 'AAPL', price: '$212.40', delta: '+1.2%' },
    { ticker: 'NVDA', price: '$121.85', delta: '+3.8%' },
    { ticker: 'VTI', price: '$276.02', delta: '-0.4%' },
  ]

  return (
    <BrowserFrame>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink/40">
            Portfolio value
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-ink">
            $48,392.10
          </p>
        </div>
        <span className="rounded-full bg-ember/10 px-2.5 py-1 font-mono text-xs font-semibold text-ember">
          +2.4%
        </span>
      </div>

      <svg viewBox="0 0 200 60" className="mt-4 h-16 w-full text-ember">
        <polyline
          points="0,45 25,40 50,42 75,28 100,32 125,18 150,22 175,10 200,14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div
            key={row.ticker}
            className="flex items-center justify-between border-t border-ink/5 pt-2 font-mono text-xs text-ink/70"
          >
            <span className="font-semibold text-ink">{row.ticker}</span>
            <span>{row.price}</span>
            <span className={row.delta.startsWith('-') ? 'text-ink/40' : 'text-ember'}>
              {row.delta}
            </span>
          </div>
        ))}
      </div>
    </BrowserFrame>
  )
}

export function ProVisual() {
  const bars = [40, 65, 30, 80, 55, 70, 45, 90, 60, 35, 50, 75]

  return (
    <BrowserFrame dark shadowClassName="shadow-2xl shadow-black/40">
      <div className="grid aspect-[8/5] grid-cols-2 grid-rows-2 gap-4">
        <div className="rounded-lg bg-cream/5 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-cream/40">
            Order book
          </p>
          <div className="mt-4 space-y-3">
            {[30, 55, 45, 70].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-cream/10">
                <div
                  className="h-2 rounded-full bg-ember/70"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-cream/5 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-cream/40">
            Watchlist
          </p>
          <div className="mt-4 space-y-3 font-mono text-sm text-cream/70">
            <div className="flex justify-between">
              <span>TSLA</span>
              <span className="text-ember">+4.1%</span>
            </div>
            <div className="flex justify-between">
              <span>MSFT</span>
              <span className="text-cream/40">-0.2%</span>
            </div>
            <div className="flex justify-between">
              <span>AMD</span>
              <span className="text-ember">+1.9%</span>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col rounded-lg bg-cream/5 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-cream/40">
            Volume
          </p>
          <div className="mt-3 flex flex-1 items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-ember/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  )
}

export function WealthVisual() {
  const legend = [
    { label: 'US Stocks — 45%', color: 'bg-ember' },
    { label: 'Intl — 25%', color: 'bg-ember-light' },
    { label: 'Bonds — 30%', color: 'bg-ink/15' },
  ]

  return (
    <BrowserFrame>
      <div className="flex items-center gap-6">
        <div
          className="grid h-28 w-28 shrink-0 place-items-center rounded-full"
          style={{
            background:
              'conic-gradient(var(--color-ember) 0% 45%, var(--color-ember-light) 45% 70%, rgba(11,9,6,0.12) 70% 100%)',
          }}
        >
          <div className="grid h-16 w-16 place-items-center rounded-full bg-paper">
            <span className="font-mono text-[11px] font-semibold text-ink">
              On track
            </span>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs text-ink/70">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  )
}
