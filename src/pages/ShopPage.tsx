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
  { id: 'basics', label: 'Basics', icon: Shirt, desc: "High-quality women's basics from Girl Math" },
  { id: 'glasses', label: 'Glasses', icon: Glasses, desc: 'Sunglasses & eyewear from GLASSWEAR' },
  { id: 'watches', label: 'Watches', icon: Watch, desc: 'Premium watches from WATCH EYE' },
  { id: 'accessories', label: 'Accessories', icon: Watch, desc: 'Essentials & extras' },
]

function matchCategory(product: Product, cat: Category): boolean {
  const c = product.category.toLowerCase()
  if (cat === 'perfumes') return c === 'perfumes' || product.brandSlug === 'mym'
  if (cat === 'clothes') return c === 't-shirts' || c === 'hoodies' || c === 'sets' || c === 'pants' || c === 'fashion' || product.brandSlug === 'modesta'
  if (cat === 'glasses') return product.brandSlug === 'glasswear' || (c === 'eyewear' && product.brandSlug === 'glasswear')
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
    <div className="min-h-screen pt-20 pb-16 bg-white">
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
                <span className="label-micro bg-surface-1 border border-ink/[0.06] text-ink-tertiary mb-3 inline-flex">Shop by Category</span>
                <h1 className="text-display-xl font-black text-ink tracking-tight mt-3">
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
                      className="group card-modern card-hover p-6 sm:p-8 text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/15 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                        <Icon size={28} className="text-accent" />
                      </div>
                      <h3 className="text-ink font-bold text-lg mb-1">{cat.label}</h3>
                      <p className="text-ink-tertiary text-sm mb-3">{cat.desc}</p>
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
                className="flex items-center gap-2 text-ink-tertiary hover:text-ink text-sm mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                All Categories
              </button>

              <h2 className="text-display-lg font-black text-ink tracking-tight mb-6">
                {categories.find(c => c.id === selected)?.label}
                <span className="text-ink-tertiary text-base font-normal ml-3">({filtered.length})</span>
              </h2>

              {selected === 'perfumes' && (
                <div className="flex gap-3 mb-8">
                  <button
                    onClick={() => setGenderTab('him')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border transition-all min-h-[48px] ${
                      genderTab === 'him'
                        ? 'bg-ink text-white border-ink'
                        : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
                    }`}
                  >
                    For Him
                  </button>
                  <button
                    onClick={() => setGenderTab('her')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border transition-all min-h-[48px] ${
                      genderTab === 'her'
                        ? 'bg-rose text-white border-rose'
                        : 'border-ink/[0.06] text-ink hover:bg-surface-1 hover:border-ink/[0.1]'
                    }`}
                  >
                    For Her
                  </button>
                </div>
              )}

              {filtered.length === 0 ? (
                <p className="text-ink-tertiary text-center py-20">No products in this category yet.</p>
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

      <AnimatePresence>
        {showGenderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm px-4"
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
              <div className="bg-white border border-ink/[0.04] rounded-3xl p-8 relative shadow-heavy">
                <button
                  onClick={() => setShowGenderModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-surface-1 border border-ink/[0.04] text-ink-tertiary hover:text-ink transition-all"
                >
                  <X size={18} />
                </button>

                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/15 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-accent" />
                  </div>
                  <h2 className="text-2xl font-black text-ink mb-1">Perfumes</h2>
                  <p className="text-ink-tertiary text-sm">Choose a category to browse</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGenderPick('him')}
                    className="group card-modern p-6 text-center hover:border-ink/[0.1]"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <span className="text-3xl">🔥</span>
                    </div>
                    <h3 className="text-ink font-bold text-lg mb-1">For Him</h3>
                    <p className="text-accent text-xs font-semibold">{getMymPerfumesByGender('him').length} products</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGenderPick('her')}
                    className="group card-modern p-6 text-center hover:border-rose/20"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-rose/10 border border-rose/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-rose/20 transition-colors">
                      <span className="text-3xl">💐</span>
                    </div>
                    <h3 className="text-ink font-bold text-lg mb-1">For Her</h3>
                    <p className="text-rose text-xs font-semibold">{getMymPerfumesByGender('her').length} products</p>
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
