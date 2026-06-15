import { Link } from '@tanstack/react-router'
import { ArrowRight, Gamepad2, Home, Palette, Settings2, Wrench } from 'lucide-react'
import { CATEGORIES } from '../lib/data'
import { strings } from '../lib/strings'
import Reveal from './Reveal'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Gamepad2,
  Wrench,
  Palette,
  Settings2,
}

export default function CategoryShowcase() {
  const [featured, ...rest] = CATEGORIES

  return (
    <section className="py-16">
      <div className="page-wrap">
        <Reveal className="mb-8">
          <h2 className="text-balance text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">
            {strings.categories.heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured && (() => {
            const Icon = ICONS[featured.icon]
            return (
              <Reveal delay={0.04} className="lg:row-span-2">
                <Link
                  to="/shop"
                  className="feature-card group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl no-underline"
                  style={{ minHeight: '220px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
                    alt={strings.categories.homeCategoryAlt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(15,26,30,0.82) 30%, rgba(15,26,30,0.2) 100%)',
                    }}
                  />
                  <div className="relative z-10 p-5">
                    <div className="mb-3 inline-flex rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-sm">
                      {Icon && <Icon className="h-5 w-5 text-white" />}
                    </div>
                    <p className="font-semibold text-white">{featured.label}</p>
                    <p className="text-xs text-white/60">{strings.categories.descriptions[featured.id]}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--lagoon)]">
                      {strings.categories.shopNow}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })()}

          {rest.map((cat, i) => {
            const Icon = ICONS[cat.icon]
            return (
              <Reveal key={cat.id} delay={0.08 + i * 0.06}>
                <Link
                  to="/shop"
                  className="feature-card group flex items-center gap-4 rounded-xl p-5 no-underline"
                >
                  <div className="flex-shrink-0 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] p-3">
                    {Icon && <Icon className="h-5 w-5 text-[var(--lagoon)]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--sea-ink)]">{cat.label}</p>
                    <p className="text-xs text-[var(--sea-ink-soft)]">{strings.categories.descriptions[cat.id]}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-[var(--sea-ink-soft)] opacity-0 transition-opacity group-hover:opacity-60" />
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
