import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart, Minus, Plus } from 'lucide-react'
import type { Product } from '../../data/products'
import { useCart, getItemPrice, type CopyType } from '../../context/CartContext'

interface Props {
  product: Product | null
  onClose: () => void
  onSelectProduct?: (product: Product) => void
}

export default function ProductModal({ product, onClose }: Props) {
  const [imageIndex, setImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [copyType, setCopyType] = useState<CopyType>('original')
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showSizeChart, setShowSizeChart] = useState(false)
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

  useEffect(() => {
    setImageIndex(0)
    setSelectedSize('')
    setSelectedColor('')
    setCopyType('original')
    setQuantity(1)
    setAddedToCart(false)
  }, [product?.id])

  if (!product) return null

  const displayPrice = getItemPrice(product, copyType)
  const hasHighCopy = !!product.highCopyPrice
  const hasMasterBox = !!product.masterBoxPrice

  const hasImageColors = product.imageColors && product.imageColors.some(c => c)
  const uniqueColors = hasImageColors
    ? [...new Set(product.imageColors!.filter((c): c is string => !!c))]
    : []
  const filteredImages = hasImageColors && selectedColor
    ? product.images.filter((_, i) => product.imageColors![i] === selectedColor)
    : product.images

  const handleAddToCart = () => {
    addItem(product, selectedSize || undefined, selectedColor || undefined, copyType)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white w-full max-w-5xl h-[92vh] sm:h-[85vh] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-heavy flex flex-row"
          onClick={e => e.stopPropagation()}
        >
          {/* Image Gallery — always left column */}
          <div className="relative bg-surface-1 flex flex-col min-h-0 w-[42%] sm:w-[50%] flex-shrink-0">
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setWishlist(w => !w)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border backdrop-blur transition-all ${
                  wishlist ? 'bg-rose/20 border-rose/30 text-rose' : 'bg-white/90 border-ink/[0.06] text-ink'
                }`}
              >
                <Heart size={12} fill={wishlist ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 border border-ink/[0.06] text-ink backdrop-blur"
              >
                <X size={14} />
              </motion.button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={filteredImages[imageIndex] || product.images[0]}
                  alt={product.name}
                  className={`w-full h-full ${product.brandSlug === 'mym' ? 'object-contain p-3' : 'object-cover'}`}
                />
              </AnimatePresence>
            </div>

            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex(i => (i - 1 + filteredImages.length) % filteredImages.length)}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-ink shadow-medium hover:bg-white transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setImageIndex(i => (i + 1) % filteredImages.length)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-ink shadow-medium hover:bg-white transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </>
            )}

            <div className="absolute bottom-2 left-2 flex gap-1">
              {product.originalPrice && (
                <span className="label-micro bg-rose text-white text-[8px] sm:text-[9px] py-0.5 px-1.5 sm:px-2">-{Math.round((1 - displayPrice / product.originalPrice) * 100)}%</span>
              )}
              {product.trending && <span className="label-micro bg-ink text-white text-[8px] sm:text-[9px] py-0.5 px-1.5 sm:px-2">Trending</span>}
              {product.new && <span className="label-micro bg-white/90 text-ink border border-ink/[0.06] text-[8px] sm:text-[9px] py-0.5 px-1.5 sm:px-2">New</span>}
            </div>

            {filteredImages.length > 1 && (
              <div className="flex gap-1 p-1.5 sm:p-2 overflow-x-auto no-scrollbar">
                {filteredImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === imageIndex ? 'border-ink' : 'border-transparent opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover bg-surface-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info — always right column */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto lg:overflow-hidden">
            <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-1 min-h-0">
              <div className="mb-2 sm:mb-3">
                <span className="text-accent text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">{product.brandName}</span>
                <h2 className="text-sm sm:text-lg lg:text-xl font-black text-ink mt-0.5 leading-tight">{product.name}</h2>
              </div>

              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                {product.originalPrice && (
                  <span className="text-ink-faint text-xs sm:text-sm line-through">{product.originalPrice.toLocaleString()}</span>
                )}
                <p className="text-lg sm:text-xl lg:text-2xl font-black text-ink">
                  {displayPrice.toLocaleString()} <span className="text-[10px] sm:text-xs text-ink-tertiary font-semibold">EGP</span>
                </p>
                {product.originalPrice && (
                  <span className="text-[8px] sm:text-[9px] font-black text-rose bg-rose/10 rounded-full px-1.5 py-0.5">
                    -{Math.round((1 - displayPrice / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-ink-secondary text-[11px] sm:text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-2">{product.description}</p>

              {(hasHighCopy || hasMasterBox) && (
                <div className="mb-2 sm:mb-3">
                  <p className="text-[8px] sm:text-[9px] font-bold text-ink-tertiary tracking-[0.15em] uppercase mb-1">Option</p>
                  <div className="flex gap-1 sm:gap-1.5">
                    <button onClick={() => setCopyType('original')} className={`flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all ${copyType === 'original' ? 'bg-ink text-white border-ink' : 'bg-surface-1 text-ink border-ink/[0.06]'}`}>
                      Original
                    </button>
                    {hasHighCopy && (
                      <button onClick={() => setCopyType('high-copy')} className={`flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all ${copyType === 'high-copy' ? 'bg-accent/10 text-accent border-accent/25' : 'bg-surface-1 text-ink border-ink/[0.06]'}`}>
                        High Copy
                      </button>
                    )}
                    {hasMasterBox && (
                      <button onClick={() => setCopyType('master-box')} className={`flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all ${copyType === 'master-box' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-surface-1 text-ink border-ink/[0.06]'}`}>
                        Master Box
                      </button>
                    )}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[8px] sm:text-[9px] font-bold text-ink-tertiary tracking-[0.15em] uppercase">Size</p>
                    {product.sizeChart && (
                      <button onClick={() => setShowSizeChart(true)} className="text-[8px] sm:text-[9px] font-bold text-accent hover:text-accent-dark underline underline-offset-2 transition-colors">
                        Size Chart
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all ${selectedSize === size ? 'bg-ink text-white border-ink' : 'bg-surface-1 text-ink border-ink/[0.06]'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {uniqueColors.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <p className="text-[8px] sm:text-[9px] font-bold text-ink-tertiary tracking-[0.15em] uppercase mb-1">Color</p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => { setSelectedColor(selectedColor === color ? '' : color); setImageIndex(0) }}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all min-w-[60px] sm:min-w-[70px] ${selectedColor === color ? 'bg-ink text-white border-ink' : 'bg-surface-1 text-ink border-ink/[0.06]'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3 mt-auto pt-2">
                <div className="flex items-center gap-0.5 bg-surface-1 border border-ink/[0.06] rounded-lg sm:rounded-xl p-0.5">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md hover:bg-white text-ink transition-colors">
                    <Minus size={11} />
                  </button>
                  <span className="w-5 sm:w-6 text-center font-bold text-ink text-[11px] sm:text-xs">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md hover:bg-white text-ink transition-colors">
                    <Plus size={11} />
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 text-[11px] sm:text-xs ${
                    addedToCart
                      ? 'bg-accent/15 text-accent border border-accent/20'
                      : 'bg-ink text-white hover:bg-ink/90 shadow-medium hover:shadow-heavy'
                  }`}
                >
                  <ShoppingBag size={13} />
                  {addedToCart ? 'Added!' : 'Add to Cart'} — {(displayPrice * quantity).toLocaleString()} EGP
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showSizeChart && product.sizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 backdrop-blur-xl"
            onClick={() => setShowSizeChart(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-lg w-[90%] max-h-[85vh] rounded-3xl overflow-hidden bg-white shadow-heavy"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-ink/[0.04]">
                <p className="text-sm font-bold text-ink">Size Chart</p>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-2 text-ink-tertiary hover:text-ink transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)]">
                <img src={product.sizeChart} alt="Size Chart" className="w-full h-auto rounded-2xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}
