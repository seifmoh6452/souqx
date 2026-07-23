import emailjs from '@emailjs/browser'

// ============================================
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com (free signup)
// 2. Add an Email Service (Gmail, Outlook, etc.)
// 3. Create an Email Template with these variables:
//    {{customer_name}}, {{customer_phone}}, {{address}}, {{city}},
//    {{items}}, {{total}}, {{order_id}}, {{date}}, {{notes}}
// 4. Paste your 3 keys below
// ============================================

const SERVICE_ID = 'YOUR_SERVICE_ID'    // e.g. 'service_xyz123'
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // e.g. 'template_abc456'
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'    // e.g. 'abc123XYZ'

export function initEmailJS() {
  if (PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(PUBLIC_KEY)
  }
}

interface EmailOrder {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  notes: string
  items: { name: string; brandName: string; size?: string; price: number; quantity: number }[]
  total: number
  date: string
}

export async function sendOrderEmail(order: EmailOrder): Promise<boolean> {
  if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
    console.log('EmailJS not configured yet — skipping order email.')
    return false
  }

  const itemsList = order.items
    .map(item => {
      const size = item.size ? ` [${item.size}]` : ''
      return `${item.brandName} - ${item.name}${size} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} EGP`
    })
    .join('\n')

  const date = new Date(order.date).toLocaleDateString('en-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: order.customerEmail,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      address: order.address,
      city: order.city,
      items: itemsList,
      total: `${order.total.toLocaleString()} EGP`,
      order_id: order.id.slice(-8).toUpperCase(),
      date,
      notes: order.notes || 'None',
    })
    return true
  } catch (err) {
    console.error('Failed to send order email:', err)
    return false
  }
}
