import { mymPerfumes } from './mym-perfumes'
import { cloudProducts as initialCloudProducts } from './cloud-products'
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
  imageColors?: string[]
  sizeChart?: string
  sortOrder?: number
  inStock: boolean
  trending?: boolean
  new?: boolean
  whatsappNumber: string
  highCopyPrice?: number
  masterBoxPrice?: number
  originalPrice?: number
}

const modestaProducts: Product[] = [
  {
    id: 'modesta-white-tshirt',
    brandId: 'modesta',
    brandName: 'MODESTA',
    brandSlug: 'modesta',
    name: 'Modesta White t-shirt',
    price: 809,
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
    price: 809,
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
    price: 1040,
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
    price: 1733,
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
    price: 809,
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

let cloudProducts: Product[] = [...initialCloudProducts]
let cachedAll: Product[] = [...products, ...cloudProducts]
let cacheByBrand: Record<string, Product[]> = {}
let cachedTrending: Product[] = cachedAll.filter(p => p.trending)

function rebuildCache() {
  cachedAll = [...products, ...cloudProducts]
  cacheByBrand = {}
  cachedTrending = cachedAll.filter(p => p.trending)
}

export async function loadCloudProducts(): Promise<Product[]> {
  try {
    const supabase = await fetchSupabaseProducts()
    const localIds = new Set(cloudProducts.map(p => p.id))
    for (const p of supabase) {
      if (localIds.has(p.id)) {
        const idx = cloudProducts.findIndex(c => c.id === p.id)
        if (idx >= 0) cloudProducts[idx] = p
      } else {
        cloudProducts.push(p)
      }
    }
  } catch {}
  rebuildCache()
  return cloudProducts
}

export function getCloudProducts(): Product[] {
  return cloudProducts
}

export function getAllProducts(): Product[] {
  return cachedAll
}

export const getTrendingProducts = () => cachedTrending
export function getProductsByBrand(brandSlug: string): Product[] {
  if (!cacheByBrand[brandSlug]) {
    cacheByBrand[brandSlug] = cachedAll
      .filter(p => p.brandSlug === brandSlug)
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
  }
  return cacheByBrand[brandSlug]
}
export const getProductById = (id: string) => cachedAll.find(p => p.id === id)
