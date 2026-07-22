import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { brands } from '../../data/brands'
import { getAllProducts } from '../../data/products'
import { useRef } from 'react'

export default function FeaturedBrands() {
  const allProducts = getAllProducts()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section id="brands" ref={containerRef} className="py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="container-xl section">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="label-micro bg-ink/[0.04] text-ink-secondary mb-4 inline-flex">Featured</span>
              <h2 className="text-big sm:text-display-lg font-black text-ink tracking-tight">
                The Brands<br />
                <span className="text-gradient-accent">Inside SOUQX</span>
              </h2>
            </div>
            <p className="text-ink-tertiary max-w-sm text-sm leading-relaxed">
              Handpicked brands that set the standard. Each one curated for quality and craft.
            </p>
          </div>
        </motion.div>

        {/* Brand grid — editorial 2+3 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {/* First two brands — large */}
          {brands.slice(0, 2).map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/brand/${brand.slug}`}
                className="group relative block rounded-3xl overflow-hidden bg-surface-1 border border-ink/[0.04] aspect-[16/10] card-hover"
              >
                <img
                  src={`/logos/${brand.slug}.jpeg`}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-xs font-bold tracking-wider uppercase mb-1">{brand.category}</p>
                      <h3 className="text-white font-black text-2xl sm:text-3xl tracking-tight">{brand.name}</h3>
                      <p className="text-white/50 text-sm mt-1 max-w-xs line-clamp-1">{brand.tagline}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-accent group-hover:text-ink transition-all duration-300 text-white">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Next brands — smaller row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {brands.slice(2).map((brand, i) => {
            const count = allProducts.filter(p => p.brandSlug === brand.slug).length
            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link
                  to={`/brand/${brand.slug}`}
                  className="group block card-modern card-hover p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-surface-2 flex-shrink-0">
                      <img
                        src={`/logos/${brand.slug}.jpeg`}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-ink text-sm tracking-tight truncate">{brand.name}</h3>
                      <p className="text-[11px] text-ink-tertiary">{brand.category}</p>
                    </div>
                  </div>
                  <p className="text-ink-tertiary text-xs leading-relaxed line-clamp-2 mb-4">{brand.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ink-tertiary">{count} products</span>
                    <ArrowUpRight size={14} className="text-ink-faint group-hover:text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
