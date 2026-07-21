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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group card-base cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0f0f0f]">
        <motion.img
          key={imgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={filteredImages[imgIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Slider dots */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {filteredImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all sm:opacity-0 sm:group-hover:opacity-100 ${i === imgIndex ? 'bg-white w-4 opacity-100' : 'bg-white/40 opacity-60 sm:opacity-0 sm:group-hover:opacity-40'}`}
              />
            ))}
          </div>
        )}

        {/* Slider arrows - always on mobile, hover on desktop */}
        {filteredImages.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i - 1 + filteredImages.length) % filteredImages.length) }}
              className="w-9 h-9 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i + 1) % filteredImages.length) }}
              className="w-9 h-9 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Hover actions - always visible on mobile */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 sm:translate-x-8 sm:group-hover:translate-x-0 transition-transform duration-300">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setWishlist(w => !w) }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border backdrop-blur-sm transition-all ${
              wishlist
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-black/40 border-white/10 text-white'
            }`}
          >
            <Heart size={15} fill={wishlist ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
            className="w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center"
          >
            <Eye size={15} />
          </motion.button>
          {product.originalPrice && displayPrice < product.originalPrice && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white text-center">
              {Math.round((1 - displayPrice / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.trending && (
            <span className="label-tag text-[10px]">Trending</span>
          )}
          {product.new && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white border border-white/10">New</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        {/* Brand logo row */}
        <div className="flex items-center gap-2 mb-1.5">
          <BrandLogo slug={product.brandSlug} size={20} />
          <p className="text-accent text-[10px] font-bold tracking-widest uppercase">{product.brandName}</p>
        </div>
        <h3 className="text-white font-semibold text-[13px] sm:text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.originalPrice && (
            <span className="text-muted text-xs line-through font-medium">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-white font-black text-sm sm:text-base">
            {displayPrice.toLocaleString()} <span className="text-[11px] text-muted font-medium">EGP</span>
          </span>
        </div>

        {/* Size selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">Size</p>
              {product.sizeChart && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSizeChart(true) }}
                  className="text-[10px] font-semibold text-accent hover:text-accent-hover underline transition-colors"
                >
                  Size Chart
                </button>
              )}
            </div>
            <div className="flex gap-1">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={(e) => { e.stopPropagation(); setSelectedSize(s => s === size ? '' : size) }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold border transition-all min-h-[36px] ${
                  selectedSize === size
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-transparent text-muted border-white/[0.06] hover:border-white/10'
                }`}
              >
                {size}
              </button>
            ))}
            </div>
          </div>
        )}

        {/* Color selector */}
        {uniqueColors.length > 0 && (
          <div className="grid grid-cols-3 gap-1 mb-3">
            {uniqueColors.map(color => (
              <button
                key={color}
                onClick={(e) => { e.stopPropagation(); handleColorSelect(color) }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold border transition-all min-h-[36px] ${
                  selectedColor === color
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-transparent text-muted border-white/[0.06] hover:border-white/10'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        )}

        {/* Copy type selector */}
        {(hasHighCopy || hasMasterBox) && (
          <div className="flex gap-1 mb-3">
            <button
              onClick={(e) => { e.stopPropagation(); setCopyType('original') }}
              className={`flex-1 py-2 rounded-lg text-[11px] font-semibold border transition-all min-h-[36px] ${
                copyType === 'original'
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-transparent text-muted border-white/[0.06] hover:border-white/10'
              }`}
            >
              Original
            </button>
            {hasHighCopy && (
              <button
                onClick={(e) => { e.stopPropagation(); setCopyType('high-copy') }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold border transition-all min-h-[36px] ${
                  copyType === 'high-copy'
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'bg-transparent text-muted border-white/[0.06] hover:border-white/10'
                }`}
              >
                High Copy
              </button>
            )}
            {hasMasterBox && (
              <button
                onClick={(e) => { e.stopPropagation(); setCopyType('master-box') }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold border transition-all min-h-[36px] ${
                  copyType === 'master-box'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-transparent text-muted border-white/[0.06] hover:border-white/10'
                }`}
              >
                Master Box
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickView(product)}
            className="text-xs text-muted hover:text-white font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-start"
          >
            Quick View
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => addItem(product, selectedSize || undefined, selectedColor || undefined, copyType)}
            className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-bg hover:bg-accent-hover hover:shadow-glow-sm transition-all"
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl"
          onClick={() => setShowSizeChart(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-lg w-[90%] max-h-[85vh] rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.08]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/[0.06]">
              <p className="text-sm font-bold text-white">Size Chart</p>
              <button
                onClick={() => setShowSizeChart(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] text-muted hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-56px)]">
              <img src={product.sizeChart} alt="Size Chart" className="w-full h-auto rounded-xl" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
