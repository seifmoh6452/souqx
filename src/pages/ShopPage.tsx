import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Shirt, Watch, Glasses } from 'lucide-react'
import { getAllProducts } from '../data/products'
import type { Product } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import ProductModal from '../components/product/ProductModal'

type Category = 'perfumes' | 'clothes' | 'glasses' | 'watches' | 'accessories'

const categories: { id: Category; label: string; icon: typeof Sparkles; desc: string }[] = [
  { id: 'perfumes', label: 'Perfumes', icon: Sparkles, desc: 'Premium fragrances from MYM' },
  { id: 'clothes', label: 'Clothes', icon: Shirt, desc: 'Streetwear, tees, hoodies & more' },
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
  return false
}

export default function ShopPage() {
  const [selected, setSelected] = useState<Category | null>(null)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const allProducts = getAllProducts()

  const filtered = selected ? allProducts.filter(p => matchCategory(p, selected)) : []

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
                  const count = allProducts.filter(p => matchCategory(p, cat.id)).length
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelected(cat.id)}
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

              <h2 className="text-display-lg font-black text-white tracking-tight mb-8">
                {categories.find(c => c.id === selected)?.label}
                <span className="text-muted text-base font-normal ml-3">({filtered.length})</span>
              </h2>

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

      <ProductModal product={quickView} onClose={() => setQuickView(null)} onSelectProduct={setQuickView} />
    </div>
  )
}
