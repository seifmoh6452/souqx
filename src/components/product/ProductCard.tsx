import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
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

  useEffect(() => {
    setImgIndex(0)
  }, [selectedColor])

  return (
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
                type="button"
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIndex(i) }}
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
          <div className="flex gap-1 mb-3">
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
        )}

        {/* Color selector */}
        {uniqueColors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3">
            {uniqueColors.map(color => (
              <button
                key={color}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(c => c === color ? '' : color) }}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all min-h-[32px] leading-tight ${
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
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
            className="text-xs text-muted hover:text-white font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-start"
          >
            Quick View
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); addItem(product, selectedSize || undefined, undefined, copyType) }}
            className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-bg hover:bg-accent-hover hover:shadow-glow-sm transition-all"
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
