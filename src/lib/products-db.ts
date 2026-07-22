import type { Product } from '../data/products'

const SUPABASE_URL = 'https://fftiqtfuphzxjcsrrbbg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_mNq8ThTap5g3Xa_2sddwiw_1hYOG0bA'

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
}

export async function fetchSupabaseProducts(): Promise<Product[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.desc`, { headers })
  if (!res.ok) return []
  const data = await res.json()
  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    brandId: row.brand_id as string,
    brandName: row.brand_name as string,
    brandSlug: row.brand_slug as string,
    name: row.name as string,
    price: row.price as number,
    currency: (row.currency as string) || 'EGP',
    category: row.category as string,
    images: (row.images as string[]) || [],
    description: (row.description as string) || '',
    sizes: (row.sizes as string[]) || [],
    colors: (row.colors as string[]) || [],
    inStock: row.in_stock as boolean,
    trending: row.trending as boolean,
    new: row.new_arrival as boolean,
    whatsappNumber: (row.whatsapp_number as string) || '+201001234567',
    highCopyPrice: row.high_copy_price as number | undefined,
    masterBoxPrice: row.master_box_price as number | undefined,
    originalPrice: row.original_price as number | undefined,
    imageColors: (row.image_colors as string[]) || [],
    sizeChart: (row.size_chart as string) || undefined,
    sortOrder: row.sort_order as number | undefined,
  }))
}

export async function addSupabaseProduct(product: Product): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      id: product.id,
      brand_id: product.brandId,
      brand_name: product.brandName,
      brand_slug: product.brandSlug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      category: product.category,
      images: product.images,
      description: product.description,
      sizes: product.sizes || [],
      colors: product.colors || [],
      in_stock: product.inStock,
      trending: product.trending || false,
      new_arrival: product.new || false,
      whatsapp_number: product.whatsappNumber,
      high_copy_price: product.highCopyPrice || null,
      master_box_price: product.masterBoxPrice || null,
      original_price: product.originalPrice || null,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to add product: ${err}`)
  }
}

export async function updateSupabaseProduct(product: Product): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      brand_id: product.brandId,
      brand_name: product.brandName,
      brand_slug: product.brandSlug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      category: product.category,
      images: product.images,
      description: product.description,
      sizes: product.sizes || [],
      colors: product.colors || [],
      in_stock: product.inStock,
      trending: product.trending || false,
      new_arrival: product.new || false,
      whatsapp_number: product.whatsappNumber,
      high_copy_price: product.highCopyPrice || null,
      master_box_price: product.masterBoxPrice || null,
      original_price: product.originalPrice || null,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to update product: ${err}`)
  }
}

export async function deleteSupabaseProduct(id: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to delete product: ${err}`)
  }
}
