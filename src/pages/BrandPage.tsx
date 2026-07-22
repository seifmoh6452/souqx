import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react'
import { brands } from '../data/brands'
import { getProductsByBrand } from '../data/products'
import { getMymPerfumesByGender } from '../data/mym-perfumes'
import type { Product } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import ProductModal from '../components/product/ProductModal'

const PER_PAGE = 20

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [page, setPage] = useState(1)
  const [genderTab, setGenderTab] = useState<'him' | 'her'>('him')
  const openedFromSearch = useRef(false)

  const brand = brands.find(b => b.slug === slug)
  const isMym = slug === 'mym'
  const allBrandProducts = slug ? getProductsByBrand(slug) : []
  const brandProducts = isMym ? getMymPerfumesByGender(genderTab) : allBrandProducts
  const totalPages = Math.ceil(brandProducts.length / PER_PAGE)
  const pagedProducts = brandProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  useEffect(() => {
    setPage(1)
  }, [slug])

  useEffect(() => {
    if (openedFromSearch.current) return
    const openId = (location.state as { openProduct?: string } | null)?.openProduct
    if (openId && brandProducts.length > 0) {
      const match = brandProducts.find(p => p.id === openId)
      if (match) {
        setSelectedProduct(match)
        openedFromSearch.current = true
      }
    }
  }, [location.state, brandProducts])

  if (!brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-2xl font-black text-ink">Brand not found</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 bg-white">
      <div className="section container-xl pb-6 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/">
            <motion.div
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-ink text-sm font-semibold w-fit mb-6 sm:mb-8 min-h-[44px]"
            >
              <ArrowLeft size={15} />
              Back
            </motion.div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-5 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-soft border border-ink/[0.04] flex-shrink-0 bg-white">
              <img src={`/logos/${brand.slug}.jpeg`} alt={brand.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: brand.accentColor }}>
                {brand.category}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight">{brand.name}</h1>
            </div>
          </div>
          <p className="text-ink-tertiary text-sm sm:text-base italic">"{brand.tagline}"</p>
        </motion.div>
      </div>

      <div className="section container-xl py-6 sm:py-10">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center mb-10 sm:mb-16 pb-10 sm:pb-16 border-b border-ink/[0.04]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-ink-secondary text-lg leading-relaxed"
          >
            {brand.description}
          </motion.p>

          <div className="flex gap-4 sm:gap-6">
            {[
              { value: `${allBrandProducts.length}`, label: 'Products' },
              { value: '100%', label: 'Egyptian' },
              { value: '5.0', label: 'Rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-ink">{stat.value}</div>
                <div className="text-ink-tertiary text-[11px] sm:text-xs mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {isMym && (
          <div className="flex gap-3 mb-6 sm:mb-8">
            <button
              onClick={() => { setGenderTab('him'); setPage(1) }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all min-h-[44px] ${
                genderTab === 'him'
                  ? 'bg-ink text-white border-ink'
                  : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
              }`}
            >
              <Sparkles size={16} />
              For Him
            </button>
            <button
              onClick={() => { setGenderTab('her'); setPage(1) }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all min-h-[44px] ${
                genderTab === 'her'
                  ? 'bg-rose text-white border-rose'
                  : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
              }`}
            >
              <Heart size={16} />
              For Her
            </button>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8">
            <Package size={18} className="text-accent" />
            <h2 className="text-xl sm:text-2xl font-black text-ink">Collection</h2>
            <span className="label-micro bg-accent/10 text-accent border border-accent/20">
              {brandProducts.length} items
            </span>
          </div>

          {brandProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <p className="text-ink-tertiary text-sm sm:text-lg">No products yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {pagedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                    disabled={page === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                      page === 1
                        ? 'border-ink/[0.04] text-ink-faint cursor-not-allowed'
                        : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all ${
                        p === page
                          ? 'bg-ink text-white border-ink'
                          : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                    disabled={page === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                      page === totalPages
                        ? 'border-ink/[0.04] text-ink-faint cursor-not-allowed'
                        : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onSelectProduct={setSelectedProduct} />
    </div>
  )
}
