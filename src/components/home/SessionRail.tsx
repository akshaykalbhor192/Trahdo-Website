import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { SESSION_MINUTES, clockLabel } from '../../session/data'
import { useSessionMinute, useSessionTime } from '../../session/clock'

/*
 * The dock: the signature move's chrome. The whole trading day is one thin track, the fill is
 * where you are in it, and the clock is the time of day. Each stop is an act, so it doubles as
 * navigation (click, or tab to it, for its name).
 *
 *   at    where the stop sits on the day's track
 *   from  the minute it becomes the current act
 */
const stops = [
  { id: 'open', label: 'Open', at: 0, from: 0 },
  { id: 'research', label: 'Research', at: 55, from: 55 },
  { id: 'trade', label: 'Trade', at: 100, from: 100 },
  { id: 'session', label: 'One moment', at: 150, from: 105 },
  { id: 'get-started', label: 'Bell', at: SESSION_MINUTES, from: SESSION_MINUTES - 1 },
]

export default function SessionRail({ footerRef }: { footerRef?: { current: Element | null } }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const minute = useSessionMinute()
  const [hidden, setHidden] = useState(false)

  const onTime = useCallback((t: number) => {
    trackRef.current?.style.setProperty('--ph', (t / SESSION_MINUTES).toFixed(4))
  }, [])
  useSessionTime(onTime)

  // Step aside when the footer arrives.
  useEffect(() => {
    const footer = footerRef?.current ?? document.querySelector('footer')
    if (!footer) return
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.05 })
    io.observe(footer)
    return () => io.disconnect()
  }, [footerRef])

  const active = [...stops].reverse().find((s) => minute >= s.from) ?? stops[0]

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }

  return (
    <nav className="rail" data-hidden={hidden} aria-label="Session timeline">
      <div className="rail__clock">
        <span>{clockLabel(minute)}</span>
        <small>IST</small>
      </div>
      <div className="rail__now" aria-hidden="true">
        {active.label}
      </div>
      <div className="rail__track" ref={trackRef}>
        <span className="rail__line" aria-hidden="true" />
        <span className="rail__fill" aria-hidden="true" />
        <ul className="rail__stops">
          {stops.map((s) => (
            <li key={s.id} className="rail__stop" style={{ left: `${(s.at / SESSION_MINUTES) * 100}%` } as CSSProperties}>
              <button
                type="button"
                className="rail__tick"
                data-label={s.label}
                data-passed={minute >= s.from}
                aria-current={active.id === s.id}
                aria-label={`Jump to ${s.label}`}
                onClick={() => jump(s.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
