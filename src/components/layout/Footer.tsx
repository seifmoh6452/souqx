import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] mt-16 sm:mt-24">
      <div className="container-wide section-padding py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-3">
              <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">SOUQ</span>
              <span className="text-accent font-black text-xl sm:text-2xl tracking-tighter">X</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-4">
              Egypt's most curated marketplace. One platform. Endless premium brands.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'X / Twitter' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-muted hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wide uppercase">Marketplace</h4>
            <ul className="flex flex-col">
              {[
                { label: 'All Brands', to: '/' },
                { label: 'Fashion', to: '/#categories' },
                { label: 'Eyewear', to: '/#categories' },
                { label: 'Watches', to: '/#categories' },
                { label: 'Trending', to: '/' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted text-sm hover:text-white transition-colors inline-flex items-center min-h-[36px] sm:min-h-[40px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wide uppercase">Brands</h4>
            <ul className="flex flex-col">
              {[
                { label: 'MYM', to: '/brand/mym' },
                { label: 'MODESTA', to: '/brand/modesta' },
                { label: 'GLASSWEAR', to: '/brand/glasswear' },
                { label: 'WATCH EYE', to: '/brand/watcheye' },
                { label: 'WANTS & NEEDS', to: '/brand/wantsneeds' },
                { label: 'Girl Math', to: '/brand/girlmath' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted text-sm hover:text-white transition-colors inline-flex items-center min-h-[36px] sm:min-h-[40px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wide uppercase">Company</h4>
            <ul className="flex flex-col">
              {[
                { label: 'About SOUQX', to: '/#about' },
                { label: 'How It Works', to: '/' },
                { label: 'Privacy Policy', to: '/' },
                { label: 'Terms of Service', to: '/' },
                { label: 'Contact', to: '/' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted text-sm hover:text-white transition-colors inline-flex items-center min-h-[36px] sm:min-h-[40px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 sm:pt-8 border-t border-white/[0.06]">
          <p className="text-muted text-xs">
            © {currentYear} SOUQX. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="glow-dot" />
            <span className="text-muted text-xs">One Marketplace. Endless Brands.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
