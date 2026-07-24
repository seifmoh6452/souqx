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
  wantsneeds:  { src: '/logos/wantsneeds.jpeg', bg: 'blue'  },
  cleanfits:   { src: '/logos/cleanfits.jpeg',  bg: 'dark'  },
}

export default function BrandLogo({ slug, className = '', size = 40 }: Props) {
  const brand = logoMap[slug]

  if (!brand) {
    return (
      <div
        className={className}
        style={{
          width: size, height: size,
          borderRadius: 8, background: '#121212',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 900, fontSize: size * 0.25,
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
        borderRadius: 8,
        background: brand.bg === 'light' ? '#fff' : brand.bg === 'blue' ? '#071428' : '#000',
        mixBlendMode: brand.bg === 'light' ? 'screen' : 'normal',
      }}
    />
  )
}
