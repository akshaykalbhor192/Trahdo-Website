import { useRef } from 'react'
import ScrollCraftRoot from '../components/ScrollCraftRoot'
import Hero from '../components/home/Hero'
import Tabs from '../components/home/Tabs'
import Place from '../components/home/Place'
import Research from '../components/home/Research'
import Trade from '../components/home/Trade'
import Advisor from '../components/home/Advisor'
import Peak from '../components/home/Peak'
import Close from '../components/home/Close'
import SessionRail from '../components/home/SessionRail'
import { useSessionClockDriver } from '../session/clock'

/*
 * Grammar: Session replay. The page is one synthetic trading day (09:15 to 15:30), replayed
 * under the scroll. Eight acts, six device families, no video. See
 * scrollcraft/builds/trahdo/BRIEF.md for the feeling curve and the peak.
 */
export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  useSessionClockDriver(rootRef)

  return (
    <ScrollCraftRoot rootRef={rootRef} className="home has-rail" title="Trahdo: investing built for the way markets actually move">
      <main id="main">
        <Hero />
        <Tabs />
        <Place />
        <Research />
        <Trade />
        <Advisor />
        <Peak />
        <Close />
      </main>
      <SessionRail />
    </ScrollCraftRoot>
  )
}
