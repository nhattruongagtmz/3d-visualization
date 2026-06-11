import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Home,
  Gamepad2,
  Wrench,
  Palette,
  Settings2,
  Package,
  MessageSquare,
  Star,
  Timer,
  ChevronRight,
} from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '../lib/data'
import type { Product } from '../lib/types'
import { strings } from '../lib/strings'
import { cn, formatPrice, formatRating } from '../lib/utils'
import Reveal from '../components/Reveal'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Progress } from '../components/ui/progress'
import { ScrollArea } from '../components/ui/scroll-area'
import { Separator } from '../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const ICON_MAP = { Home, Gamepad2, Wrench, Palette, Settings2 } as const

function parsePrintHours(s: string): number {
  const m = s.match(/(\d+)h\s+(\d+)m/)
  if (!m) return 0
  return parseInt(m[1]) + parseInt(m[2]) / 60
}

function formatHours(h: number): string {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

function useDashboardStats() {
  return useMemo(() => {
    const total = PRODUCTS.length
    const totalReviews = PRODUCTS.reduce((s, p) => s + p.reviewCount, 0)
    const avgRating = PRODUCTS.reduce((s, p) => s + p.rating, 0) / total
    const totalPrintHours = PRODUCTS.reduce((s, p) => s + parsePrintHours(p.printTime), 0)
    const featuredCount = PRODUCTS.filter((p) => p.featured).length

    const categoryStats = CATEGORIES.map((cat) => {
      const products = PRODUCTS.filter((p) => p.category === cat.id)
      const count = products.length
      const avgPrice = count > 0 ? products.reduce((s, p) => s + p.price, 0) / count : 0
      const catAvgRating = count > 0 ? products.reduce((s, p) => s + p.rating, 0) / count : 0
      const catTotalReviews = products.reduce((s, p) => s + p.reviewCount, 0)
      return { ...cat, products, count, avgPrice, catAvgRating, catTotalReviews }
    })

    const materialMap: Record<string, number> = {}
    PRODUCTS.forEach((p) => {
      p.materials.forEach((m) => {
        materialMap[m] = (materialMap[m] ?? 0) + 1
      })
    })
    const materialStats = Object.entries(materialMap)
      .map(([name, count]) => ({ name, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)

    const prices = PRODUCTS.map((p) => p.price)
    const priceStats = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((s, v) => s + v, 0) / prices.length,
    }

    const noSupportCount = PRODUCTS.filter((p) => !p.supportRequired).length
    const universalCompatCount = PRODUCTS.filter((p) =>
      p.printerCompatibility.includes('All'),
    ).length
    const avgHoursPerProduct = totalPrintHours / total
    const layerHeightDist = [0.1, 0.15, 0.2, 0.25].map((h) => ({
      value: h,
      count: PRODUCTS.filter((p) => p.layerHeight === h).length,
    }))

    return {
      total,
      totalReviews,
      avgRating,
      totalPrintHours,
      featuredCount,
      categoryStats,
      materialStats,
      priceStats,
      techSpecs: { noSupportCount, universalCompatCount, avgHoursPerProduct, layerHeightDist },
    }
  }, [])
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string
  value: string
  sub: string
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[var(--sea-ink-soft)]">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[var(--sea-ink-soft)]" />
      </CardHeader>
      <CardContent>
        <div className="display-title text-3xl font-bold text-[var(--lagoon)]">{value}</div>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">{sub}</p>
      </CardContent>
    </Card>
  )
}

// ── Category Distribution ────────────────────────────────────────────────────
function CategoryDistribution({
  categoryStats,
  total,
}: {
  categoryStats: ReturnType<typeof useDashboardStats>['categoryStats']
  total: number
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.sectionCategoryDist}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {categoryStats.map((cat) => {
          const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP]
          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium text-[var(--sea-ink)]">
                  {Icon && <Icon className="h-3.5 w-3.5 text-[var(--sea-ink-soft)]" />}
                  {cat.label}
                </span>
                <span className="tabular-nums text-[var(--sea-ink-soft)]">
                  {cat.count} {strings.dashboard.catOf(total)}
                </span>
              </div>
              <Progress
                value={(cat.count / total) * 100}
                className="h-1.5 [&>div]:bg-[var(--lagoon)]"
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ── Materials Widget ─────────────────────────────────────────────────────────
function MaterialsWidget({
  materialStats,
  total,
}: {
  materialStats: ReturnType<typeof useDashboardStats>['materialStats']
  total: number
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.sectionMaterials}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {materialStats.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--sea-ink)]">{m.name}</span>
                  <span className="tabular-nums text-[var(--sea-ink-soft)]">
                    {m.count} {strings.dashboard.catOf(total)}
                  </span>
                </div>
                <Progress value={m.pct} className="h-1.5 [&>div]:bg-[var(--lagoon)]" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ── Featured Products List ────────────────────────────────────────────────────
function FeaturedProductsList({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.sectionFeatured}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {featured.map((p, i) => (
          <div key={p.id}>
            <Link
              to="/shop/$productId"
              params={{ productId: p.id }}
              className="flex items-center justify-between px-6 py-3 transition hover:bg-[var(--link-bg-hover)]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--sea-ink)]">{p.name}</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">{formatPrice(p.price)}</p>
              </div>
              <div className="ml-3 flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-[var(--lagoon)] text-[var(--lagoon)]" />
                <span className="text-xs font-medium text-[var(--sea-ink-soft)]">
                  {formatRating(p.rating)}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-[var(--sea-ink-soft)]" />
              </div>
            </Link>
            {i < featured.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── Price Stats Card ─────────────────────────────────────────────────────────
function PriceStatsCard({ priceStats }: { priceStats: ReturnType<typeof useDashboardStats>['priceStats'] }) {
  const rows = [
    { label: strings.dashboard.priceMin, value: formatPrice(priceStats.min) },
    { label: strings.dashboard.priceMax, value: formatPrice(priceStats.max) },
    { label: strings.dashboard.priceAvg, value: formatPrice(Math.round(priceStats.avg)) },
  ]
  const range = priceStats.max - priceStats.min

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.sectionPriceStats}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-sm text-[var(--sea-ink-soft)]">{r.label}</span>
            <span className="font-mono text-sm font-semibold text-[var(--lagoon)]">{r.value}</span>
          </div>
        ))}
        <Separator />
        <div className="space-y-2">
          <div className="relative h-6 rounded-full bg-[var(--sand)]">
            {PRODUCTS.map((p) => {
              const pct = ((p.price - priceStats.min) / range) * 100
              return (
                <span
                  key={p.id}
                  title={`${p.name} — ${formatPrice(p.price)}`}
                  className={cn(
                    'absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--lagoon)] shadow-sm transition hover:scale-150',
                    p.featured && 'h-4 w-4 border-[var(--lagoon)]',
                  )}
                  style={{ left: `${pct}%` }}
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Tech Specs Card ───────────────────────────────────────────────────────────
function TechSpecsCard({
  techSpecs,
  total,
}: {
  techSpecs: ReturnType<typeof useDashboardStats>['techSpecs']
  total: number
}) {
  const { noSupportCount, universalCompatCount, avgHoursPerProduct, layerHeightDist } = techSpecs
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.sectionTechSpecs}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--sea-ink-soft)]">{strings.dashboard.specNoSupport}</span>
            <span className="font-medium text-[var(--sea-ink)]">
              {noSupportCount}/{total}
            </span>
          </div>
          <Progress
            value={(noSupportCount / total) * 100}
            className="h-1.5 [&>div]:bg-[var(--lagoon)]"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--sea-ink-soft)]">{strings.dashboard.specUniversalCompat}</span>
            <span className="font-medium text-[var(--sea-ink)]">
              {universalCompatCount}/{total}
            </span>
          </div>
          <Progress
            value={(universalCompatCount / total) * 100}
            className="h-1.5 [&>div]:bg-[var(--lagoon)]"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--sea-ink-soft)]">{strings.dashboard.specAvgPrintTime}</span>
          <span className="font-mono font-medium text-[var(--sea-ink)]">
            {formatHours(avgHoursPerProduct)}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-[var(--sea-ink-soft)]">{strings.dashboard.specLayerHeights}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {layerHeightDist.map((h) => (
              <div key={h.value} className="rounded-lg border border-[var(--line)] p-2 text-center">
                <p className="font-mono text-xs font-semibold text-[var(--lagoon)]">
                  {h.value}mm
                </p>
                <p className="text-xs text-[var(--sea-ink-soft)]">{h.count}x</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Products Table ────────────────────────────────────────────────────────────
function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, products],
  )

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.tableTitle}
        </CardTitle>
        <Input
          placeholder={strings.dashboard.tableSearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 w-full sm:w-64"
        />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">{strings.dashboard.tableColProduct}</TableHead>
                <TableHead className="text-right">{strings.dashboard.tableColPrice}</TableHead>
                <TableHead className="text-right">{strings.dashboard.tableColRating}</TableHead>
                <TableHead className="text-right">{strings.dashboard.tableColReviews}</TableHead>
                <TableHead>{strings.dashboard.tableColMaterials}</TableHead>
                <TableHead>{strings.dashboard.tableColPrintTime}</TableHead>
                <TableHead>{strings.dashboard.tableColFeatured}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <Link
                        to="/shop/$productId"
                        params={{ productId: p.id }}
                        className="font-medium text-[var(--sea-ink)] underline-offset-2 hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-[var(--sea-ink-soft)]">
                        {strings.productDetail.categoryLabels[p.category]}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-[var(--lagoon)]">
                    {formatPrice(p.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Star className="h-3 w-3 fill-[var(--lagoon)] text-[var(--lagoon)]" />
                      <span className="text-sm text-[var(--sea-ink)]">{formatRating(p.rating)}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-[var(--sea-ink-soft)]">
                    {p.reviewCount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.materials.slice(0, 2).map((m) => (
                        <Badge key={m} variant="secondary" className="text-[10px]">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[var(--sea-ink-soft)]">
                    {p.printTime}
                  </TableCell>
                  <TableCell>
                    {p.featured ? (
                      <Badge className="bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]">
                        {strings.dashboard.tableFeaturedYes}
                      </Badge>
                    ) : (
                      <span className="text-sm text-[var(--sea-ink-soft)]">
                        {strings.dashboard.tableFeaturedNo}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-[var(--line)] px-6 py-3">
        <p className="text-xs text-[var(--sea-ink-soft)]">
          {strings.dashboard.tableFooter(filtered.length, products.length)}
        </p>
      </CardFooter>
    </Card>
  )
}

// ── Category Cards Grid ───────────────────────────────────────────────────────
function CategoryCardsGrid({
  categoryStats,
}: {
  categoryStats: ReturnType<typeof useDashboardStats>['categoryStats']
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categoryStats.map((cat) => {
        const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP]
        return (
          <Card key={cat.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              {Icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lagoon)]/10">
                  <Icon className="h-4 w-4 text-[var(--lagoon)]" />
                </div>
              )}
              <div>
                <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">
                  {cat.label}
                </CardTitle>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  {strings.dashboard.catProductCount(cat.count)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[var(--foam)] p-3 dark:bg-[var(--sand)]/5">
                  <p className="text-xs text-[var(--sea-ink-soft)]">{strings.dashboard.catAvgPrice}</p>
                  <p className="font-mono text-sm font-bold text-[var(--lagoon)]">
                    {formatPrice(Math.round(cat.avgPrice))}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--foam)] p-3 dark:bg-[var(--sand)]/5">
                  <p className="text-xs text-[var(--sea-ink-soft)]">{strings.dashboard.catAvgRating}</p>
                  <p className="flex items-center gap-1 text-sm font-bold text-[var(--sea-ink)]">
                    <Star className="h-3 w-3 fill-[var(--lagoon)] text-[var(--lagoon)]" />
                    {formatRating(cat.catAvgRating)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--sea-ink-soft)]">
                <MessageSquare className="h-3 w-3" />
                <span>
                  {cat.catTotalReviews.toLocaleString()} {strings.dashboard.catTotalReviews}
                </span>
              </div>
              <Separator />
              <div className="space-y-1">
                {cat.products.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    to="/shop/$productId"
                    params={{ productId: p.id }}
                    className="flex items-center justify-between rounded-lg px-1 py-0.5 text-xs text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
                  >
                    <span className="truncate">{p.name}</span>
                    <ChevronRight className="ml-1 h-3 w-3 flex-shrink-0 text-[var(--sea-ink-soft)]" />
                  </Link>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link
                to="/shop"
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-[var(--line)] py-2 text-xs font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
              >
                {strings.dashboard.catViewProducts}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function DashboardPage() {
  const stats = useDashboardStats()

  return (
    <main className="page-wrap px-4 py-10">
      <Reveal>
        <p className="island-kicker mb-1">{strings.dashboard.pageEyebrow}</p>
        <h1 className="display-title mb-1 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
          {strings.dashboard.pageTitle}
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">{strings.dashboard.pageSubtitle}</p>
      </Reveal>

      <Tabs defaultValue="overview" className="mt-8">
        <Reveal delay={0.05}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{strings.dashboard.tabOverview}</TabsTrigger>
            <TabsTrigger value="products">{strings.dashboard.tabProducts}</TabsTrigger>
            <TabsTrigger value="categories">{strings.dashboard.tabCategories}</TabsTrigger>
          </TabsList>
        </Reveal>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI row */}
          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <KpiCard
                title={strings.dashboard.kpiTotalProducts}
                value={String(stats.total)}
                sub={strings.dashboard.kpiFeaturedBadge(stats.featuredCount)}
                icon={Package}
              />
              <KpiCard
                title={strings.dashboard.kpiTotalReviews}
                value={stats.totalReviews.toLocaleString()}
                sub={strings.dashboard.kpiReviewsUnit}
                icon={MessageSquare}
              />
              <KpiCard
                title={strings.dashboard.kpiAvgRating}
                value={`${formatRating(stats.avgRating)} ★`}
                sub={strings.dashboard.kpiInStockBadge}
                icon={Star}
              />
              <KpiCard
                title={strings.dashboard.kpiPrintHours}
                value={formatHours(stats.totalPrintHours)}
                sub={strings.dashboard.kpiHoursUnit}
                icon={Timer}
              />
            </div>
          </Reveal>

          {/* Category + Materials row */}
          <Reveal delay={0.12}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="md:col-span-3">
                <CategoryDistribution
                  categoryStats={stats.categoryStats}
                  total={stats.total}
                />
              </div>
              <div className="md:col-span-2">
                <MaterialsWidget
                  materialStats={stats.materialStats}
                  total={stats.total}
                />
              </div>
            </div>
          </Reveal>

          {/* Featured + Price + Tech row */}
          <Reveal delay={0.16}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FeaturedProductsList products={PRODUCTS} />
              <PriceStatsCard priceStats={stats.priceStats} />
              <TechSpecsCard techSpecs={stats.techSpecs} total={stats.total} />
            </div>
          </Reveal>
        </TabsContent>

        {/* ── Products Table ── */}
        <TabsContent value="products">
          <Reveal>
            <ProductsTable products={PRODUCTS} />
          </Reveal>
        </TabsContent>

        {/* ── Categories ── */}
        <TabsContent value="categories">
          <Reveal>
            <CategoryCardsGrid categoryStats={stats.categoryStats} />
          </Reveal>
        </TabsContent>
      </Tabs>
    </main>
  )
}
