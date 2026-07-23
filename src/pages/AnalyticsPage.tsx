import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, DollarSign, TrendingUp, Users, Package, Calendar, FileText, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getOrders, updateOrderStatus, sendWhatsAppMessage, getStatusMessage, type Order } from '../lib/orders'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const handleStatusUpdate = async (order: Order, newStatus: string) => {
    setUpdatingStatus(order.id)
    try {
      await updateOrderStatus(order.id, newStatus)
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o))
      const msg = getStatusMessage(newStatus, order.customerName, order.id)
      sendWhatsAppMessage(order.customerPhone, msg)
    } catch {
    } finally {
      setUpdatingStatus(null)
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

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

  const generateInvoice = (order: Order) => {
    const date = new Date(order.date).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${order.id}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;color:#222;background:#fff}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #00dc82;padding-bottom:20px;margin-bottom:24px}
  .logo{font-size:28px;font-weight:900;color:#0a0a0a;letter-spacing:-1px}
  .logo span{color:#00dc82}
  .badge{background:#00dc82;color:#fff;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
  .meta-box{background:#f8f8f8;padding:16px;border-radius:10px}
  .meta-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#888;font-weight:700;margin-bottom:6px}
  .meta-value{font-size:14px;font-weight:600;color:#111}
  .items-table{width:100%;border-collapse:collapse;margin-bottom:24px}
  .items-table th{text-align:left;padding:10px 12px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;border-bottom:2px solid #eee;font-weight:700}
  .items-table td{padding:10px 12px;font-size:13px;border-bottom:1px solid #f0f0f0}
  .items-table tr:last-child td{border-bottom:none}
  .total-row{display:flex;justify-content:flex-end;padding:16px 0;border-top:2px solid #0a0a0a}
  .total-label{font-size:14px;font-weight:700;margin-right:12px}
  .total-value{font-size:20px;font-weight:900;color:#00dc82}
  .footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#aaa}
  @media print{body{padding:20px}}
</style></head><body>
<div class="header">
  <div><div class="logo">SOUQ<span>X</span></div><p style="font-size:12px;color:#888;margin-top:4px">Egyptian Marketplace</p></div>
  <div style="text-align:right"><div class="badge">Shipping Invoice</div><p style="font-size:12px;color:#888;margin-top:8px">Order #${order.id.slice(-8).toUpperCase()}</p><p style="font-size:12px;color:#888">${date}</p></div>
</div>
<div class="meta">
  <div class="meta-box"><div class="meta-label">Customer</div><div class="meta-value">${order.customerName}</div><div style="font-size:12px;color:#666;margin-top:4px">${order.customerPhone}</div></div>
  <div class="meta-box"><div class="meta-label">Delivery Address</div><div class="meta-value">${order.address}, ${order.city}</div></div>
</div>
<table class="items-table">
  <thead><tr><th>Item</th><th>Brand</th><th>Size</th><th>Qty</th><th style="text-align:right">Price</th></tr></thead>
  <tbody>${order.items.map(item => `<tr><td>${item.name}</td><td>${item.brandName}</td><td>${item.size || '-'}</td><td>${item.quantity}</td><td style="text-align:right">${(item.price * item.quantity).toLocaleString()} EGP</td></tr>`).join('')}</tbody>
</table>
<div class="total-row"><span class="total-label">TOTAL</span><span class="total-value">${order.total.toLocaleString()} EGP</span></div>
${order.notes ? `<div style="background:#fffbe6;border:1px solid #ffe58f;border-radius:8px;padding:12px;margin-top:16px"><p style="font-size:12px;color:#888;font-weight:700;margin-bottom:4px">NOTES</p><p style="font-size:13px;color:#444">${order.notes}</p></div>` : ''}
<div class="footer">SOUQX - Egyptian Marketplace &bull; Generated ${new Date().toLocaleString('en-EG')}</div>
<script>window.onload=function(){window.print()}</script></body></html>`
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

  const generateReceipt = (order: Order) => {
    const date = new Date(order.date).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt ${order.id}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;color:#222;background:#fff;max-width:480px;margin:0 auto}
  .header{text-align:center;border-bottom:2px dashed #ccc;padding-bottom:16px;margin-bottom:20px}
  .logo{font-size:26px;font-weight:900;color:#0a0a0a;letter-spacing:-1px}
  .logo span{color:#00dc82}
  .subtitle{font-size:11px;color:#999;margin-top:4px;text-transform:uppercase;letter-spacing:2px}
  .info{text-align:center;margin-bottom:20px}
  .info p{font-size:12px;color:#666;margin:2px 0}
  .info strong{color:#111}
  .divider{border:none;border-top:1px dashed #ccc;margin:16px 0}
  .item{display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #f5f5f5}
  .item-name{flex:1;color:#333}
  .item-qty{color:#888;margin:0 12px;font-size:12px}
  .item-price{font-weight:700;color:#111;white-space:nowrap}
  .total{text-align:right;padding:16px 0;border-top:2px solid #0a0a0a;margin-top:8px}
  .total span{font-size:22px;font-weight:900;color:#00dc82}
  .footer{text-align:center;margin-top:24px;font-size:11px;color:#bbb}
  @media print{body{padding:20px}}
</style></head><body>
<div class="header">
  <div class="logo">SOUQ<span>X</span></div>
  <div class="subtitle">Customer Receipt</div>
</div>
<div class="info">
  <p><strong>${order.customerName}</strong></p>
  <p>${order.customerPhone}</p>
  <p>${order.address}, ${order.city}</p>
  <p style="margin-top:8px;color:#999">${date} &bull; #${order.id.slice(-8).toUpperCase()}</p>
</div>
<hr class="divider">
${order.items.map(item => `<div class="item"><span class="item-name">${item.brandName} - ${item.name}${item.size ? ` [${item.size}]` : ''}</span><span class="item-qty">x${item.quantity}</span><span class="item-price">${(item.price * item.quantity).toLocaleString()} EGP</span></div>`).join('')}
<div class="total"><span>${order.total.toLocaleString()} EGP</span></div>
${order.notes ? `<div style="background:#f9f9f9;border-radius:8px;padding:10px;margin-top:12px"><p style="font-size:11px;color:#999">Note: ${order.notes}</p></div>` : ''}
<div class="footer">Thank you for shopping with SOUQX!</div>
<script>window.onload=function(){window.print()}</script></body></html>`
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

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
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">{order.customerName}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status || 'pending'] || statusColors.pending}`}>
                          {(order.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-muted text-xs">{order.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent font-bold text-sm">{order.total.toLocaleString()} EGP</p>
                      <p className="text-muted text-[11px]">{new Date(order.date).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <p className="text-muted text-xs mb-2">{order.address}, {order.city}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {order.items.map((item, j) => (
                      <span key={j} className="text-[11px] bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-1 text-muted">
                        {item.brandName} - {item.name} ×{item.quantity}
                        {item.size ? ` [${item.size}]` : ''}
                      </span>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="text-muted text-[11px] mb-3 italic">Note: {order.notes}</p>
                  )}

                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(['pending', 'confirmed', 'shipped', 'delivered'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(order, status)}
                        disabled={order.status === status || updatingStatus === order.id}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all capitalize ${
                          order.status === status
                            ? `${statusColors[status]} ring-1 ring-white/10`
                            : 'bg-white/[0.02] text-muted border-white/[0.06] hover:border-white/15 hover:text-white'
                        } ${updatingStatus === order.id ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {updatingStatus === order.id && order.status !== status ? '...' : status}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => generateInvoice(order)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-muted hover:text-white hover:bg-white/[0.1] text-[11px] font-semibold transition-all"
                    >
                      <FileText size={12} />
                      Invoice
                    </button>
                    <button
                      onClick={() => generateReceipt(order)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-muted hover:text-white hover:bg-white/[0.1] text-[11px] font-semibold transition-all"
                    >
                      <Receipt size={12} />
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
