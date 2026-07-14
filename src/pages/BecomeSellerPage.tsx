import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BecomeSeller from '../components/home/BecomeSeller'

export default function BecomeSellerPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="min-h-screen pt-24">
      <div className="section-padding container-wide mb-4">
        <Link to="/">
          <motion.div
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-muted hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </motion.div>
        </Link>
      </div>
      <BecomeSeller />
    </div>
  )
}
