import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function SectionHeader({ title, description, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-700">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-pine hover:text-pine-dark font-medium transition-colors"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  )
}
