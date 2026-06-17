import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Search, Star, Zap, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { PRODUCTS } from '../../lib/data'
import type { Product } from '../../lib/types'
import { strings } from '../../lib/strings'
import { formatPrice, formatRating } from '../../lib/utils'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

export const Route = createFileRoute('/dashboard/products')({
  component: ProductsPage,
})

// ── Products Table ─────────────────────────────────────────────────────────────

type SortKey = 'name' | 'price' | 'rating' | 'reviewCount'

function renderSortIcon(col: SortKey, sortKey: SortKey, sortDir: 1 | -1) {
  if (col !== sortKey) return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-30" />
  return sortDir === -1
    ? <ArrowDown className="ml-1 inline h-3 w-3 text-[var(--lagoon)]" />
    : <ArrowUp className="ml-1 inline h-3 w-3 text-[var(--lagoon)]" />
}

function ProductsTable() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('rating')
  const [sortDir, setSortDir] = useState<1 | -1>(-1)

  const categories = useMemo(() => [...new Set(PRODUCTS.map((p) => p.category))], [])

  const filtered = useMemo(() => {
    let list: Product[] = PRODUCTS
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      )
    }
    if (catFilter && catFilter !== 'all') {
      list = list.filter((p) => p.category === catFilter)
    }
    return [...list].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name) * sortDir
      return ((a[sortKey] as number) - (b[sortKey] as number)) * sortDir
    })
  }, [search, catFilter, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1))
    else { setSortKey(key); setSortDir(-1) }
  }

  function clearFilters() {
    setSearch('')
    setCatFilter('all')
  }

  const isFiltered = search !== '' || catFilter !== 'all'

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[180px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
            <Input
              placeholder={strings.dashboard.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8"
            />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="h-8 w-48">
              <SelectValue placeholder={strings.dashboard.allCategories} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{strings.dashboard.allCategories}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {strings.productDetail.categoryLabels[c] ?? c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="min-w-[200px] cursor-pointer select-none pl-4"
                  onClick={() => handleSort('name')}
                >
                  {strings.dashboard.colName}
                  {renderSortIcon('name', sortKey, sortDir)}
                </TableHead>
                <TableHead>{strings.dashboard.colCategory}</TableHead>
                <TableHead>{strings.dashboard.colMaterial}</TableHead>
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
                <TableHead>{strings.dashboard.colHours}</TableHead>
                <TableHead>{strings.dashboard.colStatus}</TableHead>
                <TableHead className="w-12 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell className="pl-4">
                    <Link
                      to="/shop/$productId"
                      params={{ productId: p.id }}
                      className="text-sm font-medium text-[var(--sea-ink)] underline-offset-2 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--sea-ink-soft)]">
                    {strings.productDetail.categoryLabels[p.category]}
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
                  <TableCell className="font-mono text-xs text-[var(--sea-ink-soft)]">
                    {p.printTime}
                  </TableCell>
                  <TableCell>
                    {p.featured ? (
                      <Badge className="gap-1 bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]">
                        <Zap className="h-2.5 w-2.5" />
                        {strings.dashboard.statusFeatured}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{strings.dashboard.statusActive}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-7 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Link to="/shop/$productId" params={{ productId: p.id }}>
                        {strings.dashboard.viewProduct}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-[var(--line)] px-6 py-3">
        <p className="text-xs text-[var(--sea-ink-soft)]">
          {strings.dashboard.showingOf}{' '}
          <strong className="text-[var(--sea-ink)]">{filtered.length}</strong> / {PRODUCTS.length}
        </p>
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-[var(--lagoon)] hover:underline"
          >
            {strings.dashboard.clearFilters}
          </button>
        )}
      </CardFooter>
    </Card>
  )
}

// ── Products Page ─────────────────────────────────────────────────────────────

function ProductsPage() {
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
          {strings.admin.sidebarProducts}
        </h2>
        <p className="text-sm text-[var(--sea-ink-soft)]">Quản lý tất cả sản phẩm trong cửa hàng</p>
      </div>
      <ProductsTable />
    </motion.div>
  )
}
