import { mymPerfumes } from './mym-perfumes'
import { getCustomProducts } from './custom-products'

export interface Product {
  id: string
  brandId: string
  brandName: string
  brandSlug: string
  name: string
  price: number
  currency: string
  category: string
  images: string[]
  description: string
  sizes?: string[]
  colors?: string[]
  inStock: boolean
  trending?: boolean
  new?: boolean
  whatsappNumber: string
  highCopyPrice?: number
  masterBoxPrice?: number
}

export const products: Product[] = [
  ...mymPerfumes,
]

export function getAllProducts(): Product[] {
  return [...products, ...getCustomProducts()]
}

export const getTrendingProducts = () => getAllProducts().filter(p => p.trending)
export const getProductsByBrand = (brandSlug: string) => getAllProducts().filter(p => p.brandSlug === brandSlug)
export const getProductById = (id: string) => getAllProducts().find(p => p.id === id)
