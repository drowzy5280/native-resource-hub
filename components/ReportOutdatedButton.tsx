'use client'

import { useState } from 'react'
import { useToast } from './Toast'

interface ReportOutdatedButtonProps {
  resourceId: string
  resourceTitle: string
  compact?: boolean
}

export function ReportOutdatedButton({ resourceId, resourceTitle, compact = false }: ReportOutdatedButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/resources/report-outdated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          resourceTitle,
          reason,
        }),
      })

      if (response.ok) {
        addToast('Thank you! We\'ll review this resource soon.', 'success')
        setIsOpen(false)
        setReason('')
      } else {
        addToast('Failed to submit report. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Failed to report outdated resource:', error)
      addToast('Failed to submit report. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 ${
          compact
            ? 'text-xs px-3 py-1.5'
            : 'text-sm px-4 py-2'
        } text-gray-600 hover:text-clay border border-gray-300 hover:border-clay rounded-earth transition-colors`}
      >
        <svg className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        Report Issue
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-earth-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
          Report Outdated Information
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Help us keep this resource up to date. What's wrong with this information?
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Link is broken, phone number is disconnected, program no longer available..."
            className="w-full px-4 py-3 border border-gray-300 rounded-earth focus:outline-none focus:ring-2 focus:ring-clay min-h-[100px] text-sm"
            required
          />

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setReason('')
              }}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-earth hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-clay text-white rounded-earth hover:bg-clay-dark transition-colors disabled:opacity-50"
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
