import { z } from 'zod'
import { strings } from './strings'

const s = strings.checkout
const a = strings.admin
const cp = strings.createProduct

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

export const createProductSchema = z.object({
  name:                 z.string().trim().min(1, cp.errRequired),
  tagline:              z.string().trim().min(1, cp.errRequired),
  description:          z.string().trim().min(10, cp.errMinDesc),
  priceDisplay:         z.string().trim().regex(/^\d+(\.\d{1,2})?$/, cp.errPrice),
  category:             z.enum(['home-decor', 'toys', 'tools', 'art', 'functional-parts'], {
    errorMap: () => ({ message: cp.errSelectCategory }),
  }),
  materials:            z.array(z.enum(['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PA', 'PC'])).min(1, cp.errSelectMaterial),
  printerCompatibility: z.array(z.enum(['A1', 'A1 Mini', 'P1S', 'P1P', 'X1C', 'X1E', 'All'])).min(1, cp.errSelectPrinter),
  layerHeight:          z.enum(['0.1', '0.15', '0.2', '0.25'], {
    errorMap: () => ({ message: cp.errSelectLayerHeight }),
  }),
  printTime:            z.string().trim().min(1, cp.errRequired),
  supportRequired:      z.boolean(),
  featured:             z.boolean(),
  inStock:              z.boolean(),
  imageUrls:            z.string().trim().min(1, cp.errRequired),
  modelUrl:             z.string().trim().optional(),
  tags:                 z.string().trim().optional(),
})
