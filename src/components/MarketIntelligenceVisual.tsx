import marketIntelligenceScreenshot from '../assets/market-intelligence.png'
import { BrowserFrame } from './ProductVisual'

export default function MarketIntelligenceVisual() {
  return (
    <BrowserFrame dark padded={false} shadowClassName="shadow-2xl shadow-black/40">
      <img
        src={marketIntelligenceScreenshot}
        alt="Trahdo Market Intelligence dashboard"
        className="block w-full"
      />
    </BrowserFrame>
  )
}
