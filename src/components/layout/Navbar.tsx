import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { brands } from '../../data/brands'
import { getAllProducts } from '../../data/products'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, openCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const allProducts = getAllProducts()

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { brands: [], products: [] }
    const q = searchQuery.toLowerCase()
    const matchedBrands = brands.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
    const matchedProducts = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 8)
    return { brands: matchedBrands, products: matchedProducts }
  }, [searchQuery, allProducts])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setBrandsOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location])

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-wide section-padding">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-1">
                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">SOUQ</span>
                <span className="text-accent font-black text-xl sm:text-2xl tracking-tighter">X</span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/">Home</NavLink>

              <div className="relative" onMouseEnter={() => setBrandsOpen(true)} onMouseLeave={() => setBrandsOpen(false)}>
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  Brands
                  <ChevronDown size={14} className={`transition-transform ${brandsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {brandsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-2xl p-2 shadow-2xl border border-white/[0.08]"
                      style={{ background: '#111111' }}
                    >
                      {brands.map(brand => (
                        <Link
                          key={brand.id}
                          to={`/brand/${brand.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#090909' }}>
                            <img
                              src={`/logos/${brand.slug}.jpeg`}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                              style={{ mixBlendMode: brand.logoBg === 'light' ? 'screen' : 'normal' }}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white group-hover:text-accent transition-colors">{brand.name}</div>
                            <div className="text-xs text-muted">{allProducts.filter(p => p.brandSlug === brand.slug).length} items</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/#categories">Categories</NavLink>
              <NavLink to="/become-a-seller">Become a Seller</NavLink>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setSearchOpen(true)}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <Search size={19} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={openCart}
                className="relative w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1 min-w-[18px] h-[18px] bg-accent text-bg text-[10px] font-black rounded-full flex items-center justify-center px-1"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Backdrop */}
      <AnimatePresence>
        {(mobileOpen || searchOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => { setMobileOpen(false); setSearchOpen(false) }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-sm z-50 bg-bg border-l border-white/[0.06] flex flex-col pt-20 pb-8 px-6 overscroll-contain"
          >
            <div className="flex flex-col gap-0.5">
              <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-widest px-3 pt-5 pb-2">Brands</div>
              {brands.map(brand => (
                <MobileNavLink key={brand.id} to={`/brand/${brand.slug}`} onClick={() => setMobileOpen(false)}>
                  {brand.name}
                </MobileNavLink>
              ))}
              <div className="h-px bg-white/[0.06] my-3" />
              <MobileNavLink to="/#categories" onClick={() => setMobileOpen(false)}>Categories</MobileNavLink>
              <MobileNavLink to="/become-a-seller" onClick={() => setMobileOpen(false)}>Become a Seller</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            onClick={() => { setSearchOpen(false); setSearchQuery('') }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search brands, products..."
                  className="w-full pl-12 pr-14 py-4 bg-card border border-white/10 rounded-2xl text-white placeholder-muted focus:outline-none focus:border-accent/40 text-base sm:text-lg"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {searchQuery.trim() && (
                <div className="mt-2 bg-card border border-white/[0.08] rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
                  {searchResults.brands.length === 0 && searchResults.products.length === 0 && (
                    <div className="p-8 text-center text-muted text-sm">No results found for "{searchQuery}"</div>
                  )}

                  {searchResults.brands.length > 0 && (
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest px-3 py-2">Brands</p>
                      {searchResults.brands.map(brand => (
                        <Link
                          key={brand.id}
                          to={`/brand/${brand.slug}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-[#090909]">
                            <img src={`/logos/${brand.slug}.jpeg`} alt={brand.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{brand.name}</div>
                            <div className="text-xs text-muted">{brand.category}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div className="p-2 border-t border-white/[0.06]">
                      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest px-3 py-2">Products</p>
                      {searchResults.products.map(product => (
                        <Link
                          key={product.id}
                          to={`/brand/${product.brandSlug}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#090909]">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{product.name}</div>
                            <div className="text-xs text-muted">{product.brandName}</div>
                          </div>
                          <div className="text-sm font-bold text-accent">{product.price.toLocaleString()} EGP</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive
          ? 'text-white bg-white/5'
          : 'text-muted hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-3 py-3.5 text-base font-semibold text-white hover:text-accent rounded-xl hover:bg-white/5 transition-all min-h-[48px] flex items-center"
    >
      {children}
    </Link>
  )
}
