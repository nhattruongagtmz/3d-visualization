import { Printer, Shield, Truck } from 'lucide-react'

const BADGES = [
  {
    icon: Printer,
    title: 'Bambu Lab Certified',
    description: 'Printed on X1C, P1S, and A1 series printers for consistent quality.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Every print is inspected. Not happy? We reprint or refund.',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Ships within 2 business days. Free on orders over $50.',
  },
]

export default function TrustBadges() {
  return (
    <section className="py-16">
      <div className="page-wrap">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {BADGES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex-shrink-0 rounded-xl bg-[var(--chip-bg)] p-3 border border-[var(--chip-line)]">
                <Icon className="h-6 w-6 text-[var(--lagoon)]" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">{title}</h3>
                <p className="text-sm text-[var(--sea-ink-soft)]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
