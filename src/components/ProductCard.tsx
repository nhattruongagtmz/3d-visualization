import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@contexts/CartContext'
import { strings } from '@lib/strings'
import type { Product } from '@lib/types'
import { cn, formatPrice } from '@lib/utils'
import StarRating from './StarRating'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface Props {
  product: Product
  large?: boolean
}

export default function ProductCard({ product, large }: Props) {
  const { addItem } = useCart()

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product, product.materials[0])
  }

  return (
    <Card className="feature-card group flex h-full flex-col overflow-hidden p-0">
      <Link
        to="/shop/$productId"
        params={{ productId: product.id }}
        className="flex flex-1 flex-col no-underline"
      >
        <div className="relative flex-shrink-0 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={cn(
              'w-full object-cover transition-transform duration-300 group-hover:scale-105',
              large ? 'h-72' : 'h-52',
            )}
          />
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon)]">
              {strings.product.featuredBadge}
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-semibold text-white">{strings.product.outOfStock}</span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight text-[var(--sea-ink)]">
              {product.name}
            </h3>
            <span className="flex-shrink-0 text-sm font-bold text-[var(--lagoon)]">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="mb-2 line-clamp-1 text-xs text-[var(--sea-ink-soft)]">{product.tagline}</p>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mb-3" />
          <div className="mt-auto flex flex-wrap gap-1">
            {product.materials.slice(0, 2).map((m) => (
              <Badge key={m} variant="secondary" className="px-1.5 py-0 text-[10px]">
                {m}
              </Badge>
            ))}
            {product.printerCompatibility.includes('All') && (
              <Badge
                variant="outline"
                className="border-[var(--lagoon)] px-1.5 py-0 text-[10px] text-[var(--lagoon)]"
              >
                {strings.product.allPrinters}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>

      <div className="px-4 pb-4 pt-0">
        <Button
          size="sm"
          className="w-full bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          {product.inStock ? strings.product.addToCart : strings.product.outOfStock}
        </Button>
      </div>
    </Card>
  )
}
