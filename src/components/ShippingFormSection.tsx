import type { ShippingForm } from '../lib/types'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface ShippingFormSectionProps {
  form: ShippingForm
  onChange: (field: keyof ShippingForm, value: string) => void
  errors: Partial<Record<keyof ShippingForm, string>>
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
}: {
  id: keyof ShippingForm
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-[var(--sea-ink)]">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function ShippingFormSection({ form, onChange, errors }: ShippingFormSectionProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-[var(--sea-ink)]">Shipping Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field id="firstName" label="First Name" value={form.firstName} onChange={(v) => onChange('firstName', v)} error={errors.firstName} placeholder="Ada" />
        <Field id="lastName" label="Last Name" value={form.lastName} onChange={(v) => onChange('lastName', v)} error={errors.lastName} placeholder="Lovelace" />
      </div>

      <Field id="email" label="Email" type="email" value={form.email} onChange={(v) => onChange('email', v)} error={errors.email} placeholder="ada@example.com" />

      <Field id="address" label="Address" value={form.address} onChange={(v) => onChange('address', v)} error={errors.address} placeholder="123 Main St" />

      <div className="grid grid-cols-2 gap-4">
        <Field id="city" label="City" value={form.city} onChange={(v) => onChange('city', v)} error={errors.city} placeholder="New York" />
        <Field id="state" label="State" value={form.state} onChange={(v) => onChange('state', v)} error={errors.state} placeholder="NY" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field id="zip" label="ZIP Code" value={form.zip} onChange={(v) => onChange('zip', v)} error={errors.zip} placeholder="10001" />
        <Field id="country" label="Country" value={form.country} onChange={(v) => onChange('country', v)} error={errors.country} placeholder="United States" />
      </div>
    </div>
  )
}
