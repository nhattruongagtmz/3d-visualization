import type { ShippingForm } from '../lib/types'
import { strings } from '../lib/strings'
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

const s = strings.shipping
const p = strings.shipping.placeholders

export default function ShippingFormSection({ form, onChange, errors }: ShippingFormSectionProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{s.sectionTitle}</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field id="firstName" label={s.firstName} value={form.firstName} onChange={(v) => onChange('firstName', v)} error={errors.firstName} placeholder={p.firstName} />
        <Field id="lastName" label={s.lastName} value={form.lastName} onChange={(v) => onChange('lastName', v)} error={errors.lastName} placeholder={p.lastName} />
      </div>

      <Field id="email" label={s.email} type="email" value={form.email} onChange={(v) => onChange('email', v)} error={errors.email} placeholder={p.email} />

      <Field id="address" label={s.address} value={form.address} onChange={(v) => onChange('address', v)} error={errors.address} placeholder={p.address} />

      <div className="grid grid-cols-2 gap-4">
        <Field id="city" label={s.city} value={form.city} onChange={(v) => onChange('city', v)} error={errors.city} placeholder={p.city} />
        <Field id="state" label={s.state} value={form.state} onChange={(v) => onChange('state', v)} error={errors.state} placeholder={p.state} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field id="zip" label={s.zip} value={form.zip} onChange={(v) => onChange('zip', v)} error={errors.zip} placeholder={p.zip} />
        <Field id="country" label={s.country} value={form.country} onChange={(v) => onChange('country', v)} error={errors.country} placeholder={p.country} />
      </div>
    </div>
  )
}
