import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../lib/utils'
import type { CartItem } from '../lib/types'
import { Button } from './ui/button'

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-3 py-4">
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">{item.product.name}</p>
        <p className="text-xs text-[var(--sea-ink-soft)]">{item.selectedMaterial}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--sea-ink)]">
              {formatPrice(item.product.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[var(--sea-ink-soft)] hover:text-destructive"
              onClick={() => removeItem(item.product.id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
