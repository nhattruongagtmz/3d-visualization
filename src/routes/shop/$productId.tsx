import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { ShoppingCart, Timer, Layers, AlertCircle, Printer } from 'lucide-react'
import ProductImageGallery from '../../components/ProductImageGallery'
import ProductGrid from '../../components/ProductGrid'
import StarRating from '../../components/StarRating'
import { useCart } from '../../contexts/CartContext'
import { PRODUCTS } from '../../lib/data'
import type { Material } from '../../lib/types'
import { formatPrice } from '../../lib/utils'
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
      <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Product Not Found</h1>
      <p className="mt-2 text-[var(--sea-ink-soft)]">
        This product doesn't exist or has been removed.
      </p>
      <Link to="/shop">
        <Button className="mt-6">Back to Shop</Button>
      </Link>
    </main>
  )
}

function ProductDetailPage() {
  const { product } = Route.useLoaderData()
  const { addItem } = useCart()
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(product.materials[0])

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  function handleAddToCart() {
    addItem(product, selectedMaterial)
  }

  return (
    <main className="page-wrap py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--sea-ink-soft)]">
        <Link to="/" className="hover:text-[var(--sea-ink)]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[var(--sea-ink)]">Shop</Link>
        <span>/</span>
        <span className="text-[var(--sea-ink)]">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductImageGallery images={product.images} name={product.name} />

        <div className="space-y-5">
          <div>
            <p className="island-kicker mb-1 capitalize">{product.category.replace('-', ' ')}</p>
            <h1 className="text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">{product.name}</h1>
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
                Material
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
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--sea-ink)]">Print Specs</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <Layers className="h-4 w-4 flex-shrink-0" />
                <span>Layer height: {product.layerHeight} mm</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--sea-ink-soft)]">
                <Timer className="h-4 w-4 flex-shrink-0" />
                <span>Print time: {product.printTime}</span>
              </div>
              {product.supportRequired && (
                <div className="col-span-2 flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Requires supports</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
              <Printer className="mr-1.5 inline h-4 w-4" />
              Printer Compatibility
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.printerCompatibility.map((p) => (
                <Badge key={p} variant="outline" className="border-[var(--lagoon)] text-[var(--lagoon)] text-xs">
                  {p === 'All' ? 'All Bambu Lab' : p}
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
          <h2 className="mb-6 text-xl font-bold text-[var(--sea-ink)]">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  )
}
