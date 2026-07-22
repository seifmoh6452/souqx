import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const footerLinks = {
  marketplace: [
    { label: 'All Brands', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Trending', to: '/shop' },
  ],
  brands: [
    { label: 'MYM', to: '/brand/mym' },
    { label: 'MODESTA', to: '/brand/modesta' },
    { label: 'GLASSWEAR', to: '/brand/glasswear' },
    { label: 'WATCH EYE', to: '/brand/watcheye' },
    { label: 'WANTS & NEEDS', to: '/brand/wantsneeds' },
    { label: 'Girl Math', to: '/brand/girlmath' },
  ],
  company: [
    { label: 'About', to: '/#about' },
    { label: 'Sell on SOUQX', to: '/#seller' },
    { label: 'Contact', to: '/' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/[0.04] bg-white mt-16 sm:mt-24">
      <div className="section container-xl py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-1 mb-4">
              <span className="text-ink font-black text-xl tracking-tight">SOUQ</span>
              <span className="text-accent font-black text-xl tracking-tight">X</span>
            </Link>
            <p className="text-ink-tertiary text-sm leading-relaxed mb-5">
              Egypt's most curated marketplace.<br />One platform. Endless premium brands.
            </p>
            <div className="flex gap-2">
              {['Instagram', 'TikTok', 'WhatsApp'].map(social => (
                <motion.a
                  key={social}
                  href="#"
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-surface-1 border border-ink/[0.04] flex items-center justify-center text-ink-tertiary hover:text-ink hover:border-ink/[0.1] transition-all"
                >
                  <span className="text-[10px] font-bold">{social[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {[
            { title: 'Marketplace', links: footerLinks.marketplace },
            { title: 'Brands', links: footerLinks.brands },
            { title: 'Company', links: footerLinks.company },
          ].map(group => (
            <div key={group.title}>
              <h4 className="text-ink text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{group.title}</h4>
              <ul className="space-y-1">
                {group.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-ink-tertiary text-sm hover:text-ink transition-colors inline-flex min-h-[36px] items-center"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="text-ink-tertiary text-xs">
            © {year} SOUQX. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
            <span className="text-ink-tertiary text-xs">One Marketplace. Endless Brands.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
