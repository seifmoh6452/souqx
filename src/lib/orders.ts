const API_KEY = '$2a$10$j537pExPqJpYsqqE7by6dezd63I6cMSLWUShmVmXoRO6ZC8l1FDnS'
const API_BASE = 'https://api.jsonbin.io/v3'
const BIN_ID_KEY = 'souqx_orders_bin_id'

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
  customerPhone: string
  address: string
  city: string
  notes: string
  items: OrderItem[]
  total: number
  date: string
}

function getBinId(): string | null {
  return localStorage.getItem(BIN_ID_KEY)
}

function setBinId(id: string) {
  localStorage.setItem(BIN_ID_KEY, id)
}

async function createBin(orders: Order[]): Promise<string> {
  const res = await fetch(`${API_BASE}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
      'X-Bin-Name': 'souqx-orders',
    },
    body: JSON.stringify(orders),
  })
  const data = await res.json()
  setBinId(data.metadata.id)
  return data.metadata.id
}

async function updateBin(binId: string, orders: Order[]) {
  await fetch(`${API_BASE}/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
    },
    body: JSON.stringify(orders),
  })
}

export async function saveOrder(order: Order): Promise<void> {
  const binId = getBinId()
  if (binId) {
    try {
      const existing = await getOrders()
      existing.push(order)
      await updateBin(binId, existing)
      return
    } catch {
      const newBinId = await createBin([order])
      setBinId(newBinId)
      return
    }
  }
  const newBinId = await createBin([order])
  setBinId(newBinId)
}

export async function getOrders(): Promise<Order[]> {
  const binId = getBinId()
  if (!binId) return []
  const res = await fetch(`${API_BASE}/b/${binId}/latest`, {
    headers: { 'X-Master-Key': API_KEY },
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  const data = await res.json()
  return Array.isArray(data.record) ? data.record : []
}
