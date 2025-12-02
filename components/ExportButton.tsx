'use client'

import { useState } from 'react'

interface ExportButtonProps {
  data: any[]
  filename: string
  type: 'scholarships' | 'resources' | 'tribes'
  variant?: 'primary' | 'secondary'
  className?: string
}

export function ExportButton({
  data,
  filename,
  type,
  variant = 'secondary',
  className = ''
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)

    try {
      let headers: string[] = []
      let rows: string[][] = []

      if (type === 'scholarships') {
        headers = ['Name', 'Amount', 'Deadline', 'Description', 'Eligibility', 'Tags', 'URL', 'Source']
        rows = data.map(item => [
          item.name || '',
          item.amount || '',
          item.deadline ? new Date(item.deadline).toLocaleDateString() : 'Rolling',
          item.description || '',
          Array.isArray(item.eligibility) ? item.eligibility.join('; ') : '',
          Array.isArray(item.tags) ? item.tags.join(', ') : '',
          item.url || '',
          item.source || ''
        ])
      } else if (type === 'resources') {
        headers = ['Title', 'Type', 'Description', 'State', 'Eligibility', 'Tags', 'URL', 'Source']
        rows = data.map(item => [
          item.title || '',
          item.type || '',
          item.description || '',
          item.state || 'National',
          Array.isArray(item.eligibility) ? item.eligibility.join('; ') : '',
          Array.isArray(item.tags) ? item.tags.join(', ') : '',
          item.url || '',
          item.source || ''
        ])
      } else if (type === 'tribes') {
        headers = ['Name', 'Recognition Status', 'Region', 'Website', 'Enrollment Office']
        rows = data.map(item => [
          item.name || '',
          item.federalRecognitionStatus || '',
          item.region || '',
          item.website || '',
          item.enrollmentOffice || ''
        ])
      }

      // Escape CSV fields
      const escapeCSV = (field: string) => {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      // Build CSV content
      const csvContent = [
        headers.map(escapeCSV).join(','),
        ...rows.map(row => row.map(escapeCSV).join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-earth font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = variant === 'primary'
    ? 'bg-clay dark:bg-gold text-white hover:bg-clay/90 dark:hover:bg-gold/90 focus:ring-clay dark:focus:ring-gold'
    : 'bg-white dark:bg-gray-800 text-midnight dark:text-cream border border-earth-sand dark:border-white/30 hover:bg-desert/10 dark:hover:bg-white/10 focus:ring-clay dark:focus:ring-gold'

  return (
    <button
      onClick={exportToCSV}
      disabled={isExporting || data.length === 0}
      className={`${baseClasses} ${variantClasses} ${className} print:hidden`}
      aria-label="Export data to CSV"
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
    </button>
  )
}
