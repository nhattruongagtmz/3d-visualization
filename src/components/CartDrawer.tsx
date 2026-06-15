import { ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { strings } from '../lib/strings'
import CartItemRow from './CartItemRow'
import CartSummary from './CartSummary'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'
import { Separator } from './ui/separator'

export default function CartDrawer() {
  const { isOpen, closeCart, items } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[var(--sea-ink)]">
            <ShoppingBag className="h-5 w-5" />
            {strings.cart.drawerTitle}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-[var(--sea-ink-soft)]" strokeWidth={1} />
            <p className="text-sm text-[var(--sea-ink-soft)]">{strings.cart.empty}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="divide-y divide-[var(--line)]">
                {items.map((item) => (
                  <CartItemRow key={`${item.product.id}-${item.selectedMaterial}`} item={item} />
                ))}
              </div>
            </div>
            <Separator />
            <div className="px-4 pb-4">
              <CartSummary onClose={closeCart} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
