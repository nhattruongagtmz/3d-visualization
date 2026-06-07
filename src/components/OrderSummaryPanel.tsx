import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../lib/utils'
import { Separator } from './ui/separator'

export default function OrderSummaryPanel() {
  const { items, subtotal, totalItems } = useCart()
  const shipping = subtotal > 5000 ? 0 : 599
  const total = subtotal + shipping

  return (
    <div className="rounded-xl border border-[var(--line)] p-5 space-y-4">
      <h2 className="font-semibold text-[var(--sea-ink)]">Order Summary</h2>
      <Separator />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.selectedMaterial}`} className="flex gap-3">
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="h-12 w-12 flex-shrink-0 rounded-md object-cover"
            />
            <div className="flex flex-1 justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--sea-ink)]">{item.product.name}</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">{item.selectedMaterial} × {item.quantity}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-[var(--sea-ink)]">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[var(--sea-ink-soft)]">
          <span>Subtotal ({totalItems} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[var(--sea-ink-soft)]">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-[var(--sea-ink)] pt-1 border-t border-[var(--line)]">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
