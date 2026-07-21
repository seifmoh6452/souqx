import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Trash2, Pencil, ArrowLeft, X, Check, TrendingUp, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brands } from '../data/brands'
import { getAllProducts, getCloudProducts, loadCloudProducts } from '../data/products'
import { addSupabaseProduct, updateSupabaseProduct, deleteSupabaseProduct } from '../lib/products-db'
import type { Product } from '../data/products'

const ADMIN_USER = 'admin'
const ADMIN_PASS = '1234567890'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [authError, setAuthError] = useState('')
  const [brandSlug, setBrandSlug] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imageColors, setImageColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [sizeChart, setSizeChart] = useState('')
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [, setRefresh] = useState(0)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setAuthed(true)
    } else {
      setAuthError('Wrong username or password')
      setPass('')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
              <Lock size={24} className="text-accent" />
            </div>
            <h1 className="text-2xl font-black text-white text-center mb-1">Admin Login</h1>
            <p className="text-muted text-sm text-center mb-6">Enter your credentials to continue</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-1.5 block">Username</label>
                <input
                  type="text"
                  value={user}
                  onChange={e => { setUser(e.target.value); setAuthError('') }}
                  autoFocus
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-accent/40"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={pass}
                  onChange={e => { setPass(e.target.value); setAuthError('') }}
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-accent/40"
                />
              </div>
              {authError && (
                <p className="text-red-400 text-xs font-semibold text-center">{authError}</p>
              )}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl text-sm transition-colors"
              >
                Login
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  const brand = brands.find(b => b.slug === brandSlug)
  const allProducts = getAllProducts()
  const cloudIds = new Set(getCloudProducts().map(p => p.id))

  const filteredProducts = filterBrand
    ? allProducts.filter(p => p.brandSlug === filterBrand)
    : allProducts

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setImages(prev => [...prev, reader.result as string])
        setImageColors(prev => [...prev, ''])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageColors(prev => prev.filter((_, i) => i !== index))
  }

  const moveImage = (from: number, to: number) => {
    setImages(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setImageColors(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const setImageColor = (index: number, color: string) => {
    setImageColors(prev => {
      const next = [...prev]
      next[index] = color
      return next
    })
  }

  const resetForm = () => {
    setBrandSlug('')
    setName('')
    setPrice('')
    setOriginalPrice('')
    setDescription('')
    setImages([])
    setImageColors([])
    setSizes([])
    setSizeChart('')
    setEditingId(null)
    setError('')
  }

  const handleSubmit = async () => {
    if (!brand || !name || !price || images.length === 0) return
    setLoading(true)

    try {
      if (editingId) {
        const existing = getCloudProducts().find(p => p.id === editingId)
        if (existing) {
          await updateSupabaseProduct({
            ...existing,
            brandId: brand.id,
            brandName: brand.name,
            brandSlug: brand.slug,
            name,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            description: description || `${name} from ${brand.name}`,
            images,
            sizes: sizes.length > 0 ? sizes : undefined,
            imageColors: imageColors.some(c => c) ? imageColors : undefined,
            sizeChart: sizeChart || undefined,
          })
        }
      } else {
        const newProduct: Product = {
          id: `custom-${Date.now()}`,
          brandId: brand.id,
          brandName: brand.name,
          brandSlug: brand.slug,
          name,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          currency: 'EGP',
          category: brand.category,
          images,
          description: description || `${name} from ${brand.name}`,
          sizes: sizes.length > 0 ? sizes : undefined,
          imageColors: imageColors.some(c => c) ? imageColors : undefined,
          sizeChart: sizeChart || undefined,
          inStock: true,
          whatsappNumber: '+201001234567',
        }
        await addSupabaseProduct(newProduct)
      }

      await loadCloudProducts()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      resetForm()
      setRefresh(r => r + 1)
    } catch (err) {
      console.error('Failed to save product:', err)
      setError('Failed to save. Check console for details.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setBrandSlug(product.brandSlug)
    setName(product.name)
    setPrice(String(product.price))
    setOriginalPrice(product.originalPrice ? String(product.originalPrice) : '')
    setDescription(product.description)
    setImages([...product.images])
    setImageColors(product.imageColors ? [...product.imageColors] : product.images.map(() => ''))
    setSizes(product.sizes || [])
    setSizeChart(product.sizeChart || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRemove = async (id: string) => {
    try {
      await deleteSupabaseProduct(id)
      await loadCloudProducts()
      if (editingId === id) resetForm()
      setRefresh(r => r + 1)
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2 text-muted hover:text-white text-sm font-semibold transition-colors">
              <ArrowLeft size={15} />
              Back to Store
            </motion.div>
          </Link>
          <Link to="/admin/analytics">
            <motion.div whileHover={{ x: 4 }} className="flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-semibold transition-colors">
              Order Analytics
              <TrendingUp size={15} />
            </motion.div>
          </Link>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">{editingId ? 'Edit Product' : 'Add Product'}</h1>
        <p className="text-muted text-sm mb-8">{editingId ? 'Update the product details below.' : 'Add a product to any brand. It will appear on the live site immediately.'}</p>

        <div className="space-y-5 bg-card border border-white/[0.06] rounded-2xl p-6 mb-10">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Brand</label>
            <select
              value={brandSlug}
              onChange={e => setBrandSlug(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-accent/40 appearance-none"
            >
              <option value="">Select brand...</option>
              {brands.map(b => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">
              Product Images ({images.length})
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative rounded-xl border border-white/[0.08] overflow-hidden group">
                    <div className="aspect-square overflow-hidden relative">
                      <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 text-[9px] font-bold text-accent bg-black/70 rounded px-1 py-0.5">Main</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {i > 0 && (
                          <button
                            onClick={() => moveImage(i, i - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur text-white hover:bg-white/20 text-xs"
                          >
                            &#8592;
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/20 backdrop-blur text-red-400 hover:bg-red-500/30 text-xs"
                        >
                          &#10005;
                        </button>
                        {i < images.length - 1 && (
                          <button
                            onClick={() => moveImage(i, i + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur text-white hover:bg-white/20 text-xs"
                          >
                            &#8594;
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-1.5 bg-[#0a0a0a]">
                      <input
                        type="text"
                        value={imageColors[i] || ''}
                        onChange={e => setImageColor(i, e.target.value)}
                        placeholder="Color (optional)"
                        className="w-full px-2 py-1.5 bg-[#0f0f0f] border border-white/[0.08] rounded-lg text-white text-[10px] text-center placeholder-muted/50 focus:outline-none focus:border-accent/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-white/20 transition-colors">
              <div className="flex flex-col items-center gap-2 text-muted">
                <Upload size={24} />
                <span className="text-sm">{images.length === 0 ? 'Click to upload images (up to 10)' : 'Add more images'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageAdd}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Oversized Hoodie"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Price (EGP)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="e.g. 500"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Original Price — Instead of (EGP, optional)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={e => setOriginalPrice(e.target.value)}
              placeholder="e.g. 700 (strikethrough shown)"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short product description..."
              rows={3}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Sizes (optional)</label>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSizes(s => s.includes(size) ? s.filter(x => x !== size) : [...s, size])}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    sizes.includes(size)
                      ? 'bg-accent text-bg border-accent'
                      : 'bg-[#0f0f0f] text-muted border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Size Chart (optional)</label>
            {sizeChart && (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/[0.08] mb-2">
                <img src={sizeChart} alt="Size chart" className="w-full h-full object-contain bg-[#0f0f0f]" />
                <button
                  onClick={() => setSizeChart('')}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-lg bg-red-500/20 backdrop-blur text-red-400 hover:bg-red-500/30 text-xs"
                >
                  &#10005;
                </button>
              </div>
            )}
            <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 text-muted">
                <Upload size={18} />
                <span className="text-sm">{sizeChart ? 'Replace size chart' : 'Upload size chart image'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setSizeChart(reader.result as string)
                  reader.readAsDataURL(file)
                  e.target.value = ''
                }}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-semibold text-center">{error}</p>
          )}

          <div className="flex gap-3">
            {editingId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-white/[0.06] text-muted hover:text-white transition-all"
              >
                <X size={18} />
                Cancel
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!brand || !name || !price || images.length === 0 || loading}
              className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                saved
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : brand && name && price && images.length > 0
                    ? 'bg-accent hover:bg-accent-hover text-bg'
                    : 'bg-white/[0.06] text-muted cursor-not-allowed'
              }`}
            >
              {editingId ? <Check size={18} /> : <Plus size={18} />}
              {loading ? 'Saving...' : saved ? 'Saved!' : editingId ? 'Update Product' : 'Add Product'}
            </motion.button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">All Products ({filteredProducts.length})</h2>
            <select
              value={filterBrand}
              onChange={e => setFilterBrand(e.target.value)}
              className="px-3 py-1.5 bg-[#0f0f0f] border border-white/[0.08] rounded-lg text-white text-xs focus:outline-none focus:border-accent/40 appearance-none"
            >
              <option value="">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-8">
            {brands
              .filter(b => !filterBrand || b.slug === filterBrand)
              .map(b => {
                const brandProducts = filteredProducts.filter(p => p.brandSlug === b.slug)
                if (brandProducts.length === 0) return null
                return (
                  <div key={b.id}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center overflow-hidden">
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-white">{b.name[0]}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white">{b.name}</h3>
                      <span className="text-xs text-muted">{brandProducts.length} products</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {brandProducts.map(p => {
                        const isCloud = cloudIds.has(p.id)
                        return (
                          <div key={p.id} className="relative bg-card border border-white/[0.06] rounded-xl overflow-hidden group">
                            <div className="aspect-square bg-[#0f0f0f] overflow-hidden">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            {isCloud && (
                              <span className="absolute top-2 left-2 text-[9px] font-bold text-accent bg-accent/10 border border-accent/20 rounded px-1.5 py-0.5">Cloud</span>
                            )}
                            <div className="p-2.5">
                              <p className="text-white text-xs font-semibold truncate">{p.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-accent text-xs font-bold">{p.price.toLocaleString()} EGP</p>
                                {p.originalPrice && (
                                  <p className="text-muted text-[10px] line-through">{p.originalPrice.toLocaleString()} EGP</p>
                                )}
                              </div>
                              {p.sizes && (
                                <p className="text-muted text-[10px] mt-0.5">{p.sizes.join(' · ')}</p>
                              )}
                            </div>
                            {isCloud && (
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur text-white hover:text-accent transition-all"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  onClick={() => handleRemove(p.id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur text-white hover:text-red-400 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
