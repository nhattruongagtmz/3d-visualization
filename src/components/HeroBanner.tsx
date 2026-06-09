import { Link } from '@tanstack/react-router'
import { ArrowRight, Printer } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-[580px] items-center overflow-hidden py-20 md:py-28">
      {/* Teal radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 62% 38%, rgba(79,184,178,0.28) 0%, transparent 68%)',
        }}
      />
      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px' }}
      />

      <div className="page-wrap relative z-10 flex flex-col items-start gap-7">
        <Badge className="flex items-center gap-1.5 border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--chip-bg)]">
          <Printer className="h-3 w-3" />
          Bambu Lab Compatible
        </Badge>

        <h1 className="display-title max-w-2xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-[var(--sea-ink)] md:text-5xl lg:text-6xl">
          Precision-Printed.{' '}
          <span className="text-[var(--lagoon)]">Ready to Ship.</span>
        </h1>

        <p className="max-w-lg text-lg leading-relaxed text-[var(--sea-ink-soft)]">
          Browse our catalog of original 3D-printed models — from home decor to functional parts.
          Every item is printed fresh on Bambu Lab hardware with quality filament.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/shop">
            <Button size="lg" className="bg-[var(--lagoon)] text-white hover:opacity-90">
              Browse the shop
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">
              How it works
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-6 pt-2 text-sm text-[var(--sea-ink-soft)]">
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
