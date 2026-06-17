import { useFormContext, type UseFormRegisterReturn } from 'react-hook-form'
import type { ShippingForm } from '@lib/types'
import { strings } from '@lib/strings'
import { Input } from './ui/input'
import { Label } from './ui/label'


function Field({
  id,
  label,
  registration,
  error,
  type = 'text',
  placeholder,
}: {
  id: keyof ShippingForm
  label: string
  registration: UseFormRegisterReturn
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
        placeholder={placeholder}
        aria-invalid={!!error}
        className={error ? 'border-destructive' : ''}
        {...registration}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

const s = strings.shipping
const p = strings.shipping.placeholders

export default function ShippingFormSection() {
  const { register, formState: { errors } } = useFormContext<ShippingForm>()

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{s.sectionTitle}</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field id="firstName" label={s.firstName} placeholder={p.firstName} error={errors.firstName?.message} registration={register('firstName')} />
        <Field id="lastName"  label={s.lastName}  placeholder={p.lastName}  error={errors.lastName?.message}  registration={register('lastName')} />
      </div>

      <Field id="email" label={s.email} type="email" placeholder={p.email} error={errors.email?.message} registration={register('email')} />

      <Field id="address" label={s.address} placeholder={p.address} error={errors.address?.message} registration={register('address')} />

      <div className="grid grid-cols-2 gap-4">
        <Field id="city"  label={s.city}  placeholder={p.city}  error={errors.city?.message}  registration={register('city')} />
        <Field id="state" label={s.state} placeholder={p.state} error={errors.state?.message} registration={register('state')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field id="zip"     label={s.zip}     placeholder={p.zip}     error={errors.zip?.message}     registration={register('zip')} />
        <Field id="country" label={s.country} placeholder={p.country} error={errors.country?.message} registration={register('country')} />
      </div>
    </div>
  )
}
