export interface Brand {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  coverImage: string
  logo: string
  logoBg: 'dark' | 'light' | 'blue'
  accentColor: string
  category: string
  productCount: number
  featured: boolean
}

export const brands: Brand[] = [
  {
    id: '1',
    name: 'MYM',
    slug: 'mym',
    tagline: 'Premium Fragrances',
    description: 'MYM brings you the world\'s most iconic fragrances — original, authentic, and delivered to your door. From Dior Sauvage to Parfums de Marly Layton, every bottle is 100% genuine with luxury packaging and prices that make sense.',
    coverImage: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&q=85&fit=crop',
    logo: '/logos/mym.jpeg',
    logoBg: 'dark',
    accentColor: '#c9a84c',
    category: 'Perfumes',
    productCount: 82,
    featured: true,
  },
  {
    id: '2',
    name: 'MODESTA',
    slug: 'modesta',
    tagline: 'Premium Streetwear',
    description: 'MODESTA is minimal premium streetwear built for those who move with intention. Oversized fits, heavyweight fabrics, and a clean aesthetic that stays timeless. Comfort without compromise.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&fit=crop',
    logo: '/logos/modesta.jpeg',
    logoBg: 'light',
    accentColor: '#2e7d32',
    category: 'Fashion',
    productCount: 6,
    featured: true,
  },
  {
    id: '3',
    name: 'GLASSWEAR',
    slug: 'glasswear',
    tagline: 'Stay In Style',
    description: 'GLASSWEAR delivers premium sunglasses with UV400 protection, stylish frames, and modern designs built for the Egyptian sun. Whether you go classic or futuristic — your face, elevated.',
    coverImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1400&q=85&fit=crop',
    logo: '/logos/glasswear.jpeg',
    logoBg: 'light',
    accentColor: '#16C47F',
    category: 'Eyewear',
    productCount: 2,
    featured: true,
  },
  {
    id: '5',
    name: 'WATCH EYE',
    slug: 'watcheye',
    tagline: 'See The Future',
    description: 'WATCH EYE fuses tech-forward aesthetics with precision optics and luxury timepieces. Elegant designs, premium materials, and craftsmanship that punches way above its price. Bold eyewear and watches for those who see the world differently — before everyone else does.',
    coverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1400&q=85&fit=crop',
    logo: '/logos/watcheye.jpeg',
    logoBg: 'blue',
    accentColor: '#16C47F',
    category: 'Eyewear',
    productCount: 0,
    featured: true,
  },
  {
    id: '6',
    name: 'WANTS & NEEDS',
    slug: 'wantsneeds',
    tagline: 'Special For You',
    description: 'WANTS & NEEDS SPECIAL curates the essentials of modern life — from lifestyle accessories to must-have pieces that blur the line between a want and a need. Everything here, you\'ll love.',
    coverImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=85&fit=crop',
    logo: '/logos/wantsneeds.jpeg',
    logoBg: 'blue',
    accentColor: '#e91e8c',
    category: 'Accessories',
    productCount: 2,
    featured: true,
  },
]
