'use client'

import { PrintButton } from './PrintButton'
import { ExportButton } from './ExportButton'
import { ShareButton } from './ShareButton'

interface ActionBarProps {
  title: string
  description?: string
  exportData?: any[]
  exportFilename?: string
  exportType?: 'scholarships' | 'resources' | 'tribes'
  showPrint?: boolean
  showExport?: boolean
  showShare?: boolean
  className?: string
}

export function ActionBar({
  title,
  description,
  exportData = [],
  exportFilename = 'export',
  exportType = 'resources',
  showPrint = true,
  showExport = true,
  showShare = true,
  className = ''
}: ActionBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {showPrint && <PrintButton />}

      {showExport && exportData.length > 0 && (
        <ExportButton
          data={exportData}
          filename={exportFilename}
          type={exportType}
        />
      )}

      {showShare && (
        <ShareButton
          url={typeof window !== 'undefined' ? window.location.pathname : ''}
          title={title}
          description={description}
        />
      )}
    </div>
  )
}
