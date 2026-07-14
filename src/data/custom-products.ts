import type { Product } from './products'

const STORAGE_KEY = 'souqx_custom_products'

export function getCustomProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addCustomProduct(product: Product): void {
  const existing = getCustomProducts()
  existing.push(product)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export function updateCustomProduct(updated: Product): void {
  const existing = getCustomProducts().map(p => p.id === updated.id ? updated : p)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export function removeCustomProduct(id: string): void {
  const existing = getCustomProducts().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

export function clearCustomProducts(): void {
  localStorage.removeItem(STORAGE_KEY)
}
