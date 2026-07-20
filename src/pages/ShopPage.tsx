import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Shirt, Watch, Glasses, X } from 'lucide-react'
import { getAllProducts } from '../data/products'
import { getMymPerfumesByGender } from '../data/mym-perfumes'
import type { Product } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import ProductModal from '../components/product/ProductModal'

type Category = 'perfumes' | 'clothes' | 'glasses' | 'watches' | 'accessories' | 'basics'

const categories: { id: Category; label: string; icon: typeof Sparkles; desc: string }[] = [
  { id: 'perfumes', label: 'Perfumes', icon: Sparkles, desc: 'Premium fragrances from MYM' },
  { id: 'clothes', label: 'Clothes', icon: Shirt, desc: 'Streetwear, tees, hoodies & more' },
  { id: 'basics', label: 'Basics', icon: Shirt, desc: 'High-quality women\'s basics from Girl Math' },
  { id: 'glasses', label: 'Glasses', icon: Glasses, desc: 'Sunglasses & eyewear from GLASSWEAR' },
  { id: 'watches', label: 'Watches', icon: Watch, desc: 'Premium watches from WATCH EYE' },
  { id: 'accessories', label: 'Accessories', icon: Watch, desc: 'Essentials & extras' },
]

function matchCategory(product: Product, cat: Category): boolean {
  const c = product.category.toLowerCase()
  if (cat === 'perfumes') return c === 'perfumes' || product.brandSlug === 'mym'
  if (cat === 'clothes') return c === 't-shirts' || c === 'hoodies' || c === 'sets' || c === 'pants' || c === 'fashion' || product.brandSlug === 'modesta'
  if (cat === 'glasses') return product.brandSlug === 'glasswear' || c === 'eyewear' && product.brandSlug === 'glasswear'
  if (cat === 'watches') return product.brandSlug === 'watcheye' || c === 'watches'
  if (cat === 'accessories') return product.brandSlug === 'wantsneeds'
  if (cat === 'basics') return product.brandSlug === 'girlmath'
  return false
}

export default function ShopPage() {
  const [selected, setSelected] = useState<Category | null>(null)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [genderTab, setGenderTab] = useState<'him' | 'her'>('him')
  const [showGenderModal, setShowGenderModal] = useState(false)
  const allProducts = getAllProducts()

  const filtered = selected
    ? selected === 'perfumes'
      ? getMymPerfumesByGender(genderTab)
      : allProducts.filter(p => matchCategory(p, selected))
    : []

  const handleCategoryClick = (cat: Category) => {
    if (cat === 'perfumes') {
      setShowGenderModal(true)
    } else {
      setSelected(cat)
    }
  }

  const handleGenderPick = (gender: 'him' | 'her') => {
    setGenderTab(gender)
    setShowGenderModal(false)
    setSelected('perfumes')
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <span className="label-tag mb-3 inline-flex">Shop by Category</span>
                <h1 className="text-display-xl font-black text-white tracking-tight mt-3">
                  What Are You<br />
                  <span className="text-gradient-accent">Looking For?</span>
                </h1>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
                {categories.map((cat, i) => {
                  const Icon = cat.icon
                  const count = cat.id === 'perfumes'
                    ? getMymPerfumesByGender('him').length + getMymPerfumesByGender('her').length
                    : allProducts.filter(p => matchCategory(p, cat.id)).length
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="group bg-card border border-white/[0.06] rounded-3xl p-6 sm:p-8 text-center hover:border-accent/30 transition-all duration-300"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                        <Icon size={28} className="text-accent" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">{cat.label}</h3>
                      <p className="text-muted text-sm mb-3">{cat.desc}</p>
                      <span className="text-accent text-xs font-semibold">{count} products</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-muted hover:text-white text-sm mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                All Categories
              </button>

              <h2 className="text-display-lg font-black text-white tracking-tight mb-6">
                {categories.find(c => c.id === selected)?.label}
                <span className="text-muted text-base font-normal ml-3">({filtered.length})</span>
              </h2>

              {/* Him/Her switcher for Perfumes */}
              {selected === 'perfumes' && (
                <div className="flex gap-3 mb-8">
                  <button
                    onClick={() => setGenderTab('him')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border transition-all min-h-[48px] ${
                      genderTab === 'him'
                        ? 'bg-accent text-bg border-accent'
                        : 'border-white/[0.08] text-white hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    🔥 For Him
                  </button>
                  <button
                    onClick={() => setGenderTab('her')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border transition-all min-h-[48px] ${
                      genderTab === 'her'
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'border-white/[0.08] text-white hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    💐 For Her
                  </button>
                </div>
              )}

              {filtered.length === 0 ? (
                <p className="text-muted text-center py-20">No products in this category yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <ProductCard product={product} onQuickView={setQuickView} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gender selection modal for Perfumes */}
      <AnimatePresence>
        {showGenderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl px-4"
            onClick={() => setShowGenderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="bg-[#0d0d0d] border border-white/[0.08] rounded-3xl p-8 relative">
                <button
                  onClick={() => setShowGenderModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-muted hover:text-white transition-all"
                >
                  <X size={18} />
                </button>

                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-accent" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">Perfumes</h2>
                  <p className="text-muted text-sm">Choose a category to browse</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGenderPick('him')}
                    className="group bg-card border border-white/[0.06] rounded-2xl p-6 text-center hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <span className="text-3xl">🔥</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">For Him</h3>
                    <p className="text-accent text-xs font-semibold">{getMymPerfumesByGender('him').length} products</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGenderPick('her')}
                    className="group bg-card border border-white/[0.06] rounded-2xl p-6 text-center hover:border-pink-500/40 hover:bg-pink-500/5 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/20 transition-colors">
                      <span className="text-3xl">💐</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">For Her</h3>
                    <p className="text-pink-400 text-xs font-semibold">{getMymPerfumesByGender('her').length} products</p>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal product={quickView} onClose={() => setQuickView(null)} onSelectProduct={setQuickView} />
    </div>
  )
}
