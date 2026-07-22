import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart, getItemPrice } from '../../context/CartContext'

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [state.isOpen])

  const handleCheckout = () => {
    if (state.items.length === 0) return
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0d0d0d] border-l border-white/[0.06] flex flex-col overscroll-contain"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-accent" />
                <span className="font-bold text-white text-base sm:text-lg">Your Cart</span>
                {state.items.length > 0 && (
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-[11px] font-semibold rounded-full border border-accent/20">
                    {state.items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-2.5">
              <AnimatePresence>
                {state.items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <ShoppingBag size={24} className="text-muted" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">Your cart is empty</p>
                      <p className="text-muted text-sm mt-1">Add something premium to get started</p>
                    </div>
                  </motion.div>
                ) : (
                  state.items.map(item => {
                    const itemPrice = getItemPrice(item.product, item.copyType)
                    const itemKey = `${item.product.id}|${item.selectedSize || ''}|${item.selectedColor || ''}|${item.copyType}`
                    return (
                      <motion.div
                        key={itemKey}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 p-3 bg-card rounded-2xl border border-white/[0.06]"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs text-accent font-semibold mb-0.5">{item.product.brandName}</p>
                          <p className="text-white text-[13px] sm:text-sm font-semibold truncate">{item.product.name}</p>
                          <p className="text-[10px] text-muted mt-0.5">
                            {item.copyType === 'high-copy' ? 'High Copy' : item.copyType === 'master-box' ? 'Master Box' : 'Original'}
                          </p>
                          {(item.selectedSize || item.selectedColor) && (
                            <p className="text-muted text-[11px] mt-0.5">
                              {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-white font-bold text-sm">
                              {(itemPrice * item.quantity).toLocaleString()} EGP
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.copyType, item.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-white/10 text-white transition-colors"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.copyType, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-white/10 text-white transition-colors"
                              >
                                <Plus size={13} />
                              </button>
                              <button
                                onClick={() => removeItem(item.product.id, item.copyType)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-red-500/20 hover:text-red-400 text-muted transition-all ml-0.5"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted text-sm">Subtotal</span>
                  <span className="text-white font-bold text-lg">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <p className="text-[11px] text-muted">Shipping calculated at checkout</p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-bg font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors min-h-[52px]"
                >
                  <ShoppingBag size={18} />
                  Checkout
                </motion.button>
                <button
                  onClick={clearCart}
                  className="w-full py-3 text-muted text-sm hover:text-white transition-colors min-h-[44px]"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
