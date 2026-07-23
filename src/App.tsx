import { Component, useEffect, useState, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6">
          <p className="text-lg font-bold mb-2">Something went wrong</p>
          <p className="text-sm text-[#555] mb-4 max-w-md text-center">{this.state.error.message}</p>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/' }} className="px-6 py-3 bg-[#00dc82] text-[#0a0a0a] rounded-xl font-bold">
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import HomePage from './pages/HomePage'
import BrandPage from './pages/BrandPage'
import BecomeSellerPage from './pages/BecomeSellerPage'
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'
import ShopPage from './pages/ShopPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { loadCloudProducts } from './data/products'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/brand/:slug" element={<BrandPage />} />
          <Route path="/become-a-seller" element={<BecomeSellerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadCloudProducts().then(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="min-h-screen bg-bg text-white">
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </ErrorBoundary>
  )
}
