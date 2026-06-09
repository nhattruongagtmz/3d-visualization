import { Link } from '@tanstack/react-router'
import { ArrowRight, Gamepad2, Home, Palette, Settings2, Wrench } from 'lucide-react'
import { CATEGORIES } from '../lib/data'
import type { Category } from '../lib/types'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Gamepad2,
  Wrench,
  Palette,
  Settings2,
}

const COLORS: Record<Category, string> = {
  'home-decor': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  toys: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  tools: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  art: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'functional-parts': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

const DESCRIPTIONS: Record<Category, string> = {
  'home-decor': 'Vases, planters, wall art, organizers',
  toys: 'Fidgets, figures, game pieces, puzzles',
  tools: 'Holders, jigs, custom shop parts',
  art: 'Sculptures, decorative prints, gifts',
  'functional-parts': 'Brackets, clips, mounts, adapters',
}

export default function CategoryShowcase() {
  return (
    <section className="py-16">
      <div className="page-wrap">
        <div className="mb-8">
          <p className="island-kicker mb-1">Browse by type</p>
          <h2 className="text-balance text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">
            Shop by category
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon]
            return (
              <Link
                key={cat.id}
                to="/shop"
                className="feature-card group flex items-center gap-4 rounded-xl p-5 no-underline hover:shadow-lg"
              >
                <div className={`flex-shrink-0 rounded-xl p-3 ${COLORS[cat.id]}`}>
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--sea-ink)]">{cat.label}</p>
                  <p className="text-xs text-[var(--sea-ink-soft)]">{DESCRIPTIONS[cat.id]}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-[var(--sea-ink-soft)] opacity-0 transition-opacity group-hover:opacity-60" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
