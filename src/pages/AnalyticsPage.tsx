import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, DollarSign, TrendingUp, Users, Package, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getOrders, type Order } from '../lib/orders'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const thisMonth = orders.filter(o => {
    const d = new Date(o.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const lastMonth = orders.filter(o => {
    const d = new Date(o.date)
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
  })

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const thisMonthRevenue = thisMonth.reduce((s, o) => s + o.total, 0)
  const lastMonthRevenue = lastMonth.reduce((s, o) => s + o.total, 0)
  const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

  const productCounts: Record<string, { name: string; count: number; revenue: number }> = {}
  orders.forEach(o => {
    o.items.forEach(item => {
      const key = item.name
      if (!productCounts[key]) productCounts[key] = { name: item.name, count: 0, revenue: 0 }
      productCounts[key].count += item.quantity
      productCounts[key].revenue += item.price * item.quantity
    })
  })
  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const monthlyData: Record<string, { orders: number; revenue: number }> = {}
  orders.forEach(o => {
    const d = new Date(o.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!monthlyData[key]) monthlyData[key] = { orders: 0, revenue: 0 }
    monthlyData[key].orders++
    monthlyData[key].revenue += o.total
  })
  const sortedMonths = Object.entries(monthlyData).sort((a, b) => b[0].localeCompare(a[0]))
  const maxRevenue = Math.max(...sortedMonths.map(([, v]) => v.revenue), 1)

  const statCards = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-accent' },
    { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} EGP`, icon: DollarSign, color: 'text-green-400' },
    { label: 'This Month', value: `${thisMonthRevenue.toLocaleString()} EGP`, sub: `${thisMonth.length} orders`, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Last Month', value: `${lastMonthRevenue.toLocaleString()} EGP`, sub: `${lastMonth.length} orders`, icon: Calendar, color: 'text-purple-400' },
    { label: 'Avg Order Value', value: `${avgOrder.toLocaleString()} EGP`, icon: Package, color: 'text-amber-400' },
    { label: 'Unique Customers', value: new Set(orders.map(o => o.customerPhone)).size, icon: Users, color: 'text-pink-400' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Admin
        </button>

        <h1 className="text-display-lg font-black text-white tracking-tight mb-8">
          Order <span className="text-gradient-accent">Analytics</span>
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-white/[0.06] rounded-2xl p-4"
              >
                <Icon size={16} className={`${card.color} mb-2`} />
                <p className="text-white font-bold text-sm sm:text-base">{card.value}</p>
                <p className="text-muted text-[11px]">{card.label}</p>
                {card.sub && <p className="text-muted text-[10px] mt-0.5">{card.sub}</p>}
              </motion.div>
            )
          })}
        </div>

        {/* Monthly Revenue Chart */}
        {sortedMonths.length > 0 && (
          <div className="bg-card border border-white/[0.06] rounded-2xl p-4 sm:p-5 mb-8">
            <h2 className="text-sm font-bold text-white mb-4">Monthly Revenue</h2>
            <div className="space-y-3">
              {sortedMonths.map(([month, data]) => {
                const [y, m] = month.split('-')
                const label = new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short', year: 'numeric' })
                const pct = (data.revenue / maxRevenue) * 100
                return (
                  <div key={month}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{label}</span>
                      <span className="text-white font-semibold">{data.revenue.toLocaleString()} EGP ({data.orders})</span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          {topProducts.length > 0 && (
            <div className="bg-card border border-white/[0.06] rounded-2xl p-4 sm:p-5">
              <h2 className="text-sm font-bold text-white mb-4">Top Products</h2>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-muted text-xs font-bold w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-muted text-[11px]">{p.revenue.toLocaleString()} EGP</p>
                    </div>
                    <span className="text-accent text-xs font-bold">{p.count} sold</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data */}
          {orders.length === 0 && (
            <div className="bg-card border border-white/[0.06] rounded-2xl p-8 text-center lg:col-span-2">
              <ShoppingBag size={32} className="text-muted mx-auto mb-3" />
              <p className="text-white font-semibold">No orders yet</p>
              <p className="text-muted text-sm mt-1">Orders will appear here once customers start checking out.</p>
            </div>
          )}
        </div>

        {/* Order List */}
        {orders.length > 0 && (
          <div className="bg-card border border-white/[0.06] rounded-2xl p-4 sm:p-5">
            <h2 className="text-sm font-bold text-white mb-4">All Orders ({orders.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {[...orders].reverse().map(order => (
                <div key={order.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{order.customerName}</p>
                      <p className="text-muted text-xs">{order.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent font-bold text-sm">{order.total.toLocaleString()} EGP</p>
                      <p className="text-muted text-[11px]">{new Date(order.date).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <p className="text-muted text-xs mb-2">{order.address}, {order.city}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {order.items.map((item, j) => (
                      <span key={j} className="text-[11px] bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-1 text-muted">
                        {item.brandName} - {item.name} ×{item.quantity}
                        {item.size ? ` [${item.size}]` : ''}
                      </span>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="text-muted text-[11px] mt-2 italic">Note: {order.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
