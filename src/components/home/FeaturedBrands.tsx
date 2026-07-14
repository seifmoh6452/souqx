import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brands } from '../../data/brands'
import BrandLogo from '../brand/BrandLogo'

export default function FeaturedBrands() {
  return (
    <section id="brands" className="py-16 sm:py-24 section-padding">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
        >
          <div>
            <span className="label-tag mb-3 inline-flex">Featured Brands</span>
            <h2 className="text-display-lg font-black text-white tracking-tight">
              The Brands<br />
              <span className="text-gradient-accent">Inside SOUQX</span>
            </h2>
          </div>
          <p className="text-muted max-w-sm leading-relaxed">
            Handpicked brands that set the standard. Each one curated for quality, identity, and craft.
          </p>
        </motion.div>

        {/* Brand cards grid — 2 cols on md, up to 5 on xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-white/[0.06] cursor-pointer"
            >
              <Link to={`/brand/${brand.slug}`} className="block">
                {/* Full area = #090909, logo fills it, white bg removed via mix-blend-mode */}
                <div className="relative h-56 overflow-hidden" style={{ background: '#090909' }}>
                  <motion.img
                    src={`/logos/${brand.slug}.jpeg`}
                    alt={brand.name}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                    style={{
                      mixBlendMode: brand.logoBg === 'light' ? 'screen' : 'normal',
                    }}
                  />
                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-black text-white text-base tracking-tight mb-1">{brand.name}</h3>
                  <p className="text-muted text-xs leading-relaxed mb-4 line-clamp-2">{brand.tagline}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: brand.accentColor }}>{brand.category}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-xs text-muted">{brand.productCount} products</span>
                    </div>
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${brand.accentColor}18`, border: `1px solid ${brand.accentColor}33` }}
                    >
                      <ArrowRight size={13} style={{ color: brand.accentColor }} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
