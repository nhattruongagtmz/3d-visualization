import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, Home, Gamepad2, Wrench, Palette, Settings2, Star } from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '../../lib/data'
import { strings } from '../../lib/strings'
import { formatPrice, formatRating } from '../../lib/utils'
import { Card, CardContent } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'

export const Route = createFileRoute('/dashboard/categories')({
  component: CategoriesPage,
})

const ICON_MAP = { Home, Gamepad2, Wrench, Palette, Settings2 } as const

function useCategoryStats() {
  return useMemo(() => {
    return CATEGORIES.map((cat) => {
      const products = PRODUCTS.filter((p) => p.category === cat.id)
      const count = products.length
      const avgPrice = count > 0 ? products.reduce((s, p) => s + p.price, 0) / count : 0
      const catAvgRating = count > 0 ? products.reduce((s, p) => s + p.rating, 0) / count : 0
      return { ...cat, count, avgPrice, catAvgRating }
    })
  }, [])
}

function CategoryCardsGrid() {
  const categoryStats = useCategoryStats()

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {categoryStats.map((cat, i) => {
        const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP]
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
          >
            <Card className="cursor-pointer transition-colors hover:border-[var(--lagoon)]">
              <CardContent className="p-4">
                {Icon && (
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lagoon)]/10">
                    <Icon className="h-5 w-5 text-[var(--lagoon)]" />
                  </div>
                )}
                <p
                  className="text-sm font-semibold text-[var(--sea-ink)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {cat.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">
                  {strings.dashboard.catProductCount(cat.count)}
                </p>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--sea-ink-soft)]">{strings.dashboard.catAvgPrice}</span>
                    <span className="tabular-nums font-semibold text-[var(--lagoon)]">
                      {formatPrice(Math.round(cat.avgPrice))}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--sea-ink-soft)]">{strings.dashboard.catAvgRating}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-[var(--lagoon)] text-[var(--lagoon)]" />
                      <span className="tabular-nums font-semibold text-[var(--sea-ink)]">
                        {formatRating(cat.catAvgRating)}
                      </span>
                    </span>
                  </div>
                </div>
                <Link
                  to="/shop"
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--line)] py-1.5 text-xs font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
                >
                  {strings.dashboard.catViewProducts}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h2
          className="text-lg font-bold text-[var(--sea-ink)]"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {strings.admin.sidebarCategories}
        </h2>
        <p className="text-sm text-[var(--sea-ink-soft)]">Phân bổ sản phẩm theo danh mục</p>
      </div>
      <CategoryCardsGrid />
    </motion.div>
  )
}
