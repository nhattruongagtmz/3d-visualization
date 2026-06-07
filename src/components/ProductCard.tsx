import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import type { Product } from '../lib/types'
import { formatPrice } from '../lib/utils'
import StarRating from './StarRating'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product, product.materials[0])
  }

  return (
    <Card className="feature-card group overflow-hidden p-0 transition-shadow hover:shadow-lg">
      <Link to="/shop/$productId" params={{ productId: product.id }} className="no-underline">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon)]">
              Featured
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-semibold text-white">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight text-[var(--sea-ink)]">
              {product.name}
            </h3>
            <span className="flex-shrink-0 text-sm font-bold text-[var(--lagoon)]">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="mb-2 text-xs text-[var(--sea-ink-soft)] line-clamp-1">{product.tagline}</p>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mb-3" />
          <div className="flex flex-wrap gap-1 mb-3">
            {product.materials.slice(0, 2).map((m) => (
              <Badge key={m} variant="secondary" className="text-[10px] px-1.5 py-0">
                {m}
              </Badge>
            ))}
            {product.printerCompatibility.includes('All') && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[var(--lagoon)] text-[var(--lagoon)]">
                All Printers
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <div className="px-4 pb-4">
        <Button
          size="sm"
          className="w-full bg-[var(--lagoon)] text-white hover:opacity-90"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}
