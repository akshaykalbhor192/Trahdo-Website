/*
 * Copy that makes claims about the company, its history or its protections.
 *
 * Everything here was carried over from the previous version of the site. None of it was
 * written or checked by the redesign, so treat each entry as OWNER-SUPPLIED: confirm it is
 * true before launch, and edit it here. Statements that could not be supported (an
 * anonymous testimonial, user counts) were removed rather than carried over.
 */

export interface Milestone {
  year: string
  title: string
  body: string
}

export const timeline: Milestone[] = [
  {
    year: '2021',
    title: 'Three friends, one spreadsheet',
    body: 'A handful of us started tracking our own trades in a shared spreadsheet, because nothing else told us the truth fast enough.',
  },
  {
    year: '2022',
    title: 'Trahdo Market Intelligence ships',
    body: 'The first product goes live: real-time NSE/BSE data and AI-generated briefs.',
  },
  {
    year: '2023',
    title: 'A trading terminal takes shape',
    body: 'Level 2 order books, scanners and one-click execution, for people who live in the market all day. The start of what is now Trahdo App.',
  },
  {
    year: 'Today',
    title: 'Two products, one mission',
    body: 'Market Intelligence is live. Trahdo App is in early access. We are just getting started.',
  },
]

export const principles = [
  {
    title: 'Built by traders',
    body: 'Every feature ships because someone on the team needed it first, not because a roadmap said so.',
  },
  {
    title: 'Transparent pricing',
    body: 'The spread you see before you click is the spread you get filled at. No hidden fees, ever.',
  },
  {
    title: 'Regulated and secure',
    body: 'Client funds are held separately, every trade is logged end to end, and support is a real person.',
  },
  {
    title: 'One dashboard, not a dozen',
    body: 'Research, trade and track without juggling five tabs and five different logins to do it.',
  },
]

export const teamNote = {
  lead: 'Every investing app we had used before felt like it was built for someone else.',
  body: [
    'A broker’s quarterly numbers, an advertiser’s engagement targets, anyone but the person actually holding the portfolio. Trahdo started as a spreadsheet a few of us shared to track our own trades, because nothing else told us the truth fast enough.',
    'Today it is the same idea, built for everyone who has ever refreshed five tabs to check one price. We do not think that is a small problem. It is the whole reason we started.',
  ],
}

export const securityLanes = {
  intelligence: {
    name: 'Trahdo Market Intelligence',
    heading: 'Insight, with no access to your money.',
    steps: [
      { title: 'Read-only by design', body: 'Dashboards, briefs and alerts are read-only. This product cannot place a trade or move a rupee.' },
      { title: 'Encrypted in transit', body: 'Every quote and AI brief travels over TLS 1.3, end to end, from feed to screen.' },
      { title: 'Scoped keys', body: 'API and integration keys are scoped to market data only, and can be revoked instantly.' },
    ],
  },
  app: {
    name: 'Trahdo App',
    heading: 'Custody-grade protection for every order.',
    steps: [
      { title: 'Segregated funds', body: 'Client funds are held in segregated, regulated accounts, never on our balance sheet.' },
      { title: 'A second factor', body: 'Every order and withdrawal needs a second factor, no exceptions.' },
      { title: 'A locked destination', body: 'Lock withdrawals to one verified bank account, and get alerted on any new device.' },
    ],
  },
}

export const trustCentre = [
  {
    title: 'Responsible disclosure',
    body: 'Found a flaw? Tell us before anyone else finds it. We credit and reward every valid report.',
  },
  {
    title: 'Bug bounty program',
    body: 'Ongoing rewards for verified vulnerabilities, scoped and triaged within days, not months.',
  },
  {
    title: 'Status and incidents',
    body: 'Live uptime and a full history of past incidents, across both products, without the corporate spin.',
  },
  {
    title: 'Licensing and audits',
    body: 'Where we are registered and what we are audited against, updated as it changes.',
  },
]

export const careersHow = [
  { title: 'A small team', body: 'We are a small team building fast. Roles will be posted here as they open.' },
  { title: 'Built by traders', body: 'Every feature ships because someone on the team needed it first.' },
]
