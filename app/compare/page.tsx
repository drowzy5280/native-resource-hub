'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface CompareItem {
  id: string
  type: 'resource' | 'scholarship'
  title: string
  description: string
  url: string
  deadline?: Date | null
  amount?: string | null
  resourceType?: string
  eligibility?: string | null
  tags?: string[]
  state?: string | null
  tribe?: { name: string } | null
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<CompareItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const ids = searchParams.get('ids')?.split(',') || []
      const type = searchParams.get('type') as 'resource' | 'scholarship' || 'resource'

      if (ids.length === 0) {
        setLoading(false)
        return
      }

      try {
        const fetchedItems = await Promise.all(
          ids.map(async (id) => {
            const endpoint = type === 'scholarship' ? '/api/scholarships' : '/api/resources'
            const response = await fetch(`${endpoint}/${id}`)
            if (response.ok) {
              return response.json()
            }
            return null
          })
        )

        setItems(fetchedItems.filter(Boolean))
      } catch (error) {
        console.error('Failed to fetch items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [searchParams])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-teal" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-earth-brown/40 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-earth-brown mb-2">
            No Items to Compare
          </h3>
          <p className="text-earth-brown/60 mb-6">
            Add items to compare by clicking the "Compare" button on resource or scholarship cards.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/resources"
              className="px-6 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors"
            >
              Browse Resources
            </Link>
            <Link
              href="/scholarships"
              className="px-6 py-2 bg-earth-sage text-white rounded-earth hover:bg-earth-sage/90 transition-colors"
            >
              Browse Scholarships
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const type = items[0].type

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-earth-brown">
          Compare {type === 'scholarship' ? 'Scholarships' : 'Resources'}
        </h1>
        <p className="mt-2 text-earth-brown/70">
          Side-by-side comparison of {items.length} {type === 'scholarship' ? 'scholarships' : 'resources'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-earth-sand/20">
              <th className="p-4 text-left font-semibold text-earth-brown border-r border-earth-sand/30">
                Criteria
              </th>
              {items.map((item) => (
                <th
                  key={item.id}
                  className="p-4 text-left font-semibold text-earth-brown border-r border-earth-sand/30 min-w-[250px]"
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Description */}
            <tr className="border-b border-earth-sand/30">
              <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                Description
              </td>
              {items.map((item) => (
                <td key={item.id} className="p-4 border-r border-earth-sand/30">
                  {item.description}
                </td>
              ))}
            </tr>

            {/* Type/Category */}
            {type === 'resource' && (
              <tr className="border-b border-earth-sand/30">
                <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                  Type
                </td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 border-r border-earth-sand/30">
                    <span className="px-2 py-1 text-xs font-medium bg-earth-teal/10 text-earth-teal rounded-earth">
                      {item.resourceType}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Amount (for scholarships) */}
            {type === 'scholarship' && (
              <tr className="border-b border-earth-sand/30">
                <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                  Award Amount
                </td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 border-r border-earth-sand/30">
                    <span className="text-lg font-semibold text-earth-sage">
                      {item.amount || 'Amount varies'}
                    </span>
                  </td>
                ))}
              </tr>
            )}

            {/* Deadline (for scholarships) */}
            {type === 'scholarship' && (
              <tr className="border-b border-earth-sand/30">
                <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                  Deadline
                </td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 border-r border-earth-sand/30">
                    {item.deadline ? (
                      <span>
                        {new Date(item.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-earth-brown/60">Rolling deadline</span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Eligibility */}
            {type === 'scholarship' && (
              <tr className="border-b border-earth-sand/30">
                <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                  Eligibility
                </td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 border-r border-earth-sand/30">
                    {item.eligibility || 'See website for details'}
                  </td>
                ))}
              </tr>
            )}

            {/* State (for resources) */}
            {type === 'resource' && (
              <tr className="border-b border-earth-sand/30">
                <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                  State
                </td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 border-r border-earth-sand/30">
                    {item.state || 'All states'}
                  </td>
                ))}
              </tr>
            )}

            {/* Tribe (for resources) */}
            {type === 'resource' && (
              <tr className="border-b border-earth-sand/30">
                <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                  Tribe
                </td>
                {items.map((item) => (
                  <td key={item.id} className="p-4 border-r border-earth-sand/30">
                    {item.tribe?.name || 'All tribes'}
                  </td>
                ))}
              </tr>
            )}

            {/* Tags */}
            <tr className="border-b border-earth-sand/30">
              <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                Tags
              </td>
              {items.map((item) => (
                <td key={item.id} className="p-4 border-r border-earth-sand/30">
                  <div className="flex flex-wrap gap-2">
                    {item.tags && item.tags.length > 0 ? (
                      item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-earth-sand/30 text-earth-brown rounded-earth"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-earth-brown/60">No tags</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="p-4 font-medium text-earth-brown bg-earth-sand/10 border-r border-earth-sand/30">
                Actions
              </td>
              {items.map((item) => (
                <td key={item.id} className="p-4 border-r border-earth-sand/30">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/${type === 'scholarship' ? 'scholarships' : 'resources'}/${item.id}`}
                      className="px-4 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border-2 border-earth-teal text-earth-teal rounded-earth hover:bg-earth-teal/10 transition-colors text-center"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/${type === 'scholarship' ? 'scholarships' : 'resources'}`}
          className="text-earth-teal hover:text-earth-teal/80 font-medium"
        >
          ← Back to {type === 'scholarship' ? 'scholarships' : 'resources'}
        </Link>
      </div>
    </div>
  )
}
