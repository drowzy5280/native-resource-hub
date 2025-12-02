'use client'

import { useComparison, ComparisonScholarship } from './ComparisonContext'
import { useToast } from './Toast'

interface AddToCompareButtonProps {
  scholarship: ComparisonScholarship
  variant?: 'default' | 'compact'
}

export function AddToCompareButton({ scholarship, variant = 'default' }: AddToCompareButtonProps) {
  const { addScholarship, removeScholarship, isInComparison, scholarships, maxItems } = useComparison()
  const { showToast } = useToast()
  const inComparison = isInComparison(scholarship.id)
  const isAtMax = scholarships.length >= maxItems

  const handleClick = () => {
    if (inComparison) {
      removeScholarship(scholarship.id)
      showToast('Removed from comparison', 'info')
    } else {
      const success = addScholarship(scholarship)
      if (success) {
        showToast('Added to comparison', 'success')
      } else if (isAtMax) {
        showToast(`Maximum ${maxItems} scholarships allowed`, 'error')
      }
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-earth transition-colors ${
          inComparison
            ? 'bg-gold text-midnight'
            : 'bg-cream hover:bg-desert/30 text-midnight/70 hover:text-midnight'
        } ${!inComparison && isAtMax ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!inComparison && isAtMax}
        aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison'}
        title={
          inComparison
            ? 'Remove from comparison'
            : isAtMax
            ? `Maximum ${maxItems} scholarships allowed`
            : 'Add to comparison'
        }
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-earth font-medium transition-colors flex items-center gap-2 ${
        inComparison
          ? 'bg-gold text-midnight hover:bg-gold/90'
          : 'bg-cream border-2 border-desert/30 text-midnight hover:bg-desert/20'
      } ${!inComparison && isAtMax ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={!inComparison && isAtMax}
      title={
        inComparison
          ? 'Remove from comparison'
          : isAtMax
          ? `Maximum ${maxItems} scholarships allowed`
          : 'Add to comparison'
      }
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      {inComparison ? 'Remove from Compare' : 'Add to Compare'}
    </button>
  )
}
