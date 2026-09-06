// Script: Migrate FOOT WEAR + CLEAN FITS products from the OLD (live) Supabase project
// to the NEW project's products table.
// Run: node scripts/migrate-extra-products.mjs

const OLD_URL = 'https://fftiqtfuphzxjcsrrbbg.supabase.co'
const OLD_KEY = 'sb_publishable_mNq8ThTap5g3Xa_2sddwiw_1hYOG0bA'

const NEW_URL = 'https://fowejnpsictuquxdpzww.supabase.co'
const NEW_KEY = 'sb_publishable_lDRUcKy5orqHOBnNYiq0DQ_knQ8Ayqv'

const brandIds = {
  'FOOT WEAR': '10',
  'CLEAN FITS': '8',
  'Girl Math': '7',
  'GLASSWEAR': '3',
  'WATCH EYE': '6',
  'WANTS & NEEDS': '5',
  'MYM': '1',
  'MODESTA': '2',
}

const brandSlugs = {
  'FOOT WEAR': 'footwear',
  'CLEAN FITS': 'cleanfits',
  'Girl Math': 'girlmath',
  'GLASSWEAR': 'glasswear',
  'WATCH EYE': 'watcheye',
  'WANTS & NEEDS': 'wantsneeds',
  'MYM': 'mym',
  'MODESTA': 'modesta',
}

async function fetchAllProducts() {
  const res = await fetch(`${OLD_URL}/rest/v1/products?select=*&order=created_at.asc`, {
    headers: { apikey: OLD_KEY, Authorization: `Bearer ${OLD_KEY}` },
  })
  if (!res.ok) throw new Error(`Old GET failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function insertProduct(p) {
  const normalize = (v) => {
    if (Array.isArray(v)) return v
    if (v == null) return []
    return String(v).split(' ').filter((s) => s.trim() !== '')
  }

  const payload = {
    id: p.id,
    brand_id: brandIds[p.brand_name],
    brand_name: p.brand_name,
    brand_slug: brandSlugs[p.brand_name] || p.brand_name.toLowerCase().replace(/\s+/g, ''),
    name: p.name,
    price: Number(p.price),
    currency: 'EGP',
    category: p.category || 'Clothing',
    images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
    description: p.description || '',
    sizes: normalize(p.sizes),
    colors: normalize(p.colors),
    in_stock: true,
    trending: false,
    new_arrival: false,
    whatsapp_number: '+201001234567',
    high_copy_price: p.high_copy_price ?? null,
    master_box_price: p.master_box_price ?? null,
    original_price: p.original_price ?? null,
    image_colors: normalize(p.image_colors),
    size_chart: p.size_chart ?? null,
    sort_order: p.sort_order ?? null,
  }

  const res = await fetch(`${NEW_URL}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: NEW_KEY,
      Authorization: `Bearer ${NEW_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) return { ok: false, error: await res.text() }
  return { ok: true }
}

async function main() {
  console.log('Fetching products from OLD project...')
  const products = await fetchAllProducts()
  console.log(`Fetched ${products.length} products from old DB.\n`)

  let inserted = 0
  let errors = 0
  for (const p of products) {
    const r = await insertProduct(p)
    if (r.ok) {
      inserted++
      console.log(`  OK  [${p.brand_name}] ${p.name}`)
    } else {
      errors++
      console.log(`  ERR [${p.brand_name}] ${p.name}: ${r.error.slice(0, 150)}`)
    }
  }

  console.log(`\nDone! Inserted ${inserted}, errors ${errors}.`)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})