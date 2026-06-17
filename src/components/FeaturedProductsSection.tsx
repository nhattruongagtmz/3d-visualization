import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@lib/data'
import { strings } from '@lib/strings'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

export default function FeaturedProductsSection() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)
  const [hero, ...rest] = featured

  return (
    <section className="py-16">
      <div className="page-wrap">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="island-kicker mb-1">{strings.featured.eyebrow}</p>
            <h2 className="text-balance text-2xl font-bold text-[var(--sea-ink)] md:text-3xl lg:text-4xl">
              {strings.featured.heading}
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-semibold text-[var(--lagoon)] no-underline hover:underline"
          >
            {strings.featured.viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {hero && (
            <Reveal delay={0.06}>
              <ProductCard product={hero} />
            </Reveal>
          )}
          {rest.map((product, i) => (
            <Reveal key={product.id} delay={0.12 + i * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
