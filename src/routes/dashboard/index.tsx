import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
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
  Eye,
  ShoppingCart,
  Printer,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '../../lib/data'
import { strings } from '../../lib/strings'
import { cn, formatPrice, formatRating } from '../../lib/utils'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'

export const Route = createFileRoute('/dashboard/')({
  component: OverviewPage,
})

// ── Static data ───────────────────────────────────────────────────────────────

const ICON_MAP = { Home, Gamepad2, Wrench, Palette, Settings2 } as const

const ACTIVITY_FEED = [
  { id: 1, type: 'view',   Icon: Eye,         html: strings.dashboard.activityView1,   time: 'há 5 phút'  },
  { id: 2, type: 'order',  Icon: ShoppingCart, html: strings.dashboard.activityOrder1,  time: 'há 18 phút' },
  { id: 3, type: 'review', Icon: Star,         html: strings.dashboard.activityReview1, time: 'há 42 phút' },
  { id: 4, type: 'print',  Icon: Printer,      html: strings.dashboard.activityPrint1,  time: 'há 1 giờ'   },
  { id: 5, type: 'view',   Icon: Eye,         html: strings.dashboard.activityView2,   time: 'há 2 giờ'   },
  { id: 6, type: 'order',  Icon: ShoppingCart, html: strings.dashboard.activityOrder2,  time: 'há 3 giờ'   },
  { id: 7, type: 'review', Icon: Star,         html: strings.dashboard.activityReview2, time: 'há 5 giờ'   },
  { id: 8, type: 'print',  Icon: Printer,      html: strings.dashboard.activityPrint2,  time: 'há 6 giờ'   },
]

const KPI_TRENDS = {
  products:   { delta: '+12%', dir: 'up'   as const, spark: [20, 28, 22, 35, 30, 42, 48] },
  reviews:    { delta: '+8%',  dir: 'up'   as const, spark: [120, 145, 138, 160, 175, 160, 187] },
  rating:     { delta: '+0.2', dir: 'up'   as const, spark: [4.2, 4.3, 4.1, 4.4, 4.5, 4.4, 4.6] },
  printHours: { delta: '-3%',  dir: 'down' as const, spark: [320, 290, 310, 280, 270, 295, 277] },
}

const KPI_ACCENTS = {
  products:   { color: '#185FA5', bg: 'rgba(24,95,165,0.10)' },
  reviews:    { color: '#BA7517', bg: 'rgba(186,117,23,0.10)' },
  rating:     { color: '#3B6D11', bg: 'rgba(59,109,17,0.10)' },
  printHours: { color: '#d4511a', bg: 'rgba(212,81,26,0.10)' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function buildSparkPoints(data: number[], w = 64, h = 28, pad = 3): string {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  return data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - 2 * pad)
      const y = h - pad - ((v - min) / range) * (h - 2 * pad)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function useDashboardStats() {
  return useMemo(() => {
    const total = PRODUCTS.length
    const totalReviews = PRODUCTS.reduce((s, p) => s + p.reviewCount, 0)
    const avgRating = PRODUCTS.reduce((s, p) => s + p.rating, 0) / total
    const totalPrintHours = PRODUCTS.reduce((s, p) => s + parsePrintHours(p.printTime), 0)

    const categoryStats = CATEGORIES.map((cat) => {
      const products = PRODUCTS.filter((p) => p.category === cat.id)
      const count = products.length
      const avgPrice = count > 0 ? products.reduce((s, p) => s + p.price, 0) / count : 0
      const catAvgRating = count > 0 ? products.reduce((s, p) => s + p.rating, 0) / count : 0
      return { ...cat, products, count, avgPrice, catAvgRating }
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

    return {
      total,
      totalReviews,
      avgRating,
      totalPrintHours,
      categoryStats,
      materialStats,
      priceStats,
      techSpecs: { noSupportCount, universalCompatCount, avgHoursPerProduct },
    }
  }, [])
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ data, color, w = 64, h = 28 }: { data: number[]; color: string; w?: number; h?: number }) {
  const points = buildSparkPoints(data, w, h)
  const pad = 3
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const last = data[data.length - 1]
  const lx = pad + w - 2 * pad
  const ly = h - pad - ((last - min) / range) * (h - 2 * pad)

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  )
}

// ── Welcome Banner ────────────────────────────────────────────────────────────

function WelcomeBanner() {
  const dateStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className="text-xl font-bold text-[var(--sea-ink)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {strings.dashboard.welcomeHeading}
            </h2>
            <p className="mt-0.5 text-sm capitalize text-[var(--sea-ink-soft)]">{dateStr}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">{strings.dashboard.viewStore}</Link>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled>
                    {strings.dashboard.exportReport}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{strings.dashboard.exportReportSoon}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Activity Feed ─────────────────────────────────────────────────────────────

const ACTIVITY_ICON_COLORS: Record<string, string> = {
  view:   'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
  order:  'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  review: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  print:  'bg-[rgba(212,81,26,0.10)] text-[var(--lagoon)]',
}

function ActivityFeed() {
  const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">
              {strings.dashboard.recentActivity}
            </CardTitle>
            <span className="text-xs text-[var(--sea-ink-soft)]">
              {strings.dashboard.updatedAt} {time}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[200px]">
            {ACTIVITY_FEED.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="flex items-start gap-3 border-b border-[var(--line)] px-4 py-2.5 last:border-0"
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    ACTIVITY_ICON_COLORS[item.type],
                  )}
                >
                  <item.Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs text-[var(--sea-ink)] [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: item.html }}
                  />
                  <p className="mt-0.5 text-[10px] text-[var(--sea-ink-soft)]">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  icon: Icon,
  spark,
  delta,
  dir,
  accentColor,
  iconBg,
  index,
}: {
  title: string
  value: string
  icon: React.ElementType
  spark: number[]
  delta: string
  dir: 'up' | 'down'
  accentColor: string
  iconBg: string
  index: number
}) {
  const TrendIcon = dir === 'up' ? TrendingUp : TrendingDown
  const trendClass =
    dir === 'up'
      ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
      : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                {title}
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span
                  className="text-[26px] font-bold leading-none tabular-nums text-[var(--sea-ink)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {value}
                </span>
                <Sparkline data={spark} color={accentColor} />
              </div>
            </div>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: iconBg }}
            >
              <Icon className="h-4 w-4" style={{ color: accentColor }} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                trendClass,
              )}
            >
              <TrendIcon className="h-2.5 w-2.5" />
              {delta}
            </span>
            <span className="text-[10px] text-[var(--sea-ink-soft)]">{strings.dashboard.vsLastMonth}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Top Products Table ────────────────────────────────────────────────────────

type TopSortKey = 'rating' | 'price' | 'reviewCount'

function renderSortIcon(col: TopSortKey, sortKey: TopSortKey, sortDir: 1 | -1) {
  if (col !== sortKey) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />
  return sortDir === -1
    ? <ArrowDown className="ml-1 inline h-3 w-3 text-[var(--lagoon)]" />
    : <ArrowUp className="ml-1 inline h-3 w-3 text-[var(--lagoon)]" />
}

function TopProductsTable() {
  const [sortKey, setSortKey] = useState<TopSortKey>('rating')
  const [sortDir, setSortDir] = useState<1 | -1>(-1)

  const sorted = useMemo(
    () =>
      [...PRODUCTS]
        .sort((a, b) => ((a[sortKey] as number) - (b[sortKey] as number)) * sortDir)
        .slice(0, 5),
    [sortKey, sortDir],
  )

  function handleSort(key: TopSortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1))
    else { setSortKey(key); setSortDir(-1) }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.topRatedProducts}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-[var(--sea-ink-soft)]">
          <Link to="/dashboard/products">{strings.dashboard.viewAllProducts}</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">{strings.dashboard.colName}</TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort('price')}
              >
                {strings.dashboard.colPrice}
                {renderSortIcon('price', sortKey, sortDir)}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort('rating')}
              >
                {strings.dashboard.colRating}
                {renderSortIcon('rating', sortKey, sortDir)}
              </TableHead>
              <TableHead className="pr-4">{strings.dashboard.colStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="pl-4">
                  <div>
                    <Link
                      to="/shop/$productId"
                      params={{ productId: p.id }}
                      className="text-sm font-medium text-[var(--sea-ink)] underline-offset-2 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-[var(--sea-ink-soft)]">
                      {strings.productDetail.categoryLabels[p.category]}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="tabular-nums text-sm font-semibold text-[var(--lagoon)]">
                    {formatPrice(p.price)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-1">
                    <Star className="h-3 w-3 fill-[var(--lagoon)] text-[var(--lagoon)]" />
                    <span className="tabular-nums text-sm text-[var(--sea-ink)]">{formatRating(p.rating)}</span>
                  </span>
                </TableCell>
                <TableCell className="pr-4">
                  {p.featured ? (
                    <Badge className="gap-1 bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]">
                      <Zap className="h-2.5 w-2.5" />
                      {strings.dashboard.statusFeatured}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{strings.dashboard.statusActive}</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ── Quick Stats ───────────────────────────────────────────────────────────────

function QuickStatsCard({ stats }: { stats: ReturnType<typeof useDashboardStats> }) {
  const cells = [
    { label: strings.dashboard.avgPrice, value: formatPrice(Math.round(stats.priceStats.avg)) },
    { label: strings.dashboard.avgHours, value: formatHours(stats.techSpecs.avgHoursPerProduct) },
    {
      label: strings.dashboard.noSupportPct,
      value: `${Math.round((stats.techSpecs.noSupportCount / stats.total) * 100)}%`,
    },
    {
      label: strings.dashboard.universalCompatPct,
      value: `${Math.round((stats.techSpecs.universalCompatCount / stats.total) * 100)}%`,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.quickStats}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {cells.map((c) => (
            <div key={c.label} className="rounded-xl bg-[var(--foam)] p-3 dark:bg-[var(--sand)]/5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                {c.label}
              </p>
              <p
                className="mt-1 tabular-nums text-base font-bold text-[var(--sea-ink)]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Top Materials ─────────────────────────────────────────────────────────────

function TopMaterialsCard({
  materialStats,
}: {
  materialStats: ReturnType<typeof useDashboardStats>['materialStats']
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.materialBreakdown}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[180px]">
          <div className="space-y-3 pr-2">
            {materialStats.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--sea-ink)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--lagoon)]" />
                    {m.name}
                  </span>
                  <span className="tabular-nums text-[var(--sea-ink-soft)]">{m.pct.toFixed(0)}%</span>
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

// ── Category Distribution ─────────────────────────────────────────────────────

function CategoryDistCard({
  categoryStats,
  total,
}: {
  categoryStats: ReturnType<typeof useDashboardStats>['categoryStats']
  total: number
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">
          {strings.dashboard.categoryDist}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryStats.map((cat) => {
          const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP]
          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[var(--sea-ink)]">
                  {Icon && <Icon className="h-3 w-3 text-[var(--sea-ink-soft)]" />}
                  {cat.label}
                </span>
                <span className="tabular-nums text-[var(--sea-ink-soft)]">
                  {cat.count}/{total}
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

// ── Overview Page ─────────────────────────────────────────────────────────────

function OverviewPage() {
  const stats = useDashboardStats()

  const kpiItems = [
    {
      key: 'products',
      title: strings.dashboard.kpiTotalProducts,
      value: String(stats.total),
      icon: Package,
      ...KPI_TRENDS.products,
      ...KPI_ACCENTS.products,
    },
    {
      key: 'reviews',
      title: strings.dashboard.kpiTotalReviews,
      value: stats.totalReviews.toLocaleString(),
      icon: MessageSquare,
      ...KPI_TRENDS.reviews,
      ...KPI_ACCENTS.reviews,
    },
    {
      key: 'rating',
      title: strings.dashboard.kpiAvgRating,
      value: `${formatRating(stats.avgRating)} ★`,
      icon: Star,
      ...KPI_TRENDS.rating,
      ...KPI_ACCENTS.rating,
    },
    {
      key: 'printHours',
      title: strings.dashboard.kpiPrintHours,
      value: formatHours(stats.totalPrintHours),
      icon: Timer,
      ...KPI_TRENDS.printHours,
      ...KPI_ACCENTS.printHours,
    },
  ]

  return (
    <div className="space-y-4">
      <WelcomeBanner />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiItems.map((item, i) => (
          <KpiCard
            key={item.key}
            title={item.title}
            value={item.value}
            icon={item.icon}
            spark={item.spark}
            delta={item.delta}
            dir={item.dir}
            accentColor={item.color}
            iconBg={item.bg}
            index={i}
          />
        ))}
      </div>

      <ActivityFeed />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <TopProductsTable />
        </div>
        <div className="space-y-4">
          <QuickStatsCard stats={stats} />
          <TopMaterialsCard materialStats={stats.materialStats} />
          <CategoryDistCard categoryStats={stats.categoryStats} total={stats.total} />
        </div>
      </motion.div>
    </div>
  )
}
