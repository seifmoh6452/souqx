import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package } from 'lucide-react'
import { brands } from '../data/brands'
import { getProductsByBrand, getAllProducts } from '../data/products'
import type { Product } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import ProductModal from '../components/product/ProductModal'
import BrandLogo from '../components/brand/BrandLogo'

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const brand = brands.find(b => b.slug === slug)
  const brandProducts = slug ? getProductsByBrand(slug) : []

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black text-white">Brand not found</p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24">
      {/* Brand header */}
      <div className="section-padding container-wide pb-6 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back button */}
          <Link to="/">
            <motion.div
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-white text-sm font-semibold w-fit mb-6 sm:mb-8 min-h-[44px]"
            >
              <ArrowLeft size={15} />
              Back
            </motion.div>
          </Link>

          {/* Logo + Brand info */}
          <div className="flex items-center gap-4 sm:gap-5 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-card border border-white/10 flex-shrink-0" style={{ background: '#090909' }}>
              <img
                src={`/logos/${brand.slug}.jpeg`}
                alt={brand.name}
                className="w-full h-full object-cover"
                style={{ mixBlendMode: brand.logoBg === 'light' ? 'screen' : 'normal' }}
              />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold mb-1" style={{ color: brand.accentColor }}>{brand.category}</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">{brand.name}</h1>
            </div>
          </div>
          <p className="text-muted text-sm sm:text-lg italic">"{brand.tagline}"</p>
        </motion.div>
      </div>

      {/* Brand description */}
      <div className="section-padding container-wide py-6 sm:py-10">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center mb-10 sm:mb-16 pb-10 sm:pb-16 border-b border-white/[0.06]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-muted text-lg leading-relaxed"
          >
            {brand.description}
          </motion.p>

          <div className="flex gap-4 sm:gap-6">
            {[
              { value: `${brandProducts.length}`, label: 'Products' },
              { value: '100%', label: 'Egyptian' },
              { value: '⭐ 5.0', label: 'Rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-muted text-[11px] sm:text-xs mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8">
            <Package size={18} className="text-accent" />
            <h2 className="text-xl sm:text-2xl font-black text-white">Collection</h2>
            <span className="px-2.5 py-0.5 bg-accent/10 text-accent text-xs sm:text-sm font-semibold rounded-full border border-accent/20">
              {brandProducts.length} items
            </span>
          </div>

          {brandProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <p className="text-muted text-sm sm:text-lg">No products yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {brandProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onSelectProduct={setSelectedProduct} />
    </div>
  )
}
