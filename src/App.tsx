import { Navigate, useLocation } from 'react-router-dom'
import VersionToggle from './components/VersionToggle'
import Gate from './gate/Gate'
import V2App from './v2/V2App'
import V5App from './v5/V5App'
import { useSmoothScroll } from './lib/smoothScroll'

/** Where the root and any unknown path open. */
const DEFAULT = '/1st'

/** Old prefixes and where their links now land: renamed designs keep their page, retired ones open the default. */
const MOVED: [from: string, to: string][] = [
  ['/new', '/1st'],
  ['/5th', '/2nd'],
  ['/newest', DEFAULT],
  ['/4th', DEFAULT],
]

const under = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`)

function App() {
  useSmoothScroll()
  return (
    <Gate>
      <Site />
    </Gate>
  )
}

function Site() {
  const { pathname, search, hash } = useLocation()

  // Two designs, each with its own chrome: 1st under /1st (src/v2), 2nd under /2nd (src/v5).
  if (under(pathname, '/2nd')) {
    return (
      <>
        <V5App />
        <VersionToggle />
      </>
    )
  }
  if (under(pathname, '/1st')) {
    return (
      <>
        <V2App />
        <VersionToggle />
      </>
    )
  }

  // Everything else (the root, the old /about-style paths, old design prefixes) opens in 1st.
  const moved = MOVED.find(([from]) => under(pathname, from))
  const base = moved ? moved[1] : DEFAULT
  const rest = moved ? pathname.slice(moved[0].length) : pathname
  return <Navigate to={`${base}${rest === '/' || rest === '' ? '' : rest}${search}${hash}`} replace />
}

export default App
