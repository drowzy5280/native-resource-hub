export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDeadline(deadline: Date | string): {
  formatted: string
  daysUntil: number
  isPast: boolean
} {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const today = new Date()
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    formatted: formatDate(deadlineDate),
    daysUntil: diffDays,
    isPast: diffDays < 0,
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function parseEligibility(eligibility: string[]): {
  requiresEnrollment: boolean
  stateRestrictions: string[]
  ageRestrictions: string | null
} {
  const requiresEnrollment = eligibility.some(e =>
    e.toLowerCase().includes('enrolled') ||
    e.toLowerCase().includes('tribal member')
  )

  const stateRestrictions = eligibility
    .filter(e => e.toLowerCase().includes('resident of'))
    .map(e => e.replace(/resident of /gi, '').trim())

  const ageRestriction = eligibility.find(e =>
    e.toLowerCase().includes('age') ||
    e.toLowerCase().includes('year')
  ) || null

  return {
    requiresEnrollment,
    stateRestrictions,
    ageRestrictions: ageRestriction,
  }
}
