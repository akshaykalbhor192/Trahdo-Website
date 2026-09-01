const columns = [
  {
    title: 'Products',
    links: [
      { label: 'Trahdo Invest', href: '#products' },
      { label: 'Trahdo Pro', href: '#products' },
      { label: 'Trahdo Wealth', href: '#products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#careers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Developers', href: '#developers' },
      { label: 'Help center', href: '#' },
    ],
  },
]

const socialLinks = [
  {
    label: 'X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.75c0-1.37-.03-3.13-1.9-3.13-1.9 0-2.2 1.5-2.2 3.03V21h-4V9Z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.48 2.87 8.27 6.84 9.61.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.19-3.37-1.19-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.05 0-1.11.38-2.03 1.02-2.74-.1-.26-.44-1.31.1-2.72 0 0 .83-.27 2.75 1.05a9.28 9.28 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.54 1.41.2 2.46.1 2.72.64.71 1.02 1.63 1.02 2.74 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.17C22 6.58 17.52 2 12 2Z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      data-theme="dark"
      className="relative overflow-hidden px-6 pb-10 pt-20 sm:px-8 sm:pt-24 lg:px-12"
      style={{
        backgroundImage:
          'radial-gradient(80% 100% at 12% 0%, rgba(227,161,95,0.28), transparent 60%), radial-gradient(70% 90% at 100% 100%, rgba(200,112,60,0.35), transparent 60%), linear-gradient(165deg, #0b0906 0%, #150c06 45%, #33180a 100%)',
      }}
    >
      <div className="relative mx-auto max-w-[1800px]">
        <div className="grid gap-12 border-b border-cream/10 pb-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)] lg:gap-8">
          <div>
            <span className="font-display text-2xl font-extrabold tracking-tight text-cream">
              Trahdo
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-muted/70">
              Three products, one mission: make investing feel like it was
              built for you, not around you.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-ember-light/60 hover:bg-ember/15 hover:text-ember-light"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-cream/40">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-cream-muted transition-colors hover:text-ember-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-cream-muted/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed">
            Investing involves risk, including possible loss of principal.
            Trahdo Market, Trahdo App, and Trahdo are products of
            Trahdo. Not FDIC insured. Not bank guaranteed. May
            lose value.
          </p>
          <div className="flex items-center gap-6 whitespace-nowrap">
            <p>© {new Date().getFullYear()} Trahdo.</p>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 font-semibold text-cream-muted transition-colors hover:text-ember-light"
            >
              Back to top
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 12.5V3.5M8 3.5 3.5 8M8 3.5 12.5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
