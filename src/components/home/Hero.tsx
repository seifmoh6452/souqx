import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { useRef } from 'react'
import { brands } from '../../data/brands'

export default function Hero() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-100" />

      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh" />

      {/* Floating accent orb */}
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/[0.06] blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 30, 0], y: [0, 15, -25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent/[0.04] blur-[80px] pointer-events-none"
      />

      <motion.div
        style={{ y, opacity }}
        className="container-xl section flex-1 flex flex-col justify-center relative z-10 pt-24 pb-16"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <span className="label-micro bg-accent/10 text-accent border border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
            Egypt's Most Curated Marketplace
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-8 sm:mb-12">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-mega font-black text-ink tracking-[-0.05em]"
            >
              SOUQX
            </motion.h1>
          </div>

          <div className="overflow-hidden mt-1">
            <motion.p
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-big sm:text-huge font-black text-ink/10 tracking-[-0.04em]"
            >
              Marketplace
            </motion.p>
          </div>
        </div>

        {/* Subtext + CTAs */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-ink-secondary text-base sm:text-lg leading-relaxed mb-8 text-balance"
          >
            Egypt's premium local brands, one seamless experience.
            Discover, compare, order — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/shop')}
              className="btn-primary px-7 py-3.5 text-[15px]"
            >
              Shop Now
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/#brands')}
              className="btn-ghost px-7 py-3.5 text-[15px]"
            >
              Browse Brands
            </motion.button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex items-center gap-10 sm:gap-16 mt-16 sm:mt-24"
        >
          {[
            { value: '6', label: 'Premium Brands' },
            { value: '100+', label: 'Products' },
            { value: '100%', label: 'Egyptian' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.1 }}
            >
              <div className="text-2xl sm:text-3xl font-black text-ink">{stat.value}</div>
              <div className="text-[11px] sm:text-xs text-ink-tertiary font-medium mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold text-ink-tertiary tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="text-ink-tertiary" />
        </motion.div>
      </motion.div>

      {/* Bottom brand marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-ink/[0.04] bg-white/60 backdrop-blur-xl">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="flex items-center gap-3 mx-8 flex-shrink-0">
              <div className="w-6 h-6 rounded-md overflow-hidden bg-surface-2">
                <img src={`/logos/${brand.slug}.jpeg`} alt={brand.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-ink-tertiary tracking-wider uppercase">{brand.name}</span>
              <span className="w-1 h-1 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
