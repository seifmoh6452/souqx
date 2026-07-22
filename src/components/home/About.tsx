import { motion } from 'framer-motion'
import { Zap, Shield, Package, Users } from 'lucide-react'

const pillars = [
  {
    icon: Zap,
    title: 'Curated Brands',
    desc: 'Every brand on SOUQX is handpicked for quality, identity, and craft. No noise, no filler.',
  },
  {
    icon: Shield,
    title: 'Verified Products',
    desc: 'Every item is authentic. We partner directly with each brand for guaranteed quality.',
  },
  {
    icon: Package,
    title: 'Seamless Ordering',
    desc: 'Order through WhatsApp in seconds. No account needed. No friction.',
  },
  {
    icon: Users,
    title: 'Community-First',
    desc: 'Built for Egyptian shoppers. Designed to support local creators and entrepreneurs.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 section-padding">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="label-tag mb-5 inline-flex">Our Story</span>
            <h2 className="text-display-lg font-black text-white tracking-tight mb-6">
              Built for Egypt.<br />
              <span className="text-gradient-accent">Designed for Now.</span>
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              SOUQX was built on a simple belief: Egypt's best brands deserve a world-class home. We saw incredible local talent — designers, watchmakers, eyewear artists — scattered across Instagram DMs and WhatsApp numbers.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              So we built one place. One marketplace where premium Egyptian brands live together, where discovery is effortless, and where ordering feels as smooth as it looks.
            </p>
            <div className="flex items-center gap-3">
              <div className="glow-dot" />
              <span className="text-white font-semibold">One Marketplace. Endless Brands.</span>
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-5 bg-card rounded-2xl border border-white/[0.06] group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-bg transition-all duration-300">
                  <pillar.icon size={18} />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{pillar.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
