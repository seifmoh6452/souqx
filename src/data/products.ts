import { mymPerfumes } from './mym-perfumes'
import { fetchSupabaseProducts } from '../lib/products-db'

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

const modestaProducts: Product[] = [
  {
    id: 'modesta-white-tshirt',
    brandId: 'modesta',
    brandName: 'MODESTA',
    brandSlug: 'modesta',
    name: 'Modesta White t-shirt',
    price: 735,
    currency: 'EGP',
    category: 't-shirts',
    images: ['/images/modesta/white-tshirt.jpeg', '/images/modesta/white-tshirt-back.jpeg'],
    description: 'Clean white tee from MODESTA. Oversized streetwear fit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    trending: false,
    new: true,
    whatsappNumber: '+201001234567',
  },
  {
    id: 'modesta-black-tshirt',
    brandId: 'modesta',
    brandName: 'MODESTA',
    brandSlug: 'modesta',
    name: 'Modesta Black t-shirt',
    price: 735,
    currency: 'EGP',
    category: 't-shirts',
    images: ['/images/modesta/black-tshirt.jpeg', '/images/modesta/black-tshirt-back.jpeg'],
    description: 'Classic black tee from MODESTA. Oversized streetwear fit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    trending: false,
    new: true,
    whatsappNumber: '+201001234567',
  },
  {
    id: 'modesta-oversized-hoodie',
    brandId: 'modesta',
    brandName: 'MODESTA',
    brandSlug: 'modesta',
    name: 'Modesta OverSized Hoodie',
    price: 945,
    currency: 'EGP',
    category: 'hoodies',
    images: ['/images/modesta/oversized-hoodie.jpeg', '/images/modesta/oversized-hoodie-back.jpeg'],
    description: 'Heavy oversized hoodie from MODESTA. Premium streetwear staple.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    trending: false,
    new: true,
    whatsappNumber: '+201001234567',
  },
  {
    id: 'modesta-full-set',
    brandId: 'modesta',
    brandName: 'MODESTA',
    brandSlug: 'modesta',
    name: 'Modesta Full-Set',
    price: 1575,
    currency: 'EGP',
    category: 'sets',
    images: ['/images/modesta/full-set.jpeg'],
    description: 'Complete MODESTA set. Premium streetwear outfit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    trending: true,
    new: true,
    whatsappNumber: '+201001234567',
  },
  {
    id: 'modesta-sweatpants',
    brandId: 'modesta',
    brandName: 'MODESTA',
    brandSlug: 'modesta',
    name: 'Modesta Sweatpants',
    price: 735,
    currency: 'EGP',
    category: 'pants',
    images: ['/images/modesta/sweatpants.jpeg'],
    description: 'Premium sweatpants from MODESTA. Comfortable streetwear fit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    trending: false,
    new: true,
    whatsappNumber: '+201001234567',
  },
]

export const products: Product[] = [
  ...mymPerfumes,
  ...modestaProducts,
]

let cloudProducts: Product[] = []

export async function loadCloudProducts(): Promise<Product[]> {
  try {
    cloudProducts = await fetchSupabaseProducts()
  } catch {
    cloudProducts = []
  }
  return cloudProducts
}

export function getCloudProducts(): Product[] {
  return cloudProducts
}

export function getAllProducts(): Product[] {
  return [...products, ...cloudProducts]
}

export const getTrendingProducts = () => getAllProducts().filter(p => p.trending)
export const getProductsByBrand = (brandSlug: string) => getAllProducts().filter(p => p.brandSlug === brandSlug)
export const getProductById = (id: string) => getAllProducts().find(p => p.id === id)
