const SUPABASE_URL = 'https://fftiqtfuphzxjcsrrbbg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_mNq8ThTap5g3Xa_2sddwiw_1hYOG0bA'
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }

export interface PromoCode {
  code: string
  discount: number
  type: 'fixed' | 'percent'
  created_at?: string
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes?order=created_at.desc`, { headers })
  if (!res.ok) return []
  return await res.json()
}

export async function addPromoCode(code: string, discount: number, type: 'fixed' | 'percent'): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ code: code.toUpperCase(), discount, type }),
  })
  if (!res.ok) throw new Error('Failed to add promo code')
}

export async function deletePromoCode(code: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes?code=eq.${code}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error('Failed to delete promo code')
}

export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/promo_codes?code=eq.${code.toUpperCase()}&limit=1`, { headers })
  if (!res.ok) return null
  const data = await res.json()
  return data.length > 0 ? data[0] : null
}
