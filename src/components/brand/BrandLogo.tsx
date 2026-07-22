interface Props {
  slug: string
  className?: string
  size?: number
}

const logoMap: Record<string, { src: string; bg: 'dark' | 'light' | 'blue' }> = {
  mym:        { src: '/logos/mym.jpeg',        bg: 'dark'  },
  modesta:    { src: '/logos/modesta.jpeg',    bg: 'light' },
  glasswear:  { src: '/logos/glasswear.jpeg',  bg: 'light' },
  watcher:    { src: '/logos/watcheye.jpeg',   bg: 'blue'  },
  watcheye:   { src: '/logos/watcheye.jpeg',   bg: 'blue'  },
  wantsneeds: { src: '/logos/wantsneeds.jpeg', bg: 'blue'  },
  girlmath:   { src: '/logos/girlmath.jpeg',   bg: 'light' },
}

export default function BrandLogo({ slug, className = '', size = 40 }: Props) {
  const brand = logoMap[slug]

  if (!brand) {
    return (
      <div
        className={`bg-surface-2 text-ink ${className}`}
        style={{
          width: size, height: size,
          borderRadius: size * 0.2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: size * 0.25,
        }}
      >
        {slug.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={brand.src}
      alt={slug}
      className={className}
      style={{
        width: size, height: size,
        objectFit: 'contain',
        borderRadius: size * 0.2,
        background: brand.bg === 'light' ? '#ffffff' : brand.bg === 'blue' ? '#0a0a0a' : '#0a0a0a',
      }}
    />
  )
}
