import { Link } from '@tanstack/react-router'
import { ArrowRight, Printer } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--hero-a)] py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% 40%, var(--lagoon) 0%, transparent 70%)',
        }}
      />
      <div className="page-wrap relative z-10 flex flex-col items-start gap-6">
        <Badge className="flex items-center gap-1.5 bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--chip-bg)] border border-[var(--chip-line)]">
          <Printer className="h-3 w-3" />
          Bambu Lab Compatible
        </Badge>

        <h1 className="display-title max-w-2xl leading-tight">
          Precision-Printed.{' '}
          <span className="text-[var(--lagoon)]">Ready to Ship.</span>
        </h1>

        <p className="max-w-xl text-lg text-[var(--sea-ink-soft)] leading-relaxed">
          Browse our catalog of original 3D-printed models — from home decor to functional parts.
          Every item is printed fresh on Bambu Lab hardware with quality filament.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/shop">
            <Button
              size="lg"
              className="bg-[var(--lagoon)] text-white hover:opacity-90"
            >
              Browse the Shop
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">
              How It Works
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 text-sm text-[var(--sea-ink-soft)]">
          {['14 unique models', 'Free shipping over $50', 'Printed on demand'].map((stat) => (
            <span key={stat} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--lagoon)]" />
              {stat}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
