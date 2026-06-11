import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle2, Package } from 'lucide-react'
import OrderSummaryPanel from '../components/OrderSummaryPanel'
import ShippingFormSection from '../components/ShippingFormSection'
import { useCart } from '../contexts/CartContext'
import { strings } from '../lib/strings'
import type { ShippingForm } from '../lib/types'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

const EMPTY_FORM: ShippingForm = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
}

function CheckoutPage() {
  const { items, clearCart } = useCart()
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({})
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null)

  if (orderPlaced) {
    return (
      <main className="page-wrap py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[var(--lagoon)]" strokeWidth={1.5} />
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">{strings.checkout.orderConfirmedTitle}</h1>
        <p className="mt-2 text-[var(--sea-ink-soft)]">
          {strings.checkout.orderThankYouPrefix}
          <span className="font-mono font-semibold text-[var(--sea-ink)]">{orderPlaced}</span>
          {strings.checkout.orderThankYouSuffix}
        </p>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          {strings.checkout.orderEmailPrefix}
          {form.email}
          {strings.checkout.orderEmailSuffix}
        </p>
        <Link to="/shop">
          <Button className="mt-8 bg-[var(--lagoon)] text-white hover:opacity-90">
            <Package className="mr-2 h-4 w-4" />
            {strings.checkout.continueShopping}
          </Button>
        </Link>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="page-wrap py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">{strings.checkout.emptyCart}</h1>
        <Link to="/shop">
          <Button className="mt-6 bg-[var(--lagoon)] text-white hover:opacity-90">{strings.checkout.browseShop}</Button>
        </Link>
      </main>
    )
  }

  function validate(): boolean {
    const required: (keyof ShippingForm)[] = [
      'firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip', 'country',
    ]
    const newErrors: Partial<Record<keyof ShippingForm, string>> = {}
    for (const field of required) {
      if (!form[field].trim()) newErrors[field] = strings.checkout.fieldRequired
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = strings.checkout.invalidEmail
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const orderNum = `PF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    clearCart()
    setOrderPlaced(orderNum)
  }

  return (
    <main className="page-wrap py-10">
      <h1 className="mb-8 text-2xl font-bold text-[var(--sea-ink)] md:text-3xl">{strings.checkout.title}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ShippingFormSection
              form={form}
              onChange={(field, value) => {
                setForm((f) => ({ ...f, [field]: value }))
                setErrors((e) => ({ ...e, [field]: undefined }))
              }}
              errors={errors}
            />

            <div className="rounded-xl border border-[var(--line)] p-5 space-y-3">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{strings.checkout.paymentTitle}</h2>
              <p className="text-sm text-[var(--sea-ink-soft)]">
                {strings.checkout.paymentDemoNote}
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[var(--lagoon)] text-white hover:opacity-90"
            >
              {strings.checkout.placeOrder}
            </Button>
          </div>

          <div>
            <OrderSummaryPanel />
          </div>
        </div>
      </form>
    </main>
  )
}
