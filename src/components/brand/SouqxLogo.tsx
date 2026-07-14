interface Props {
  className?: string
  height?: number
}

export default function SouqxLogo({ className = '', height = 36 }: Props) {
  return (
    <img
      src="/logos/souqx.jpeg"
      alt="SOUQX"
      className={className}
      style={{ height, width: 'auto', objectFit: 'contain' }}
    />
  )
}
