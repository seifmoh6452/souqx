import { motion } from 'framer-motion'
import { Zap, Shield, Package, Users } from 'lucide-react'

const pillars = [
  {
    icon: Zap,
    title: 'Curated',
    desc: 'Every brand handpicked. No noise, no filler.',
  },
  {
    icon: Shield,
    title: 'Verified',
    desc: 'Authentic products, partnered directly with brands.',
  },
  {
    icon: Package,
    title: 'Seamless',
    desc: 'Order via WhatsApp in seconds. Zero friction.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Built for Egyptian shoppers and local creators.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 lg:py-40">
      <div className="container-xl section">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <span className="label-micro bg-accent/10 text-accent border border-accent/20 mb-6 inline-flex">Our Story</span>
            <h2 className="text-big sm:text-display-lg font-black text-ink tracking-tight mb-6">
              Built for Egypt.<br />
              <span className="text-gradient-accent">Designed for Now.</span>
            </h2>
            <p className="text-ink-secondary leading-relaxed mb-4">
              SOUQX was born from a simple belief: Egypt's best brands deserve a world-class home. We saw incredible local talent scattered across DMs and WhatsApp numbers.
            </p>
            <p className="text-ink-secondary leading-relaxed mb-8">
              So we built one place. One marketplace where premium Egyptian brands live together, where discovery is effortless, and where ordering feels as smooth as it looks.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent shadow-glow-sm" />
              <span className="text-ink font-bold text-sm">One Marketplace. Endless Brands.</span>
            </div>
          </motion.div>

          {/* Right — pillars grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="card-modern card-hover p-6 sm:p-7 group"
              >
                <div className="w-11 h-11 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <pillar.icon size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-ink font-black text-base mb-2">{pillar.title}</h3>
                <p className="text-ink-tertiary text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
