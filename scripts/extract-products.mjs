// Script: Extract Supabase products to local files + hardcoded data
// Run: node scripts/extract-products.mjs

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const SUPABASE_URL = 'https://fftiqtfuphzxjcsrrbbg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_mNq8ThTap5g3Xa_2sddwiw_1hYOG0bA'
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }

const PUBLIC_DIR = resolve(process.cwd(), 'public')

function parseJsonArray(val) {
  if (Array.isArray(val)) return val.filter(c => typeof c === 'string' && !!c)
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); if (Array.isArray(p)) return p.filter(c => typeof c === 'string' && !!c) } catch {}
  }
  return []
}

async function main() {
  console.log('Fetching products from Supabase...')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?order=created_at.desc`, { headers })
  if (!res.ok) { console.error('Failed to fetch:', res.status); process.exit(1) }
  const data = await res.json()
  console.log(`Found ${data.length} products`)

  const products = []

  for (const row of data) {
    const brandSlug = row.brand_slug
    const productDir = join(PUBLIC_DIR, 'images', brandSlug)
    if (!existsSync(productDir)) mkdirSync(productDir, { recursive: true })

    const imageFiles = []
    const images = row.images || []

    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (!img || !img.startsWith('data:')) {
        if (img) imageFiles.push(img)
        continue
      }

      // Extract base64 data
      const matches = img.match(/^data:image\/(\w+);base64,(.+)$/)
      if (!matches) continue

      const ext = matches[1] === 'jpeg' ? 'jpeg' : matches[1] === 'png' ? 'png' : matches[1]
      const base64Data = matches[2]
      const safeName = row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const filename = `${safeName}-${i}.${ext}`
      const filepath = join(productDir, filename)

      try {
        const buffer = Buffer.from(base64Data, 'base64')
        writeFileSync(filepath, buffer)
        imageFiles.push(`/images/${brandSlug}/${filename}`)
        process.stdout.write('.')
      } catch (e) {
        console.error(`\nFailed to save image for ${row.name}: ${e.message}`)
      }
    }
    console.log(` ${row.name} (${imageFiles.length} images)`)

    products.push({
      id: row.id,
      brandId: row.brand_id,
      brandName: row.brand_name,
      brandSlug: row.brand_slug,
      name: row.name,
      price: row.price,
      currency: row.currency || 'EGP',
      category: row.category,
      images: imageFiles,
      description: row.description || '',
      sizes: (row.sizes || []).filter(s => s),
      colors: (row.colors || []).filter(c => c),
      imageColors: parseJsonArray(row.image_colors),
      sizeChart: row.size_chart || undefined,
      sortOrder: row.sort_order ?? undefined,
      inStock: row.in_stock,
      trending: row.trending || false,
      new: row.new_arrival || false,
      whatsappNumber: row.whatsapp_number || '+201001234567',
      highCopyPrice: row.high_copy_price || undefined,
      masterBoxPrice: row.master_box_price || undefined,
      originalPrice: row.original_price || undefined,
    })
  }

  // Generate TypeScript
  const ts = `// AUTO-GENERATED — do not edit manually
// Source: Supabase products table (${new Date().toISOString().split('T')[0]})

import type { Product } from './products'

export const cloudProducts: Product[] = ${JSON.stringify(products, null, 2)}
`

  writeFileSync(resolve(process.cwd(), 'src', 'data', 'cloud-products.ts'), ts)
  console.log(`\nDone! Saved ${products.length} products to src/data/cloud-products.ts`)
  console.log(`Images saved to public/images/`)
}

main().catch(console.error)
