import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { ShoppingCart, Timer, Layers, AlertCircle, Printer } from 'lucide-react'
import ProductImageGallery from '../../components/ProductImageGallery'
import ProductViewer3D from '../../components/ProductViewer3D'
import ProductGrid from '../../components/ProductGrid'
import StarRating from '../../components/StarRating'
import { useCart } from '../../contexts/CartContext'
import { PRODUCTS } from '../../lib/data'
import { strings } from '../../lib/strings'
import type { Material } from '../../lib/types'
import { cn, formatPrice } from '../../lib/utils'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'

export const Route = createFileRoute('/shop/$productId')({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.productId)
    if (!product) throw notFound()
    return { product }
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetailPage,
})

function ProductNotFound() {
  return (
    <main className="page-wrap py-20 text-center">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)]">{strings.productDetail.notFoundTitle}</h1>
      <p className="mt-2 text-[var(--sea-ink-soft)]">
        {strings.productDetail.notFoundDesc}
      </p>
      <Link to="/shop">
        <Button className="mt-6">{strings.productDetail.backToShop}</Button>
      </Link>
    </main>
  )
}

function ProductDetailPage() {
  const { product } = Route.useLoaderData()
  const { addItem } = useCart()
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(product.materials[0])
  const [activeTab, setActiveTab] = useState<'photos' | '3d'>('photos')

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  function handleAddToCart() {
    addItem(product, selectedMaterial)
  }

  return (
    <main className="page-wrap py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--sea-ink-soft)]">
        <Link to="/" className="hover:text-[var(--sea-ink)]">{strings.productDetail.breadcrumbHome}</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[var(--sea-ink)]">{strings.productDetail.breadcrumbShop}</Link>
        <span>/</span>
        <span className="text-[var(--sea-ink)]">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          {product.modelUrl && (
            <div className="flex gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
              {(['photos', '3d'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all',
                    activeTab === tab
                      ? 'bg-[var(--lagoon)] text-white shadow-sm'
                      : 'text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]',
                  )}
                >
                  {tab === 'photos' ? strings.productDetail.tabPhotos : strings.productDetail.tab3D}
                </button>
              ))}
            </div>
          )}
          {activeTab === '3d' && product.modelUrl ? (
            <ProductViewer3D modelUrl={product.modelUrl} />
          ) : (
            <ProductImageGallery images={product.images} name={product.name} />
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="island-kicker mb-1">{strings.productDetail.categoryLabels[product.category] ?? product.category.replace('-', ' ')}</p>
            <h1 className="text-balance text-3xl font-bold text-[var(--sea-ink)] md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-[var(--sea-ink-soft)]">{product.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[var(--lagoon)]">{formatPrice(product.price)}</span>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
          </div>

          <p className="text-sm leading-relaxed text-[var(--sea-ink-soft)]">{product.description}</p>

          <Separator />

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]">
                {strings.productDetail.materialLabel}
              </label>
              <Select
                value={selectedMaterial}
                onValueChange={(v) => setSelectedMaterial(v as Material)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.materials.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              size="lg"
              className="w-full bg-[var(--lagoon)] text-white hover:opacity-90"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? strings.productDetail.addToCart : strings.productDetail.outOfStock}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--sea-ink)]">{strings.productDetail.printSpecs}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <Layers className="h-4 w-4 flex-shrink-0" />
                <span>{strings.productDetail.layerHeight(product.layerHeight)}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <Timer className="h-4 w-4 flex-shrink-0" />
                <span>{strings.productDetail.printTime(product.printTime)}</span>
              </div>
              {product.supportRequired && (
                <div className="col-span-2 flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{strings.productDetail.requiresSupports}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
              <Printer className="mr-1.5 inline h-4 w-4" />
              {strings.productDetail.printerCompat}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.printerCompatibility.map((p) => (
                <Badge key={p} variant="outline" className="border-[var(--lagoon)] text-[var(--lagoon)] text-xs">
                  {p === 'All' ? strings.productDetail.allBambu : p}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-[var(--sea-ink)]">{strings.productDetail.relatedProducts}</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  )
}
