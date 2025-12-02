'use client'

interface PrintButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export function PrintButton({ variant = 'secondary', className = '' }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-earth font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = variant === 'primary'
    ? 'bg-clay dark:bg-gold text-white hover:bg-clay/90 dark:hover:bg-gold/90 focus:ring-clay dark:focus:ring-gold'
    : 'bg-white dark:bg-gray-800 text-midnight dark:text-cream border border-earth-sand dark:border-white/30 hover:bg-desert/10 dark:hover:bg-white/10 focus:ring-clay dark:focus:ring-gold'

  return (
    <button
      onClick={handlePrint}
      className={`${baseClasses} ${variantClasses} ${className} print:hidden`}
      aria-label="Print this page"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      <span>Print</span>
    </button>
  )
}
