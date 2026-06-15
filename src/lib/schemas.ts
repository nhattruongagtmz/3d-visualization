import { z } from 'zod'
import { strings } from './strings'

const s = strings.checkout
const a = strings.admin

export const shippingSchema = z.object({
  firstName: z.string().trim().min(1, s.fieldRequired),
  lastName:  z.string().trim().min(1, s.fieldRequired),
  email:     z.string().trim().min(1, s.fieldRequired).email(s.invalidEmail),
  address:   z.string().trim().min(1, s.fieldRequired),
  city:      z.string().trim().min(1, s.fieldRequired),
  state:     z.string().trim().min(1, s.fieldRequired),
  zip:       z.string().trim().min(1, s.fieldRequired),
  country:   z.string().trim().min(1, s.fieldRequired),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1, a.passwordRequired),
})
