import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPromoCodes, addPromoCode, deletePromoCode } from '../lib/promos'
import type { PromoCode } from '../lib/promos'

export default function AdminPromosPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const data = await getPromoCodes()
    setCodes(data)
  }

  const handleAdd = async () => {
    if (!code.trim() || !discount) return
    setLoading(true)
    try {
      await addPromoCode(code.trim(), Number(discount), discountType)
      setCode('')
      setDiscount('')
      setDiscountType('fixed')
      setMsg(`Code "${code.trim().toUpperCase()}" added`)
      await load()
    } catch {
      setMsg('Failed to add code')
    }
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleDelete = async (c: string) => {
    await deletePromoCode(c)
    setMsg(`Code "${c}" deleted`)
    await load()
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4">
        <Link to="/admin">
          <motion.div whileHover={{ x: -4 }} className="flex items-center gap-2 text-muted hover:text-white text-sm font-semibold transition-colors mb-8">
            <ArrowLeft size={15} />
            Back to Admin
          </motion.div>
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Promo Codes</h1>
        <p className="text-muted text-sm mb-8">Create and manage discount codes.</p>

        <div className="bg-card border border-white/[0.06] rounded-2xl p-5 mb-8 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER50"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">Discount Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  discountType === 'fixed'
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-[#0f0f0f] text-muted border-white/[0.08] hover:border-white/20'
                }`}
              >
                Fixed (EGP)
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  discountType === 'percent'
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-[#0f0f0f] text-muted border-white/[0.08] hover:border-white/20'
                }`}
              >
                Percentage (%)
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-widest mb-2 block">{discountType === 'fixed' ? 'Discount (EGP)' : 'Discount (%)'}</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              placeholder={discountType === 'fixed' ? 'e.g. 200' : 'e.g. 10'}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder-muted focus:outline-none focus:border-accent/40"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={!code.trim() || !discount || loading}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              code.trim() && discount
                ? 'bg-accent hover:bg-accent-hover text-bg'
                : 'bg-white/[0.06] text-muted cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            {loading ? 'Adding...' : 'Add Promo Code'}
          </motion.button>
          {msg && <p className="text-xs text-accent font-semibold text-center">{msg}</p>}
        </div>

        <div className="space-y-2">
          {codes.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">No promo codes yet.</p>
          ) : (
            codes.map(c => (
              <div key={c.code} className="bg-card border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Tag size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{c.code}</p>
                    <p className="text-accent text-xs font-semibold">{c.type === 'percent' ? `${c.discount}% off` : `${c.discount} EGP off`}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(c.code)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
