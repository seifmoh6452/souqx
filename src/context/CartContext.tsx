import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product } from '../data/products'

export type CopyType = 'original' | 'high-copy' | 'master-box'

export function getItemPrice(product: Product, copyType: CopyType): number {
  if (copyType === 'high-copy') return product.highCopyPrice ?? product.price
  if (copyType === 'master-box') return product.masterBoxPrice ?? product.price
  return product.price
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  copyType: CopyType
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size?: string; color?: string; copyType: CopyType } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; copyType: CopyType; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

const CART_STORAGE_KEY = 'souqx_cart'

function cartItemKey(id: string, size?: string, color?: string, copyType?: CopyType) {
  return `${id}|${size || ''}|${color || ''}|${copyType || 'original'}`
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, color, copyType } = action.payload
      const key = cartItemKey(product.id, size, color, copyType)
      const existingIndex = state.items.findIndex(
        item => cartItemKey(item.product.id, item.selectedSize, item.selectedColor, item.copyType) === key
      )
      if (existingIndex >= 0) {
        const updated = [...state.items]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return { ...state, items: updated }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product,
            quantity: 1,
            selectedSize: size,
            selectedColor: color,
            copyType,
          },
        ],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => cartItemKey(item.product.id, item.selectedSize, item.selectedColor, item.copyType) !== action.payload),
      }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => cartItemKey(item.product.id, item.selectedSize, item.selectedColor, item.copyType) !== cartItemKey(action.payload.productId, undefined, undefined, action.payload.copyType)),
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          cartItemKey(item.product.id, item.selectedSize, item.selectedColor, item.copyType) === cartItemKey(action.payload.productId, undefined, undefined, action.payload.copyType)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

interface CartContextValue {
  state: CartState
  addItem: (product: Product, size?: string, color?: string, copyType?: CopyType) => void
  removeItem: (productId: string, copyType: CopyType) => void
  updateQuantity: (productId: string, copyType: CopyType, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCart(),
    isOpen: false,
  })

  useEffect(() => {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items)) } catch {}
  }, [state.items])

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + getItemPrice(item.product, item.copyType) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (product, size, color, copyType = 'original') => dispatch({ type: 'ADD_ITEM', payload: { product, size, color, copyType } }),
        removeItem: (id, copyType) => dispatch({ type: 'REMOVE_ITEM', payload: cartItemKey(id, undefined, undefined, copyType) }),
        updateQuantity: (id, copyType, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: id, copyType, quantity: qty } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
