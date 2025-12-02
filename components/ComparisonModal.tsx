'use client'

import { useComparison } from './ComparisonContext'
import Link from 'next/link'

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const { scholarships, removeScholarship } = useComparison()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-earth-lg max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-soft-lg">
        {/* Header */}
        <div className="bg-clay text-cream p-6 flex items-center justify-between border-b-2 border-gold">
          <h2 className="text-2xl font-heading font-bold">Scholarship Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream/10 rounded-earth transition-colors"
            aria-label="Close comparison"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(90vh-88px)]">
          {scholarships.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-midnight/70 text-lg">No scholarships selected for comparison</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-clay text-cream rounded-earth hover:bg-clay/90 transition-colors"
              >
                Browse Scholarships
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-desert/20">
                  <th className="sticky left-0 bg-desert/20 p-4 text-left font-heading font-semibold text-midnight border-b-2 border-desert/30">
                    Feature
                  </th>
                  {scholarships.map(scholarship => (
                    <th key={scholarship.id} className="p-4 text-left min-w-[280px] border-b-2 border-desert/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <Link
                            href={`/scholarships/${scholarship.id}`}
                            className="font-heading font-bold text-clay hover:text-clay/80 transition-colors line-clamp-2"
                            onClick={onClose}
                          >
                            {scholarship.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeScholarship(scholarship.id)}
                          className="p-1 hover:bg-desert/30 rounded-earth transition-colors flex-shrink-0"
                          aria-label={`Remove ${scholarship.name}`}
                          title="Remove from comparison"
                        >
                          <svg className="w-4 h-4 text-midnight/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Organization */}
                <tr className="border-b border-desert/20">
                  <td className="sticky left-0 bg-cream p-4 font-medium text-midnight">Organization</td>
                  {scholarships.map(scholarship => (
                    <td key={scholarship.id} className="p-4 text-midnight/80">
                      {scholarship.organization}
                    </td>
                  ))}
                </tr>

                {/* Amount */}
                <tr className="bg-desert/10 border-b border-desert/20">
                  <td className="sticky left-0 bg-desert/10 p-4 font-medium text-midnight">Amount</td>
                  {scholarships.map(scholarship => (
                    <td key={scholarship.id} className="p-4">
                      <span className="text-lg font-semibold text-clay">{scholarship.amount}</span>
                    </td>
                  ))}
                </tr>

                {/* Deadline */}
                <tr className="border-b border-desert/20">
                  <td className="sticky left-0 bg-cream p-4 font-medium text-midnight">Deadline</td>
                  {scholarships.map(scholarship => (
                    <td key={scholarship.id} className="p-4 text-midnight/80">
                      {scholarship.deadline ? (
                        new Date(scholarship.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      ) : (
                        <span className="text-midnight/50 italic">No deadline specified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* State */}
                <tr className="bg-desert/10 border-b border-desert/20">
                  <td className="sticky left-0 bg-desert/10 p-4 font-medium text-midnight">State</td>
                  {scholarships.map(scholarship => (
                    <td key={scholarship.id} className="p-4 text-midnight/80">
                      {scholarship.state || (
                        <span className="text-midnight/50 italic">National</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr className="border-b border-desert/20">
                  <td className="sticky left-0 bg-cream p-4 font-medium text-midnight align-top">Description</td>
                  {scholarships.map(scholarship => (
                    <td key={scholarship.id} className="p-4 text-sm text-midnight/80">
                      {scholarship.description}
                    </td>
                  ))}
                </tr>

                {/* Eligibility */}
                <tr className="bg-desert/10">
                  <td className="sticky left-0 bg-desert/10 p-4 font-medium text-midnight align-top">Eligibility</td>
                  {scholarships.map(scholarship => (
                    <td key={scholarship.id} className="p-4">
                      {scholarship.eligibility.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                          {scholarship.eligibility.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-earth-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-midnight/80">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-midnight/50 italic text-sm">No eligibility criteria listed</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="bg-desert/20 p-4 border-t border-desert/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-clay text-cream rounded-earth hover:bg-clay/90 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
