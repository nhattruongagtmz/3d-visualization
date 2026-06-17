import { Printer, Shield, Truck } from 'lucide-react'
import { strings } from '@lib/strings'
import Reveal from './Reveal'

const ICONS = [Printer, Shield, Truck]

export default function TrustBadges() {
  return (
    <section className="py-16">
      <div className="page-wrap">
        <Reveal>
        <div className="island-shell grid grid-cols-1 divide-y divide-[var(--line)] overflow-hidden rounded-2xl sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {strings.trust.badges.map(({ title, description, stat }, i) => {
            const Icon = ICONS[i]
            return (
            <div key={title} className="flex flex-col gap-4 p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] p-3">
                  <Icon className="h-6 w-6 text-[var(--lagoon)]" strokeWidth={1.5} />
                </div>
                <span className="display-title text-xs font-bold text-[var(--lagoon)] tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <div>
                <p className="mb-1 font-semibold text-[var(--sea-ink)]">{title}</p>
                <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{description}</p>
              </div>
              <p className="mt-auto text-xs font-semibold text-[var(--lagoon-deep)]">{stat}</p>
            </div>
          )})}
        </div>
        </Reveal>
      </div>
    </section>
  )
}
