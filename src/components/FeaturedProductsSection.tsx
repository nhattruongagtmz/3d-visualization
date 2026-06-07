import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS } from '../lib/data'
import ProductCard from './ProductCard'

export default function FeaturedProductsSection() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)

  return (
    <section className="py-16">
      <div className="page-wrap">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="island-kicker mb-1">Hand-picked</p>
            <h2 className="text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">Featured Picks</h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-semibold text-[var(--lagoon)] no-underline hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
