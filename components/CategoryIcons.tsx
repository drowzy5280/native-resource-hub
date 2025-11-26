export function EducationIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8L4 18L24 28L44 18L24 8Z" fill="currentColor" opacity="0.2" />
      <path d="M24 8L4 18L24 28L44 18L24 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18V28L24 38L44 28V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 22V32L24 37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HealthIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.2" />
      <path d="M24 12V36M12 24H36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function HousingIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 20L24 6L42 20V40C42 41.1046 41.1046 42 40 42H8C6.89543 42 6 41.1046 6 40V20Z" fill="currentColor" opacity="0.2" />
      <path d="M6 20L24 6L42 20V40C42 41.1046 41.1046 42 40 42H8C6.89543 42 6 41.1046 6 40V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="18" y="28" width="12" height="14" fill="currentColor" opacity="0.3" />
      <path d="M18 28H30V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EmergencyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M24 14V24L30 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  )
}

export function YouthIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="6" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M12 40C12 32 17 28 24 28C31 28 36 32 36 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 28V35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 32L28 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function EldersIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="6" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M12 40C12 32 17 28 24 28C31 28 36 32 36 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Walking stick */}
      <path d="M30 28L32 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="26" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function BusinessIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="32" height="26" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="8" y="14" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 14V10C16 8.89543 16.8954 8 18 8H30C31.1046 8 32 8.89543 32 10V14" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="27" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M24 30V34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function LanguageIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.2" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
      <path d="M24 6C24 6 16 12 16 24C16 36 24 42 24 42" stroke="currentColor" strokeWidth="2" />
      <path d="M24 6C24 6 32 12 32 24C32 36 24 42 24 42" stroke="currentColor" strokeWidth="2" />
      <path d="M8 24H40" stroke="currentColor" strokeWidth="2" />
      <path d="M10 15H38" stroke="currentColor" strokeWidth="2" />
      <path d="M10 33H38" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
