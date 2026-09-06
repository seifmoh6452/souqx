// Script: Migrate orders + promo codes from the OLD (live) Supabase project
// to the NEW project's tables.
// Run: node scripts/migrate-orders-promos.mjs

const OLD_URL = 'https://fftiqtfuphzxjcsrrbbg.supabase.co'
const OLD_KEY = 'sb_publishable_mNq8ThTap5g3Xa_2sddwiw_1hYOG0bA'

const NEW_URL = 'https://fowejnpsictuquxdpzww.supabase.co'
const NEW_KEY = 'sb_publishable_lDRUcKy5orqHOBnNYiq0DQ_knQ8Ayqv'

async function getOld(path) {
  const res = await fetch(`${OLD_URL}/rest/v1/${path}`, {
    headers: { apikey: OLD_KEY, Authorization: `Bearer ${OLD_KEY}` },
  })
  if (!res.ok) throw new Error(`Old GET ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function insertNew(table, row) {
  const res = await fetch(`${NEW_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: NEW_KEY,
      Authorization: `Bearer ${NEW_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  })
  if (!res.ok) return { ok: false, error: await res.text() }
  return { ok: true }
}

async function main() {
  // 1. Orders
  console.log('Fetching orders from OLD project...')
  const orders = await getOld('orders?select=*&order=created_at.asc')
  console.log(`Fetched ${orders.length} orders.`)

  let okOrders = 0
  let errOrders = 0
  for (const o of orders) {
    const r = await insertNew('orders', {
      id: o.id,
      customer_name: o.customer_name,
      customer_phone: o.customer_phone,
      address: o.address || '',
      city: o.city || '',
      notes: o.notes || '',
      items: o.items || [],
      total: Number(o.total),
      status: o.status || 'pending',
    })
    if (r.ok) {
      okOrders++
      console.log(`  OK  ${o.id} | ${o.customer_name} | ${Number(o.total)} EGP`)
    } else {
      errOrders++
      console.log(`  ERR ${o.id}: ${r.error.slice(0, 150)}`)
    }
  }

  // 2. Promo codes
  console.log('\nFetching promo codes from OLD project...')
  const promos = await getOld('promo_codes?select=*&order=created_at.asc')
  console.log(`Fetched ${promos.length} promo codes.`)

  let okPromos = 0
  let errPromos = 0
  for (const p of promos) {
    const r = await insertNew('promo_codes', {
      code: p.code,
      discount: Number(p.discount),
      type: p.type || 'percent',
    })
    if (r.ok) {
      okPromos++
      console.log(`  OK  ${p.code} | ${p.discount}% | ${p.type}`)
    } else {
      errPromos++
      console.log(`  ERR ${p.code}: ${r.error.slice(0, 150)}`)
    }
  }

  console.log(`\nSUMMARY — orders: ${okOrders} ok / ${errOrders} err | promos: ${okPromos} ok / ${errPromos} err`)
}

main().catch((e) => {
  console.error('FATAL:', e)
  process.exit(1)
})