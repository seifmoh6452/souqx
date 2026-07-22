import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, TrendingUp, Globe, Zap, Users, Send, ArrowUpRight } from 'lucide-react'

const benefits = [
  { icon: Globe, title: 'Instant Reach', desc: 'Front of thousands of premium Egyptian shoppers from day one.' },
  { icon: TrendingUp, title: 'Zero Commission', desc: 'Flat monthly fee. Your sales, your revenue.' },
  { icon: Zap, title: 'WhatsApp-Powered', desc: 'Orders flow to your WhatsApp. No complex systems.' },
  { icon: Users, title: 'Brand Identity', desc: 'Your own page. Your own story. Premium presence.' },
]

export default function BecomeSeller() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', email: '', whatsapp: '', category: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass = "w-full px-4 py-3.5 bg-white border border-ink/[0.06] rounded-2xl text-ink text-sm placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"

  return (
    <section id="become-seller" className="py-24 sm:py-32 lg:py-40 bg-surface-1">
      <div className="container-xl section">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="label-micro bg-accent/10 text-accent border border-accent/20 mb-5 inline-flex">Join SOUQX</span>
          <h2 className="text-big sm:text-display-lg font-black text-ink tracking-tight mb-5">
            Sell Where the<br />
            <span className="text-gradient-accent">Best Brands Live</span>
          </h2>
          <p className="text-ink-tertiary max-w-lg mx-auto leading-relaxed">
            If you have a brand with something real to say, we want you here.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex gap-4 p-5 card-modern card-hover group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <b.icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-ink font-bold text-sm mb-1">{b.title}</h3>
                  <p className="text-ink-tertiary text-sm leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-modern p-10 text-center"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mx-auto mb-5">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-ink text-xl font-black mb-2">Application Received!</h3>
                  <p className="text-ink-tertiary text-sm leading-relaxed max-w-xs mx-auto">
                    We review every application personally. Expect a response within 2–3 business days.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="card-modern p-6 sm:p-8 space-y-4"
                >
                  <h3 className="text-ink font-black text-xl mb-2">Apply to Sell</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-ink-tertiary font-bold uppercase tracking-wider mb-1.5 block">Name</label>
                      <input required type="text" placeholder="Ahmed" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-[11px] text-ink-tertiary font-bold uppercase tracking-wider mb-1.5 block">Brand</label>
                      <input required type="text" placeholder="YOURBRAND" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-ink-tertiary font-bold uppercase tracking-wider mb-1.5 block">Email</label>
                    <input required type="email" placeholder="you@brand.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
                  </div>

                  <div>
                    <label className="text-[11px] text-ink-tertiary font-bold uppercase tracking-wider mb-1.5 block">WhatsApp</label>
                    <input required type="tel" placeholder="+20 100 000 0000" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} className={inputClass} />
                  </div>

                  <div>
                    <label className="text-[11px] text-ink-tertiary font-bold uppercase tracking-wider mb-1.5 block">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={`${inputClass} appearance-none`}>
                      <option value="">Select</option>
                      <option value="fashion">Fashion</option>
                      <option value="eyewear">Eyewear</option>
                      <option value="watches">Watches</option>
                      <option value="perfumes">Perfumes</option>
                      <option value="accessories">Accessories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-ink-tertiary font-bold uppercase tracking-wider mb-1.5 block">About your brand</label>
                    <textarea rows={3} placeholder="What makes you different?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputClass} resize-none`} />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-ink hover:bg-ink/90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-medium hover:shadow-heavy text-sm"
                  >
                    <Send size={15} />
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
