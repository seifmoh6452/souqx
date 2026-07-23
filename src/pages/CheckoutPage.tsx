import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, MapPin, Phone, User, FileText, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart, getItemPrice } from '../context/CartContext'
import { saveOrder } from '../lib/orders'

const WHATSAPP_PHONES = [
  { phone: '201111273593', apiKey: '4725541' },
  { phone: '201030803000', apiKey: '2831907' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state, totalPrice, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  })

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const lines = state.items.map(item => {
      const price = getItemPrice(item.product, item.copyType)
      const copyLabel = item.copyType === 'high-copy' ? ' (High Copy)' : item.copyType === 'master-box' ? ' (Master Box)' : ''
      return `- ${item.product.brandName} - ${item.product.name}${copyLabel}${item.selectedSize ? ` [${item.selectedSize}]` : ''} x${item.quantity} = ${(price * item.quantity).toLocaleString()} EGP`
    })
    const message = [
      '*New SOUQX Order*',
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      `City: ${form.city}`,
      form.notes ? `Notes: ${form.notes}` : '',
      '',
      '--- Items ---',
      ...lines,
      '',
      `*Total: ${totalPrice.toLocaleString()} EGP*`,
      '',
      'Shipping to be confirmed.',
    ].filter(Boolean).join('\n')

    WHATSAPP_PHONES.forEach(({ phone, apiKey }) => {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`
      fetch(url, { mode: 'no-cors' }).catch(() => {})
    })

    saveOrder({
      id: Date.now().toString(),
      customerName: form.name,
      customerPhone: form.phone,
      address: form.address,
      city: form.city,
      notes: form.notes,
      items: state.items.map(item => ({
        name: item.product.name,
        brandName: item.product.brandName,
        copyType: item.copyType,
        size: item.selectedSize,
        price: getItemPrice(item.product, item.copyType),
        quantity: item.quantity,
      })),
      total: totalPrice,
      date: new Date().toISOString(),
    }).catch(() => {})

    clearCart()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-accent" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Order Placed!</h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Thank you, <span className="text-white font-semibold">{form.name}</span>. We'll contact you on <span className="text-white font-semibold">{form.phone}</span> to confirm your order.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl text-sm transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  if (state.items.length === 0) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-white mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* Shipping Form */}
        <div className="lg:flex-1 space-y-4">
          <div className="bg-card border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin size={16} className="text-accent" />
              Shipping Details
            </h2>

            <div>
              <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Mohamed Ali"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">
                Address
              </label>
              <input
                required
                type="text"
                value={form.address}
                onChange={e => update('address', e.target.value)}
                placeholder="Street, building, apartment..."
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">
                City / Governorate
              </label>
              <input
                required
                type="text"
                value={form.city}
                onChange={e => update('city', e.target.value)}
                placeholder="Cairo, Alexandria..."
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-muted font-semibold uppercase tracking-wider mb-1.5 block">
                Notes (optional)
              </label>
              <div className="relative">
                <FileText size={15} className="absolute left-3 top-3 text-muted" />
                <textarea
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder="Any special requests..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[380px]">
          <div className="bg-card border border-white/[0.06] rounded-2xl p-4 sm:p-5 lg:sticky lg:top-24">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Package size={16} className="text-accent" />
              Order Summary
            </h2>

            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {state.items.map(item => {
                const price = getItemPrice(item.product, item.copyType)
                const itemKey = `${item.product.id}|${item.selectedSize || ''}|${item.selectedColor || ''}|${item.copyType}`
                return (
                  <div key={itemKey} className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-black border border-white/[0.06]">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{item.product.name}</p>
                      <p className="text-muted text-[11px]">
                        {item.copyType === 'high-copy' ? 'High Copy' : item.copyType === 'master-box' ? 'Master Box' : 'Original'}
                        {item.selectedSize ? ` · ${item.selectedSize}` : ''}
                      </p>
                      <div className="flex justify-between mt-1">
                        <span className="text-muted text-[11px]">×{item.quantity}</span>
                        <span className="text-white text-xs font-bold">{(price * item.quantity).toLocaleString()} EGP</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-white/[0.06] pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-white font-semibold">{totalPrice.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-white font-semibold">Upon confirmation</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-white/[0.06]">
                <span className="text-white">Total</span>
                <span className="text-accent">{totalPrice.toLocaleString()} EGP</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 mt-4 bg-accent hover:bg-accent-hover text-bg font-bold rounded-2xl text-sm transition-colors min-h-[52px]"
            >
              Place Order
            </motion.button>

            <p className="text-[11px] text-muted text-center mt-3">
              We'll call you to confirm shipping & payment details
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
