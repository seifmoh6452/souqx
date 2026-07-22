import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { brands } from '../../data/brands'
import { getAllProducts } from '../../data/products'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>()
  const { totalItems, openCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const allProducts = getAllProducts()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
  })

  useEffect(() => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedQuery(searchQuery), 200)
    return () => clearTimeout(debounceTimer.current)
  }, [searchQuery])

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return { brands: [], products: [] }
    const q = debouncedQuery.toLowerCase()
    const matchedBrands = brands.filter(b => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
    const matchedProducts = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 8)
    return { brands: matchedBrands, products: matchedProducts }
  }, [debouncedQuery, allProducts])

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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-b border-ink/[0.04] shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="container-xl section">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-0.5 relative z-10">
              <motion.span
                layout
                className="text-ink font-black text-2xl sm:text-[28px] tracking-[-0.06em]"
              >
                SOUQ
              </motion.span>
              <motion.span
                layout
                className="text-accent font-black text-2xl sm:text-[28px] tracking-[-0.06em]"
              >
                X
              </motion.span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/">Home</NavLink>

              <div
                className="relative"
                onMouseEnter={() => setBrandsOpen(true)}
                onMouseLeave={() => setBrandsOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-[13px] font-medium text-ink-secondary hover:text-ink transition-colors rounded-full hover:bg-ink/[0.03]">
                  Brands
                  <ChevronDown size={12} className={`transition-transform duration-300 ${brandsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {brandsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] rounded-3xl p-3 glass shadow-heavy"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {brands.map(brand => (
                          <Link
                            key={brand.id}
                            to={`/brand/${brand.slug}`}
                            className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-ink/[0.04] transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-surface-2">
                              <img
                                src={`/logos/${brand.slug}.jpeg`}
                                alt={brand.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-bold text-ink group-hover:text-accent transition-colors">{brand.name}</div>
                              <div className="text-[11px] text-ink-tertiary">{brand.category}</div>
                            </div>
                            <ArrowUpRight size={14} className="text-ink-faint group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/#categories">Categories</NavLink>
              <NavLink to="/become-a-seller">Sell</NavLink>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-1.5 relative z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-ink-secondary hover:text-ink hover:bg-ink/[0.04] transition-all"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openCart}
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-ink-secondary hover:text-ink hover:bg-ink/[0.04] transition-all"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={2} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-0.5 min-w-[16px] h-[16px] bg-accent text-ink text-[9px] font-black rounded-full flex items-center justify-center px-1"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-ink-secondary hover:text-ink hover:bg-ink/[0.04] transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Backdrop */}
      <AnimatePresence>
        {(mobileOpen || searchOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-md"
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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-[360px] z-50 bg-white flex flex-col overscroll-contain"
          >
            <div className="flex items-center justify-between px-6 pt-20 pb-4">
              <span className="text-xs font-bold text-ink-tertiary tracking-[0.2em] uppercase">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-2"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 px-6 pb-8 overflow-y-auto">
              <div className="space-y-1">
                <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>
                <MobileNavLink to="/shop" onClick={() => setMobileOpen(false)}>Shop</MobileNavLink>
                <MobileNavLink to="/#categories" onClick={() => setMobileOpen(false)}>Categories</MobileNavLink>
                <MobileNavLink to="/become-a-seller" onClick={() => setMobileOpen(false)}>Become a Seller</MobileNavLink>
              </div>

              <div className="divider my-6" />

              <p className="text-[10px] font-bold text-ink-tertiary tracking-[0.2em] uppercase mb-3">Brands</p>
              <div className="space-y-0.5">
                {brands.map(brand => (
                  <Link
                    key={brand.id}
                    to={`/brand/${brand.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-3 text-ink hover:text-accent transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                      <img src={`/logos/${brand.slug}.jpeg`} alt={brand.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-semibold">{brand.name}</span>
                    <ArrowUpRight size={12} className="ml-auto text-ink-faint group-hover:text-accent transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
            onClick={() => { setSearchOpen(false); setSearchQuery('') }}
          >
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[560px]"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full pl-13 pr-14 py-4.5 bg-white rounded-2xl text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/20 text-base shadow-heavy border border-ink/[0.04]"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-surface-2 text-ink-tertiary hover:text-ink transition-colors text-xs font-bold"
                >
                  ESC
                </button>
              </div>

              {debouncedQuery.trim() && (
                <div className="mt-2 bg-white rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto shadow-heavy border border-ink/[0.04]">
                  {searchResults.brands.length === 0 && searchResults.products.length === 0 && (
                    <div className="p-10 text-center text-ink-tertiary text-sm">Nothing found for "{searchQuery}"</div>
                  )}

                  {searchResults.brands.length > 0 && (
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-ink-tertiary tracking-[0.15em] uppercase px-3 py-2">Brands</p>
                      {searchResults.brands.map(brand => (
                        <Link
                          key={brand.id}
                          to={`/brand/${brand.slug}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                            <img src={`/logos/${brand.slug}.jpeg`} alt={brand.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-ink">{brand.name}</div>
                            <div className="text-[11px] text-ink-tertiary">{brand.category}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div className="p-2 border-t border-ink/[0.04]">
                      <p className="text-[10px] font-bold text-ink-tertiary tracking-[0.15em] uppercase px-3 py-2">Products</p>
                      {searchResults.products.map(product => (
                        <button
                          key={product.id}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); navigate(`/brand/${product.brandSlug}`, { state: { openProduct: product.id } }) }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors w-full text-left"
                        >
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-ink truncate">{product.name}</div>
                            <div className="text-[11px] text-ink-tertiary">{product.brandName}</div>
                          </div>
                          <div className="text-xs font-bold text-accent">{product.price.toLocaleString()} EGP</div>
                        </button>
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
      className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ${
        isActive
          ? 'text-ink bg-ink/[0.05]'
          : 'text-ink-secondary hover:text-ink hover:bg-ink/[0.03]'
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
      className="flex items-center justify-between py-4 text-ink hover:text-accent transition-colors group border-b border-ink/[0.04]"
    >
      <span className="text-[17px] font-bold">{children}</span>
      <ArrowUpRight size={16} className="text-ink-faint group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}
