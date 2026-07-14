import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import HomePage from './pages/HomePage'
import BrandPage from './pages/BrandPage'
import BecomeSellerPage from './pages/BecomeSellerPage'
import AdminPage from './pages/AdminPage'

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
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
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
  )
}
