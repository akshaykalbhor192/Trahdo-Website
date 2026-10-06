/** The Trahdo mark, traced from the product's own sign-in screen: a flat bar over a slanted stem. */
export function Mark({ title }: { title?: string }) {
  return (
    <svg viewBox="0 0 200 200" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <rect x="2" y="4" width="196" height="84" fill="currentColor" />
      <polygon points="96,94 170,94 104,196 54,164" fill="currentColor" opacity="0.78" />
    </svg>
  )
}

export function Arrow({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function External({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5h6.5V10M12.5 3.5 4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
