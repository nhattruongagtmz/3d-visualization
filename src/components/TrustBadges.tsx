import { Printer, Shield, Truck } from 'lucide-react'

const BADGES = [
  {
    icon: Printer,
    title: 'Bambu Lab certified',
    description: 'Printed on X1C, P1S, and A1 series printers for consistent quality every time.',
  },
  {
    icon: Shield,
    title: 'Quality guarantee',
    description: 'Every print is inspected before it ships. Not happy? We reprint or refund.',
  },
  {
    icon: Truck,
    title: 'Fast shipping',
    description: 'Ships within 2 business days. Free on orders over $50.',
  },
]

export default function TrustBadges() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--surface)] py-16">
      <div className="page-wrap">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {BADGES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-5">
              <div className="flex-shrink-0 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] p-3.5">
                <Icon className="h-7 w-7 text-[var(--lagoon)]" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-[var(--sea-ink)]">{title}</h3>
                <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
