import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getTrendingProducts } from '../../data/products'
import type { Product } from '../../data/products'
import ProductCard from '../product/ProductCard'

interface Props {
  onQuickView: (product: Product) => void
}

export default function TrendingProducts({ onQuickView }: Props) {
  const trending = getTrendingProducts()
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  return (
    <section id="trending" className="py-16 sm:py-24 section-padding overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="label-tag mb-3 inline-flex">Trending Now</span>
            <h2 className="text-display-lg font-black text-white tracking-tight">
              What Everyone's<br />
              <span className="text-gradient-accent">Buying</span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl bg-card border border-white/[0.08] flex items-center justify-center text-muted hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl bg-card border border-white/[0.08] flex items-center justify-center text-muted hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {trending.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-[260px] sm:w-72"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
