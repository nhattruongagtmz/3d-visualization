import { Link } from '@tanstack/react-router'
import { ArrowRight, Printer } from 'lucide-react'
import { strings } from '../lib/strings'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 62% 38%, rgba(212,81,26,0.2) 0%, transparent 68%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px' }}
      />

      <div className="page-wrap relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Text side */}
        <div className="flex flex-col items-start gap-6">
          <Badge className="rise-in flex items-center gap-1.5 border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] hover:bg-[var(--chip-bg)]">
            <Printer className="h-3 w-3" />
            {strings.hero.badge}
          </Badge>

          <h1 className="rise-in-1 display-title max-w-2xl text-balance text-4xl font-bold leading-[1.06] tracking-tight text-[var(--sea-ink)] md:text-5xl lg:text-6xl">
            {strings.hero.headline1}{' '}
            <span className="text-[var(--lagoon)]">{strings.hero.headline2}</span>
          </h1>

          <p className="rise-in-2 max-w-md text-lg leading-relaxed text-[var(--sea-ink-soft)]">
            {strings.hero.description}
          </p>

          <div className="rise-in-3 flex flex-wrap gap-3">
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]"
              >
                {strings.hero.ctaBrowse}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                {strings.hero.ctaHowItWorks}
              </Button>
            </Link>
          </div>

        </div>

        {/* Visual side */}
        <div className="rise-in-2 relative hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-[400px]">
            {/* Main image */}
            <div
              className="island-shell relative overflow-hidden rounded-3xl"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt={strings.hero.featuredProductAlt}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-36"
                style={{
                  background: 'linear-gradient(to top, rgba(15,26,30,0.72), transparent)',
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-sm font-semibold text-white/90">{strings.hero.featuredProductName}</p>
                <p className="text-xs text-white/55">{strings.hero.featuredProductSub}</p>
              </div>
            </div>

            {/* Rating card — top right */}
            <div className="island-shell absolute -top-5 -right-6 rounded-2xl px-4 py-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                {strings.hero.ratingLabel}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[var(--sea-ink)]">4.8</span>
                <span className="text-[var(--lagoon)] text-sm leading-none">★★★★★</span>
              </div>
            </div>

            {/* Shipping card — bottom left */}
            <div className="island-shell absolute -bottom-5 -left-6 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[var(--lagoon)] flex items-center justify-center text-white flex-shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21H5M17 21h2m-6 0a2 2 0 104 0 2 2 0 00-4 0M5 21a2 2 0 104 0 2 2 0 00-4 0M16 3h5l2 5H14z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--sea-ink)]">{strings.hero.shippingCardTitle}</p>
                <p className="text-[10px] text-[var(--sea-ink-soft)]">{strings.hero.shippingCardSub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
