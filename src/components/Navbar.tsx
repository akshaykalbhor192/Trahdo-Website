import { useSectionTheme } from '../hooks/useSectionTheme'

export const NAV_HEIGHT = 68

export default function Navbar() {
  const { theme, scrolled } = useSectionTheme(NAV_HEIGHT)
  const useInkText = scrolled && theme === 'light'

  const linkClass = useInkText
    ? 'transition-colors hover:text-ink'
    : 'transition-colors hover:text-cream'

  let headerClass =
    'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 '
  if (!scrolled) {
    headerClass += 'border-transparent bg-transparent backdrop-blur-none'
  } else if (useInkText) {
    headerClass += 'border-ink/10 bg-paper/70 backdrop-blur-md'
  } else {
    headerClass += 'border-cream/10 bg-ink/50 backdrop-blur-md'
  }

  return (
    <header className={headerClass}>
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <a href="/" className="flex items-center gap-3">
          <span
            className={
              useInkText
                ? 'font-display text-lg font-extrabold tracking-tight text-ink transition-colors duration-300'
                : 'font-display text-lg font-extrabold tracking-tight text-cream transition-colors duration-300'
            }
          >
            Trahdo
          </span>
        </a>

        <nav
          className={
            useInkText
              ? 'hidden items-center gap-10 text-sm font-medium text-ink/80 transition-colors duration-300 md:flex'
              : 'hidden items-center gap-10 text-sm font-medium text-cream/90 transition-colors duration-300 md:flex'
          }
        >
          <a href="#about" className={linkClass}>
            About
          </a>
          <a href="#products" className={linkClass}>
            Products
          </a>
          <a href="#careers" className={linkClass}>
            Careers
          </a>
          <a href="#developers" className={linkClass}>
            Developers
          </a>
        </nav>

        <a
          href="#get-started"
          className={
            useInkText
              ? 'rounded-full bg-ink/10 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ink/15'
              : 'rounded-full bg-cream/15 px-4 py-2 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-cream/25'
          }
        >
          Start trading
        </a>
      </div>
    </header>
  )
}
