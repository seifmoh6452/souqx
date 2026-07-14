import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { categories } from '../../data/categories'

export default function Categories() {
  return (
    <section id="categories" className="py-16 sm:py-24 section-padding bg-[#0b0b0b]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="label-tag mb-3 inline-flex">Shop by Category</span>
          <h2 className="text-display-lg font-black text-white tracking-tight">
            Find What<br />
            <span className="text-gradient-accent">You're Looking For</span>
          </h2>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={!cat.comingSoon ? { y: -6, scale: 1.02 } : {}}
              className={`relative group overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer ${
                cat.comingSoon ? 'opacity-50' : ''
              }`}
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  !cat.comingSoon ? 'group-hover:scale-110' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Coming soon overlay */}
              {cat.comingSoon && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <Lock size={20} className="text-muted mx-auto mb-2" />
                    <span className="text-muted text-xs font-semibold">Coming Soon</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-black text-lg tracking-tight mb-1">{cat.name}</h3>
                {!cat.comingSoon && (
                  <div className="flex items-center gap-1 text-muted text-xs">
                    <span>{cat.productCount} products</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
