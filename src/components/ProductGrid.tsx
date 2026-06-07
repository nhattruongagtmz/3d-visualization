import { PackageOpen } from 'lucide-react'
import type { Product } from '../lib/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
}

export default function ProductGrid({ products, emptyMessage = 'No products found.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <PackageOpen className="h-12 w-12 text-[var(--sea-ink-soft)]" strokeWidth={1} />
        <p className="text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
