import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Plus, Trash2, Pencil, ArrowLeft, X, Check, Download, Copy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brands } from '../data/brands'
import { getAllProducts } from '../data/products'
import { addCustomProduct, updateCustomProduct, removeCustomProduct, getCustomProducts } from '../data/custom-products'
import type { Product } from '../data/products'

export default function AdminPage() {
  const [brandSlug, setBrandSlug] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [backImagePreview, setBackImagePreview] = useState('')
  const [sizes, setSizes] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [, setRefresh] = useState(0)

  const brand = brands.find(b => b.slug === brandSlug)
  const allProducts = getAllProducts()
  const customIds = new Set(getCustomProducts().map(p => p.id))

  const filteredProducts = filterBrand
    ? allProducts.filter(p => p.brandSlug === filterBrand)
    : allProducts

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBackImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setBrandSlug('')
    setName('')
    setPrice('')
    setDescription('')
    setImagePreview('')
    setBackImagePreview('')
    setSizes([])
    setEditingId(null)
  }

  const handleSubmit = () => {
    if (!brand || !name || !price || !imagePreview) return

    const images = [imagePreview, ...(backImagePreview ? [backImagePreview] : [])]

    if (editingId) {
      const existing = getCustomProducts().find(p => p.id === editingId)
      if (existing) {
        updateCustomProduct({
          ...existing,
          brandId: brand.id,
          brandName: brand.name,
          brandSlug: brand.slug,
          name,
          price: Number(price),
          description: description || `${name} from ${brand.name}`,
          images,
          sizes: sizes.length > 0 ? sizes : undefined,
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
        currency: 'EGP',
        category: brand.category,
        images,
        description: description || `${name} from ${brand.name}`,
        sizes: sizes.length > 0 ? sizes : undefined,
        inStock: true,
        whatsappNumber: '+201001234567',
      }
      addCustomProduct(newProduct)
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    resetForm()
    setRefresh(r => r + 1)
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setBrandSlug(product.brandSlug)
    setName(product.name)
    setPrice(String(product.price))
    setDescription(product.description)
    setImagePreview(product.images[0] || '')
    setBackImagePreview(product.images[1] || '')
    setSizes(product.sizes || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRemove = (id: string) => {
    removeCustomProduct(id)
    if (editingId === id) resetForm()
    setRefresh(r => r + 1)
  }

  const customProducts = getCustomProducts()
  const exportCode = customProducts.length > 0
    ? `// Add these to src/data/products.ts inside the products array\n${customProducts.map(p => `  { id:'${p.id}', brandId:'${p.brandId}', brandName:'${p.brandName}', brandSlug:'${p.brandSlug}', name:'${p.name}', price:${p.price}, currency:'EGP', category:'${p.category}', images:[${p.images.map(i => `'${i}'`).join(', ')}], description:'${p.description.replace(/'/g, "\\'")}', ${p.sizes ? `sizes:[${p.sizes.map(s => `'${s}'`).join(', ')}], ` : ''}inStock:true, whatsappNumber:'${p.whatsappNumber}' },`).join('\n')}`
    : ''

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back */}
        <Link to="/">
          <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2 text-muted hover:text-white text-sm font-semibold mb-8 w-fit transition-colors">
            <ArrowLeft size={15} />
            Back to Store
          </motion.div>
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">{editingId ? 'Edit Product' : 'Add Product'}</h1>
        <p className="text-muted text-sm mb-8">{editingId ? 'Update the product details below.' : 'Add a product to any brand. It will appear on the live site immediately.'}</p>

        {/* Form */}
        <div className="space-y-5 bg-card border border-white/[0.06] rounded-2xl p-6 mb-10">
          {/* Brand */}
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

          {/* Front Image */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Front Image</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-white/20 transition-colors overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Front preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted">
                  <Upload size={24} />
                  <span className="text-sm">Click to upload front image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Back Image */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Back Image (optional)</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-white/20 transition-colors overflow-hidden">
              {backImagePreview ? (
                <img src={backImagePreview} alt="Back preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted">
                  <Upload size={24} />
                  <span className="text-sm">Click to upload back image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleBackImageChange} className="hidden" />
            </label>
          </div>

          {/* Name */}
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

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Price (EGP)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="e.g. 950"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40"
            />
          </div>

          {/* Description */}
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

          {/* Sizes */}
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

          {/* Buttons */}
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
              disabled={!brand || !name || !price || !imagePreview}
              className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                saved
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : brand && name && price && imagePreview
                    ? 'bg-accent hover:bg-accent-hover text-bg'
                    : 'bg-white/[0.06] text-muted cursor-not-allowed'
              }`}
            >
              {editingId ? <Check size={18} /> : <Plus size={18} />}
              {saved ? 'Saved!' : editingId ? 'Update Product' : 'Add Product'}
            </motion.button>
          </div>
        </div>

        {/* Export section */}
        {customProducts.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-semibold hover:bg-accent/20 transition-all"
            >
              <Download size={15} />
              {showExport ? 'Hide' : 'Export'} {customProducts.length} custom product(s) as code
            </button>
            {showExport && (
              <div className="mt-3 relative">
                <pre className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 text-[11px] text-green-400 overflow-x-auto max-h-64 overflow-y-auto font-mono whitespace-pre-wrap break-all">
                  {exportCode}
                </pre>
                <button
                  onClick={() => { navigator.clipboard.writeText(exportCode); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-bg text-[11px] font-bold hover:bg-accent-hover transition-all"
                >
                  <Copy size={12} />
                  {saved ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Products grouped by brand */}
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
                        const isCustom = customIds.has(p.id)
                        return (
                          <div key={p.id} className="relative bg-card border border-white/[0.06] rounded-xl overflow-hidden group">
                            <div className="aspect-square bg-[#0f0f0f] overflow-hidden">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            {isCustom && (
                              <span className="absolute top-2 left-2 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">Custom</span>
                            )}
                            <div className="p-2.5">
                              <p className="text-white text-xs font-semibold truncate">{p.name}</p>
                              <p className="text-accent text-xs font-bold">{p.price.toLocaleString()} EGP</p>
                              {p.sizes && (
                                <p className="text-muted text-[10px] mt-0.5">{p.sizes.join(' · ')}</p>
                              )}
                            </div>
                            {isCustom && (
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
