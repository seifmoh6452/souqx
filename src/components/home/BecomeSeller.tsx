import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, TrendingUp, Globe, Zap, Users, Send } from 'lucide-react'

const benefits = [
  { icon: Globe, title: 'Instant Reach', desc: 'Get in front of thousands of premium shoppers across Egypt from day one.' },
  { icon: TrendingUp, title: 'Zero Commission', desc: 'We charge a flat monthly fee. Your sales, your revenue — no percentage taken.' },
  { icon: Zap, title: 'WhatsApp-Powered', desc: 'Orders flow directly to your WhatsApp. No complex systems, no learning curve.' },
  { icon: Users, title: 'Brand Identity', desc: 'Your own page. Your own story. We make you look like a million-dollar brand.' },
]

export default function BecomeSeller() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', email: '', whatsapp: '', category: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="become-seller" className="py-16 sm:py-24 section-padding bg-[#0b0b0b]">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="label-tag mb-4 inline-flex">Join SOUQX</span>
          <h2 className="text-display-lg font-black text-white tracking-tight mb-4">
            Sell Where the<br />
            <span className="text-gradient-accent">Best Brands Live</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-relaxed">
            If you have a brand with something real to say, we want you here.
            Apply to join Egypt's most curated marketplace.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-start">
          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 p-5 bg-card rounded-2xl border border-white/[0.06] group hover:border-accent/20 transition-colors"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-bg transition-all duration-300">
                  <b.icon size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{b.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl border border-white/[0.08] p-8"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-5">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-white text-xl font-black mb-2">Application Received!</h3>
                  <p className="text-muted text-sm leading-relaxed max-w-xs">
                    We review every application personally. Expect a response within 2–3 business days.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <h3 className="text-white font-black text-xl mb-6">Apply to Sell</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Ahmed Hassan"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white placeholder-muted/50 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">Brand Name</label>
                      <input
                        required
                        type="text"
                        placeholder="YOURBRAND"
                        value={form.brand}
                        onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white placeholder-muted/50 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@brand.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white placeholder-muted/50 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">WhatsApp Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+20 100 000 0000"
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white placeholder-muted/50 text-sm focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-accent/40 transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#0d0d0d]">Select a category</option>
                      <option value="fashion" className="bg-[#0d0d0d]">Fashion</option>
                      <option value="eyewear" className="bg-[#0d0d0d]">Eyewear</option>
                      <option value="watches" className="bg-[#0d0d0d]">Watches</option>
                      <option value="perfumes" className="bg-[#0d0d0d]">Perfumes</option>
                      <option value="accessories" className="bg-[#0d0d0d]">Accessories</option>
                      <option value="other" className="bg-[#0d0d0d]">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">Tell us about your brand</label>
                    <textarea
                      rows={3}
                      placeholder="What makes your brand different? What do you sell? Where are you now?"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white placeholder-muted/50 text-sm focus:outline-none focus:border-accent/40 transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send size={16} />
                    Submit Application
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
