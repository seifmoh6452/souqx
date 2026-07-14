import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Heart, Minus, Plus } from 'lucide-react'
import type { Product } from '../../data/products'
import { useCart, getItemPrice, type CopyType } from '../../context/CartContext'
import { getAllProducts } from '../../data/products'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  const [imageIndex, setImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [copyType, setCopyType] = useState<CopyType>('original')
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [product])

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  const relatedProducts = product
    ? getAllProducts().filter(p => p.brandSlug === product.brandSlug && p.id !== product.id).slice(0, 3)
    : []

  if (!product) return null

  const displayPrice = getItemPrice(product, copyType)
  const hasHighCopy = !!product.highCopyPrice
  const hasMasterBox = !!product.masterBoxPrice

  const handleAddToCart = () => {
    addItem(product, selectedSize || undefined, selectedColor || undefined, copyType)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWhatsApp = () => {
    const copyLabel = copyType === 'high-copy' ? ' (High Copy)' : copyType === 'master-box' ? ' (Master Box)' : ''
    const msg = [
      `Hi! I'm interested in ordering:`,
      `*${product.brandName} – ${product.name}${copyLabel}*`,
      selectedSize ? `Size: ${selectedSize}` : '',
      selectedColor ? `Color: ${selectedColor}` : '',
      `Quantity: ${quantity}`,
      `Price: ${(displayPrice * quantity).toLocaleString()} EGP`,
      '',
      'Please confirm availability. Thank you!'
    ].filter(Boolean).join('\n')
    const number = product.whatsappNumber.replace(/\D/g, '')
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex sm:items-center justify-center bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0d0d0d] border border-white/[0.08] w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-3xl overflow-y-auto overscroll-contain"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery */}
            <div className="lg:w-1/2 relative">
              {/* Mobile: compact image. Desktop: square aspect */}
              <div className="relative bg-black overflow-hidden sm:rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
                {/* Close + Wishlist on image (mobile only) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 sm:hidden">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWishlist(w => !w)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border backdrop-blur-sm transition-all ${
                      wishlist
                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                        : 'bg-black/50 border-white/10 text-white'
                    }`}
                  >
                    <Heart size={16} fill={wishlist ? 'currentColor' : 'none'} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/50 border border-white/10 text-white backdrop-blur-sm"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div className="aspect-square sm:aspect-square max-h-[50vh] sm:max-h-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imageIndex}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      src={product.images[imageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>

                {/* Navigation arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImageIndex(i => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-black/70 transition-all"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImageIndex(i => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-black/70 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Tags */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {product.trending && (
                    <span className="label-tag">Trending</span>
                  )}
                  {product.new && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/10">New</span>
                  )}
                </div>
              </div>

              {/* Thumbnails - scrollable on mobile */}
              {product.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        i === imageIndex ? 'border-accent' : 'border-transparent opacity-50 hover:opacity-75'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover bg-[#0f0f0f]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col">
              {/* Close + Wishlist (desktop only) */}
              <div className="hidden sm:flex items-start justify-between mb-6">
                <div>
                  <span className="text-accent text-sm font-semibold">{product.brandName}</span>
                  <h2 className="text-2xl font-black text-white mt-1 leading-tight">{product.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWishlist(w => !w)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                      wishlist
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-white/[0.04] border-white/[0.08] text-muted hover:text-white'
                    }`}
                  >
                    <Heart size={16} fill={wishlist ? 'currentColor' : 'none'} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-muted hover:text-white transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Mobile brand+name (below image) */}
              <div className="sm:hidden mb-4">
                <span className="text-accent text-xs font-semibold">{product.brandName}</span>
                <h2 className="text-lg font-black text-white mt-0.5 leading-tight">{product.name}</h2>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {displayPrice.toLocaleString()} <span className="text-sm sm:text-lg text-muted font-semibold">EGP</span>
                </p>
                {copyType === 'high-copy' && hasHighCopy && (
                  <span className="text-[11px] font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                    High Copy
                  </span>
                )}
                {copyType === 'master-box' && hasMasterBox && (
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                    Master Box
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted text-sm leading-relaxed mb-5">{product.description}</p>

              {/* Copy type selector */}
              {(hasHighCopy || hasMasterBox) && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-2">Purchase Option</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCopyType('original')}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                        copyType === 'original'
                          ? 'bg-white/10 text-white border-white/20'
                          : 'bg-white/[0.04] text-muted border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      Original
                    </button>
                    {hasHighCopy && (
                      <button
                        onClick={() => setCopyType('high-copy')}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                          copyType === 'high-copy'
                            ? 'bg-accent/10 text-accent border-accent/30'
                            : 'bg-white/[0.04] text-muted border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        High Copy
                      </button>
                    )}
                    {hasMasterBox && (
                      <button
                        onClick={() => setCopyType('master-box')}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                          copyType === 'master-box'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-white/[0.04] text-muted border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        Master Box
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                          selectedSize === size
                            ? 'bg-accent text-bg border-accent'
                            : 'bg-white/[0.04] text-white border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
                          selectedColor === color
                            ? 'bg-accent text-bg border-accent'
                            : 'bg-white/[0.04] text-white border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-5">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-widest">Qty</p>
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className="text-muted text-sm ml-auto whitespace-nowrap">{(displayPrice * quantity).toLocaleString()} EGP</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2.5 mt-auto">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all min-h-[52px] ${
                    addedToCart
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-accent hover:bg-accent-hover text-bg'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="w-full py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all min-h-[52px]"
                >
                  <MessageCircle size={18} />
                  Buy via WhatsApp
                </motion.button>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 border-t border-white/[0.06] pt-5 sm:pt-6">
              <p className="text-xs sm:text-sm font-semibold text-muted uppercase tracking-widest mb-3 sm:mb-4">More from {product.brandName}</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {relatedProducts.map(related => (
                  <motion.button
                    key={related.id}
                    whileTap={{ scale: 0.97 }}
                    className="group text-left"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-black mb-2">
                      <img src={related.images[0]} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-white text-[11px] sm:text-xs font-semibold truncate">{related.name}</p>
                    <p className="text-muted text-[11px] sm:text-xs">{related.price.toLocaleString()} EGP</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
