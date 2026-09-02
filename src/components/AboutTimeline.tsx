import Reveal from './Reveal'
import { useScrollProgress } from '../hooks/useScrollProgress'

const milestones = [
  {
    year: '2021',
    title: 'Three friends, one spreadsheet',
    description:
      'A handful of us started tracking our own trades in a shared spreadsheet, because nothing else told us the truth fast enough.',
  },
  {
    year: '2022',
    title: 'Trahdo Market Intelligence ships',
    description:
      'The first product goes live — real-time NSE/BSE data and AI-generated briefs for a few hundred early users.',
  },
  {
    year: '2023',
    title: 'Trahdo Pro launches',
    description:
      'A full trading terminal for people who live in the market all day — Level 2 order books, scanners, one-click execution.',
  },
  {
    year: 'Today',
    title: '180K+ investors, $4.2B+ in assets',
    description:
      'Three products, one mission, and we’re just getting started.',
  },
]

export default function AboutTimeline() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-ink/10" />
      <div
        className="absolute left-[7px] top-2 w-px origin-top bg-ember"
        style={{ height: 'calc(100% - 1rem)', transform: `scaleY(${progress})` }}
      />

      <ul className="space-y-14">
        {milestones.map((milestone, i) => (
          <li key={milestone.year} className="relative pl-10">
            <span
              className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 bg-paper transition-all duration-500"
              style={{
                borderColor: progress > i / milestones.length ? 'var(--color-ember)' : 'var(--color-ink)',
                opacity: progress > i / milestones.length ? 1 : 0.15,
              }}
            />
            <Reveal delay={i * 80}>
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-ember">
                {milestone.year}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                {milestone.title}
              </h3>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink/60">
                {milestone.description}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}
