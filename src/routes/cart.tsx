import { Link, createFileRoute } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'
import CartItemRow from '../components/CartItemRow'
import CartSummary from '../components/CartSummary'
import { useCart } from '../contexts/CartContext'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { items } = useCart()

  return (
    <main className="page-wrap py-10">
      <h1 className="mb-8 text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-[var(--sea-ink-soft)]" strokeWidth={1} />
          <p className="text-[var(--sea-ink-soft)]">Your cart is empty.</p>
          <Link to="/shop">
            <Button className="bg-[var(--lagoon)] text-white hover:opacity-90">
              Browse the Shop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)] px-4">
              {items.map((item) => (
                <CartItemRow key={`${item.product.id}-${item.selectedMaterial}`} item={item} />
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-[var(--line)] p-5 space-y-4">
              <h2 className="font-semibold text-[var(--sea-ink)]">Order Summary</h2>
              <Separator />
              <CartSummary />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
