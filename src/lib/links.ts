/*
 * Every destination the site points at, in one place.
 *
 * A `null` means "this does not exist yet". The UI renders an honest "coming" state for it
 * instead of a dead `#` link. Fill these in as the destinations go live.
 */
export const LINKS = {
  /** Trahdo Market Intelligence, live. */
  marketIntelligence: 'https://unicorn-dashboard-rust.vercel.app/',
  /** Trahdo App: a notify-me or waitlist link. Coming soon, not yet public. */
  appNotify: null as string | null,
  /** F&O Advisor: a notify-me or waitlist link. Coming soon, not yet public. */
  advisorNotify: null as string | null,
  /** Where security reports go (an address or a form). Not yet public. */
  securityContact: null as string | null,
  /** Public status page. Not yet public. */
  statusPage: null as string | null,
  /** Careers contact or applications page. Not yet public. */
  careersContact: null as string | null,
  social: [] as { label: string; href: string }[],
}

/** The one call-to-action label, used everywhere. */
export const CTA_LABEL = 'Get started'
