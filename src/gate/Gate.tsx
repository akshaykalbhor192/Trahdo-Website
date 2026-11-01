import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Mark, Arrow } from '../components/Mark'
import { SERIES, SESSION_MINUTES, OPEN_MINUTE } from '../session/data'
import { ACCESS_HASH, SIGN_OUT_EVENT, digest, grantAccess, hasAccess } from './access'
import './gate.css'

/*
 * The private-preview gate: a sign-in page in front of the whole site, then a short "opening the
 * session" animation before the landing page. Styled with design 2's tokens, scoped under `.gt`.
 *
 * This is a front-end gate only. The site's code still ships to every visitor, so it keeps the
 * preview away from casual visitors but does not protect anything secret. Access is kept in
 * access.ts; signOut() there brings this page back.
 */
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** The sample NIFTY session as an SVG path in a 1000 x 200 box. */
function niftyPath(points = 140) {
  const p = SERIES.NIFTY.price
  const lo = Math.min(...p)
  const hi = Math.max(...p)
  let d = ''
  for (let i = 0; i <= points; i++) {
    const v = p[Math.round((i / points) * SESSION_MINUTES)]
    const x = (i / points) * 1000
    const y = 190 - ((v - lo) / (hi - lo)) * 180
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}
const NIFTY_PATH = niftyPath()

const clock = (minute: number) => {
  const m = OPEN_MINUTE + Math.round(minute)
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

type Phase = 'out' | 'opening' | 'in'

export default function Gate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(() => (hasAccess() ? 'in' : 'out'))
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    const out = () => {
      setReveal(false)
      setPhase('out')
      window.scrollTo(0, 0)
    }
    window.addEventListener(SIGN_OUT_EVENT, out)
    return () => window.removeEventListener(SIGN_OUT_EVENT, out)
  }, [])

  if (phase === 'in') return <>{children}</>
  if (phase === 'out') return <SignIn onEnter={() => setPhase('opening')} />
  return (
    <>
      {reveal ? children : null}
      <Opening onReveal={() => setReveal(true)} onDone={() => setPhase('in')} />
    </>
  )
}

/* ============================================================= sign in == */

function SignIn({ onEnter }: { onEnter: () => void }) {
  const ids = useId()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [wrong, setWrong] = useState(false)
  const idRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const before = document.title
    document.title = 'Sign in | Trahdo'
    document.documentElement.classList.add('gt-doc')
    idRef.current?.focus()
    return () => {
      document.title = before
      document.documentElement.classList.remove('gt-doc')
    }
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (!id.trim() || !password) {
      setError('Enter both your access ID and password.')
      setWrong(true)
      return
    }
    setBusy(true)
    const ok = (await digest(id, password)) === ACCESS_HASH
    setBusy(false)
    if (!ok) {
      setError("That access ID and password don't match. Check both and try again.")
      setWrong(true)
      return
    }
    grantAccess()
    onEnter()
  }

  return (
    <main className="gt">
      <svg className="gt-tape" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="gt-tape-ink" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#151410" />
            <stop offset="0.55" stopColor="#6b4a33" />
            <stop offset="1" stopColor="#ff5a1f" />
          </linearGradient>
        </defs>
        <path d={NIFTY_PATH} pathLength={1} />
      </svg>

      <header className="gt-brand">
        <span className="gt-mark">
          <Mark />
        </span>
        trahdo
      </header>

      <section className="gt-intro" aria-labelledby={`${ids}-title`}>
        <p className="gt-eyebrow">
          <i aria-hidden="true" />
          Private preview <span aria-hidden="true">·</span> pre-open
        </p>
        <h1 id={`${ids}-title`} className="gt-title">
          Trahdo, before
          <em> the open.</em>
        </h1>
        <p className="gt-lede">
          The new Trahdo site is in review. Sign in with the access ID and password you were given to see it.
        </p>
      </section>

      <form
        className={`gt-card${wrong ? ' is-wrong' : ''}`}
        onSubmit={submit}
        onAnimationEnd={() => setWrong(false)}
        noValidate
      >
        <h2 className="gt-card__title">Sign in to the preview</h2>

        <label className="gt-field" htmlFor={`${ids}-id`}>
          <span>Access ID</span>
          <input
            ref={idRef}
            id={`${ids}-id`}
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={id}
            onChange={(e) => {
              setId(e.target.value)
              setError('')
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${ids}-err` : undefined}
          />
        </label>

        <label className="gt-field" htmlFor={`${ids}-pw`}>
          <span>Password</span>
          <span className="gt-pw">
            <input
              id={`${ids}-pw`}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${ids}-err` : undefined}
            />
            <button type="button" className="gt-pw__toggle" onClick={() => setShow((s) => !s)} aria-pressed={show}>
              {show ? 'Hide' : 'Show'}
            </button>
          </span>
        </label>

        <p id={`${ids}-err`} className="gt-error" role="alert">
          {error}
        </p>

        <button type="submit" className="gt-submit" disabled={busy}>
          {busy ? 'Checking…' : 'Sign in'}
          <span className="gt-submit__icon">
            <Arrow />
          </span>
        </button>

        <p className="gt-note">Access is by invitation while the site is in review.</p>
      </form>

      <footer className="gt-foot" aria-hidden="true">
        <span>NSE · BSE</span>
        <span>NIFTY · BANKNIFTY · FINNIFTY · SENSEX</span>
        <IstClock />
      </footer>
    </main>
  )
}

function IstClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
  return <span className="gt-clock">IST {time}</span>
}

/* ============================================================ opening == */

/** After sign-in: the mark sets, the sample session plays from 09:15 to 15:30, and the page lifts away. */
function Opening({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [fast] = useState(reduced)
  const PLAY = fast ? 300 : 2100
  const LIFT = fast ? 250 : 750
  const [minute, setMinute] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = useRef({ onReveal, onDone })
  useEffect(() => {
    done.current = { onReveal, onDone }
  })

  useEffect(() => {
    document.documentElement.classList.add('gt-doc')
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PLAY)
      setMinute(SESSION_MINUTES * (1 - Math.pow(1 - t, 2)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const t1 = setTimeout(() => {
      done.current.onReveal()
      setLeaving(true)
      window.scrollTo(0, 0)
    }, PLAY + 250)
    const t2 = setTimeout(() => done.current.onDone(), PLAY + 250 + LIFT)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
      document.documentElement.classList.remove('gt-doc')
    }
  }, [PLAY, LIFT])

  const progress = minute / SESSION_MINUTES
  return (
    <div
      className={`gt gt-open${leaving ? ' is-leaving' : ''}`}
      style={{ ['--play' as string]: `${PLAY}ms`, ['--lift' as string]: `${LIFT}ms` }}
      role="status"
      aria-live="polite"
    >
      <div className="gt-open__inner">
        <span className="gt-open__mark">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <rect className="gt-open__bar" x="2" y="4" width="196" height="84" />
            <polygon className="gt-open__stem" points="96,94 170,94 104,196 54,164" />
          </svg>
        </span>
        <svg className="gt-open__line" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="gt-open-ink" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#151410" />
              <stop offset="0.55" stopColor="#6b4a33" />
              <stop offset="1" stopColor="#ff5a1f" />
            </linearGradient>
          </defs>
          <path className="gt-open__track" d={NIFTY_PATH} pathLength={1} />
          <path className="gt-open__ink" d={NIFTY_PATH} pathLength={1} />
        </svg>
        <div className="gt-open__meta">
          <span>{progress < 1 ? 'Opening the session' : 'Market open'}</span>
          <span className="gt-open__clock">{clock(minute)}</span>
        </div>
        <span className="gt-open__bar-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </div>
  )
}
