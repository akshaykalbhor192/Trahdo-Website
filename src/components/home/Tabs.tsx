import type { CSSProperties } from 'react'
import { Mark } from '../Mark'

/*
 * Act 2. The cost of the usual way, named plainly, while the tabs it takes pile up along the
 * top. At the turn they slide together into one. Everything here is driven from the act's
 * --sc-p (set by the engine) in CSS: transform and opacity only.
 */
const tabs = ['Quotes', 'News', 'Broker', 'Charts', 'Sheet']

const lines = [
  { cue: '0 0.25 0 0.25', text: 'Five tabs to check one price.' },
  { cue: '0.22 0.47 0.25 0.25', text: 'Another to find out why it moved.' },
  { cue: '0.44 0.69 0.25 0.25', text: 'A third to place the order.' },
  { cue: '0.66 0.9 0.25 0.25', text: 'A spreadsheet to see how it went.' },
  { cue: '0.86 1 0.3 0.01', text: 'Trahdo puts the whole day in one place.' },
]

export default function Tabs() {
  return (
    <section
      id="tabs"
      className="act tabs"
      data-sc-act="pin"
      data-sc-span="3.6"
      data-sc-drift="#0c0b0b"
      data-t0="45"
      data-t1="55"
      data-pinned="true"
      aria-label="The usual way"
    >
      <div data-sc-stage className="tabs__stage">
        <div className="tabs__strip" aria-hidden="true">
          {tabs.map((name, i) => (
            <span key={name} className="tabs__tab" style={{ '--i': i } as CSSProperties}>
              <i />
              {name}
            </span>
          ))}
          <span className="tabs__tab tabs__tab--one">
            <span className="tabs__mark">
              <Mark />
            </span>
            trahdo
          </span>
        </div>

        <div className="tabs__copy">
          {lines.map((line, i) => (
            <p
              key={line.text}
              className={`display display--lg tabs__line ${i === lines.length - 1 ? 'tabs__line--turn' : ''}`}
              data-sc-cue={line.cue}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
