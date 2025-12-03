interface TagProps {
  label: string
  variant?: 'default' | 'pine' | 'clay' | 'gold'
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const colors = {
    default: 'bg-desert/40 text-text border border-desert/60',
    pine: 'bg-pine/15 text-pine-dark border border-pine/30',
    clay: 'bg-clay/15 text-clay-dark border border-clay/30',
    gold: 'bg-gold/20 text-gold-dark border border-gold/40',
  }

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-earth ${colors[variant]}`}
      role="text"
      aria-label={`Tag: ${label}`}
    >
      {label}
    </span>
  )
}
