export type PrinterCompatibility = 'A1' | 'A1 Mini' | 'P1S' | 'P1P' | 'X1C' | 'X1E' | 'All'
export type Material = 'PLA' | 'PETG' | 'ABS' | 'ASA' | 'TPU' | 'PA' | 'PC'
export type Category = 'home-decor' | 'toys' | 'tools' | 'art' | 'functional-parts'

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  images: string[]
  category: Category
  materials: Material[]
  printerCompatibility: PrinterCompatibility[]
  layerHeight: number
  printTime: string
  supportRequired: boolean
  featured: boolean
  inStock: boolean
  rating: number
  reviewCount: number
  tags: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedMaterial: Material
}

export interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, material: Material) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: number
  subtotal: number
}

export interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export interface ShopFilters {
  categories: Category[]
  priceMin: number
  priceMax: number
  printers: PrinterCompatibility[]
  materials: Material[]
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'featured'
}
