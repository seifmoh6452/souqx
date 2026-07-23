const SUPABASE_URL = 'https://fftiqtfuphzxjcsrrbbg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_mNq8ThTap5g3Xa_2sddwiw_1hYOG0bA'

export interface OrderItem {
  name: string
  brandName: string
  copyType: string
  size?: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  notes: string
  items: OrderItem[]
  total: number
  date: string
  status?: string
}

export async function saveOrder(order: Order): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      address: order.address,
      city: order.city,
      notes: order.notes,
      items: order.items,
      total: order.total,
      status: 'pending',
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to save order: ${err}`)
  }
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?order=created_at.desc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  const data = await res.json()
  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    customerName: row.customer_name as string,
    customerEmail: (row.customer_email as string) || '',
    customerPhone: row.customer_phone as string,
    address: row.address as string,
    city: row.city as string,
    notes: row.notes as string || '',
    items: row.items as OrderItem[],
    total: row.total as number,
    date: row.created_at as string,
    status: row.status as string,
  }))
}
