import { Link } from '@tanstack/react-router'
import { Gamepad2, Home, Palette, Settings2, Wrench } from 'lucide-react'
import type { Category } from '../lib/types'
import { CATEGORIES } from '../lib/data'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Gamepad2,
  Wrench,
  Palette,
  Settings2,
}

const COLORS: Record<Category, string> = {
  'home-decor': 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'toys': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'tools': 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'art': 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'functional-parts': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

export default function CategoryShowcase() {
  return (
    <section className="bg-[var(--surface)] py-16">
      <div className="page-wrap">
        <div className="mb-8 text-center">
          <p className="island-kicker mb-1">Find your style</p>
          <h2 className="text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon]
            return (
              <Link
                key={cat.id}
                to="/shop"
                className="feature-card flex flex-col items-center gap-3 p-6 text-center no-underline transition-shadow hover:shadow-lg"
              >
                <div className={`rounded-xl p-3 ${COLORS[cat.id]}`}>
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <span className="text-sm font-semibold text-[var(--sea-ink)]">{cat.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
