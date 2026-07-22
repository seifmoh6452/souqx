import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Product } from '../../data/products'
import { useCart, getItemPrice, type CopyType } from '../../context/CartContext'
import BrandLogo from '../brand/BrandLogo'

interface Props {
  product: Product
  onQuickView: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: Props) {
  const [imgIndex, setImgIndex] = useState(0)
  const [wishlist, setWishlist] = useState(false)
  const [copyType, setCopyType] = useState<CopyType>('original')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [showSizeChart, setShowSizeChart] = useState(false)
  const { addItem } = useCart()

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

  const handleColorSelect = (color: string) => {
    if (selectedColor === color) {
      setSelectedColor('')
    } else {
      setSelectedColor(color)
      setImgIndex(0)
    }
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group card-modern card-hover cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        <motion.img
          key={imgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          src={filteredImages[imgIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Navigation arrows */}
        {filteredImages.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i - 1 + filteredImages.length) % filteredImages.length) }}
              className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-ink shadow-medium hover:bg-white transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i + 1) % filteredImages.length) }}
              className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-ink shadow-medium hover:bg-white transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Top actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-2 sm:group-hover:translate-x-0">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); setWishlist(w => !w) }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur transition-all duration-300 ${
              wishlist
                ? 'bg-rose/20 text-rose border border-rose/30'
                : 'bg-white/90 text-ink border border-ink/[0.06] hover:bg-white'
            }`}
          >
            <Heart size={13} fill={wishlist ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-ink/[0.06] text-ink flex items-center justify-center hover:bg-white transition-all"
          >
            <Eye size={13} />
          </motion.button>
          {product.originalPrice && displayPrice < product.originalPrice && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose text-white text-center">
              -{Math.round((1 - displayPrice / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.trending && (
            <span className="label-micro bg-ink text-white">Trending</span>
          )}
          {product.new && (
            <span className="label-micro bg-white/90 text-ink border border-ink/[0.06]">New</span>
          )}
        </div>

        {/* Slider dots */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {filteredImages.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === imgIndex ? 'w-4 h-1.5 bg-ink' : 'w-1.5 h-1.5 bg-ink/20'
                }`}
              />
            ))}
            {filteredImages.length > 8 && <span className="text-[9px] text-ink/40 font-bold">+{filteredImages.length - 8}</span>}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-2">
          <BrandLogo slug={product.brandSlug} size={18} />
          <span className="text-[10px] font-bold text-ink-tertiary tracking-[0.1em] uppercase">{product.brandName}</span>
        </div>

        <h3 className="text-ink font-bold text-[13px] leading-snug mb-2 line-clamp-2">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.originalPrice && (
            <span className="text-ink-faint text-xs line-through">{product.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-ink font-black text-sm">
            {displayPrice.toLocaleString()} <span className="text-[10px] text-ink-tertiary font-medium">EGP</span>
          </span>
        </div>

        {/* Size */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold text-ink-tertiary tracking-wider uppercase">Size</p>
              {product.sizeChart && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSizeChart(true) }}
                  className="text-[10px] font-bold text-accent hover:text-accent-dark underline underline-offset-2 transition-colors"
                >
                  Chart
                </button>
              )}
            </div>
            <div className="flex gap-1">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(s => s === size ? '' : size) }}
                  className={`flex-1 py-[7px] rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-ink border-ink/[0.08] hover:border-ink/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {uniqueColors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {uniqueColors.map(color => (
              <button
                key={color}
                onClick={(e) => { e.stopPropagation(); handleColorSelect(color) }}
                className={`flex-1 min-w-[calc(33.33%-4px)] py-[7px] rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                  selectedColor === color
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink border-ink/[0.08] hover:border-ink/20'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        )}

        {/* Copy type */}
        {(hasHighCopy || hasMasterBox) && (
          <div className="flex gap-1 mb-3">
            <button
              onClick={(e) => { e.stopPropagation(); setCopyType('original') }}
              className={`flex-1 py-[7px] rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                copyType === 'original'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink border-ink/[0.08] hover:border-ink/20'
              }`}
            >
              Original
            </button>
            {hasHighCopy && (
              <button
                onClick={(e) => { e.stopPropagation(); setCopyType('high-copy') }}
                className={`flex-1 py-[7px] rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                  copyType === 'high-copy'
                    ? 'bg-accent/10 text-accent border-accent/25'
                    : 'bg-white text-ink border-ink/[0.08] hover:border-ink/20'
                }`}
              >
                High Copy
              </button>
            )}
            {hasMasterBox && (
              <button
                onClick={(e) => { e.stopPropagation(); setCopyType('master-box') }}
                className={`flex-1 py-[7px] rounded-lg text-[10px] font-bold border transition-all duration-200 ${
                  copyType === 'master-box'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-white text-ink border-ink/[0.08] hover:border-ink/20'
                }`}
              >
                Master Box
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onQuickView(product)}
            className="text-xs text-ink-tertiary hover:text-ink font-medium transition-colors"
          >
            Quick view
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addItem(product, selectedSize || undefined, selectedColor || undefined, copyType)}
            className="w-10 h-10 bg-ink rounded-full flex items-center justify-center text-white hover:bg-ink/80 hover:shadow-medium transition-all duration-300"
            aria-label="Add to cart"
          >
            <ShoppingBag size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>

    {/* Size Chart Lightbox */}
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
    </>
  )
}
