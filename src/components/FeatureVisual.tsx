import { BrowserFrame } from './ProductVisual'

const chartPoints =
  '0,70 20,60 40,64 60,42 80,48 100,30 120,36 140,18 160,24 180,10 200,16 220,8'

const quickStats = [
  { label: 'Buying power', value: '$8,412' },
  { label: "Day's gain", value: '+2.3%' },
  { label: 'Total return', value: '+18.6%' },
]

const holdings = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: '$212.40', delta: '+1.2%' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: '$121.85', delta: '+3.8%' },
  { ticker: 'VTI', name: 'Vanguard Total Market', price: '$276.02', delta: '-0.4%' },
]

export default function FeatureVisual() {
  return (
    <BrowserFrame shadowClassName="shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink/40">
            Total portfolio
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            $142,038.55
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-ember/10 px-2.5 py-1 font-mono text-xs font-semibold text-ember">
            +$3,204.10 today
          </span>
        </div>

        <div className="hidden shrink-0 gap-2 sm:flex">
          <span className="rounded-full bg-ink px-4 py-2 font-mono text-xs font-semibold text-paper">
            Buy
          </span>
          <span className="rounded-full border border-ink/15 px-4 py-2 font-mono text-xs font-semibold text-ink">
            Sell
          </span>
        </div>
      </div>

      <svg viewBox="0 0 220 80" className="mt-6 h-24 w-full text-ember">
        <polyline
          points={chartPoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
        {quickStats.map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-lg font-bold text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {holdings.map((holding) => (
          <div
            key={holding.ticker}
            className="flex items-center justify-between border-t border-ink/5 pt-2 font-mono text-xs text-ink/70"
          >
            <span className="font-semibold text-ink">{holding.ticker}</span>
            <span className="hidden text-ink/40 sm:inline">
              {holding.name}
            </span>
            <span>{holding.price}</span>
            <span
              className={
                holding.delta.startsWith('-') ? 'text-ink/40' : 'text-ember'
              }
            >
              {holding.delta}
            </span>
          </div>
        ))}
      </div>
    </BrowserFrame>
  )
}
