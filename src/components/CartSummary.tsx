import { Link } from '@tanstack/react-router'
import { useCart } from '../contexts/CartContext'
import { strings } from '../lib/strings'
import { formatPrice } from '../lib/utils'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export default function CartSummary({ onClose }: { onClose?: () => void }) {
  const { subtotal, totalItems, clearCart } = useCart()
  const shipping = subtotal > 5000 ? 0 : 599
  const total = subtotal + shipping

  return (
    <div className="space-y-4">
      <Separator />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[var(--sea-ink-soft)]">
          <span>{strings.cart.subtotal(totalItems)}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[var(--sea-ink-soft)]">
          <span>{strings.cart.shipping}</span>
          <span>{shipping === 0 ? strings.cart.free : formatPrice(shipping)}</span>
        </div>
        {subtotal > 0 && subtotal < 5000 && (
          <p className="text-xs text-[var(--lagoon)]">
            {strings.cart.freeShippingPromo(formatPrice(5000 - subtotal))}
          </p>
        )}
        <Separator />
        <div className="flex justify-between font-semibold text-[var(--sea-ink)]">
          <span>{strings.cart.total}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Link to="/checkout" onClick={onClose}>
        <Button className="w-full bg-[var(--lagoon)] text-white hover:opacity-90">
          {strings.cart.proceedToCheckout}
        </Button>
      </Link>
      <Button
        variant="ghost"
        className="w-full text-xs text-[var(--sea-ink-soft)]"
        onClick={clearCart}
      >
        {strings.cart.clearCart}
      </Button>
    </div>
  )
}
