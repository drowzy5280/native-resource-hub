interface TagProps {
  label: string
  variant?: 'default' | 'teal' | 'rust'
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const colors = {
    default: 'bg-earth-sand/40 text-earth-brown',
    teal: 'bg-earth-teal/10 text-earth-teal',
    rust: 'bg-earth-rust/10 text-earth-rust',
  }

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${colors[variant]}`}
      role="text"
      aria-label={`Tag: ${label}`}
    >
      {label}
    </span>
  )
}
