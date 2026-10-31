import { useNavigate, useLocation } from 'react-router-dom'

/*
 * Review aid: switches between the two designs (1st under /1st, 2nd under /2nd) on the same page.
 * Styled inline so no design's stylesheet can reach it. Remove it once one design is chosen.
 */
const designs = [
  { id: '1st', label: '1st', prefix: '/1st' },
  { id: '2nd', label: '2nd', prefix: '/2nd' },
] as const

function split(pathname: string) {
  for (const d of designs) {
    if (pathname === d.prefix || pathname.startsWith(`${d.prefix}/`)) return { id: d.id, rest: pathname.slice(d.prefix.length) || '/' }
  }
  return { id: '2nd' as const, rest: pathname }
}

export default function VersionToggle() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const { id: active, rest } = split(pathname)

  const go = (d: (typeof designs)[number]) => {
    if (d.id === active) return
    navigate((rest === '/' ? d.prefix : d.prefix + rest) + hash)
  }

  const seg = (on: boolean): React.CSSProperties => ({
    appearance: 'none',
    border: 0,
    cursor: 'pointer',
    padding: '8px 13px',
    borderRadius: 999,
    font: '600 12px/1 "Geist Sans", system-ui, sans-serif',
    letterSpacing: '0.01em',
    background: on ? '#ff5a1f' : 'transparent',
    color: on ? '#fff' : '#d8d4cc',
    transition: 'background 200ms, color 200ms',
  })

  return (
    <div
      role="group"
      aria-label="Compare site designs"
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: 4,
        borderRadius: 999,
        background: 'rgba(20,19,16,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px -8px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      <span style={{ padding: '0 8px 0 10px', font: '500 11px/1 "Geist Mono", monospace', color: '#8f897f', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Design
      </span>
      {designs.map((d) => (
        <button key={d.id} type="button" style={seg(active === d.id)} aria-pressed={active === d.id} onClick={() => go(d)}>
          {d.label}
        </button>
      ))}
    </div>
  )
}
