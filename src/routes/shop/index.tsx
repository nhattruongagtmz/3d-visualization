import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import ProductGrid from '../../components/ProductGrid'
import ShopFilters from '../../components/ShopFilters'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { PRODUCTS } from '../../lib/data'
import type { ShopFilters as Filters } from '../../lib/types'

export const Route = createFileRoute('/shop/')({
  component: ShopPage,
})

const DEFAULT_FILTERS: Filters = {
  categories: [],
  priceMin: 0,
  priceMax: 5000,
  printers: [],
  materials: [],
  sortBy: 'featured',
}

function ShopPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false
      if (
        filters.printers.length > 0 &&
        !filters.printers.some(
          (pr) => p.printerCompatibility.includes(pr) || p.printerCompatibility.includes('All'),
        )
      )
        return false
      if (filters.materials.length > 0 && !filters.materials.some((m) => p.materials.includes(m)))
        return false
      return true
    })

    switch (filters.sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result = [...result].reverse()
        break
      case 'featured':
      default:
        result = result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [filters])

  return (
    <main className="page-wrap py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">Shop</h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <ShopFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-end">
            <Select
              value={filters.sortBy}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, sortBy: v as Filters['sortBy'] }))
              }
            >
              <SelectTrigger className="w-44 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Best Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ProductGrid products={filtered} emptyMessage="No products match your filters. Try clearing some filters." />
        </div>
      </div>
    </main>
  )
}
