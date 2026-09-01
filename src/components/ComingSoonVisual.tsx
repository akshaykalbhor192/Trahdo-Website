import { BrowserFrame } from './ProductVisual'

export default function ComingSoonVisual() {
  return (
    <BrowserFrame dark shadowClassName="shadow-2xl shadow-black/40">
      <div className="flex aspect-[8/5] items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-wider text-cream/20">
          Coming soon
        </span>
      </div>
    </BrowserFrame>
  )
}
