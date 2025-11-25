interface TagProps {
  label: string
  variant?: 'default' | 'pine' | 'clay' | 'gold'
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const colors = {
    default: 'bg-desert/30 text-midnight border border-desert/50',
    pine: 'bg-pine/10 text-pine border border-pine/20',
    clay: 'bg-clay/10 text-clay border border-clay/20',
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
