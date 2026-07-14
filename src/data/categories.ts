export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  comingSoon?: boolean
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Original luxury fragrances from the world\'s top houses',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=85&fit=crop',
    productCount: 7,
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Premium streetwear built for comfort and style',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&fit=crop',
    productCount: 6,
  },
  {
    id: '3',
    name: 'Eyewear',
    slug: 'eyewear',
    description: 'UV-protected premium sunglasses for every style',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=85&fit=crop',
    productCount: 2,
  },
  {
    id: '4',
    name: 'Watches',
    slug: 'watches',
    description: 'Affordable luxury timepieces with elegant designs',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85&fit=crop',
    productCount: 2,
  },
  {
    id: '5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'The finishing touches that complete your look',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85&fit=crop',
    productCount: 0,
    comingSoon: true,
  },
]
