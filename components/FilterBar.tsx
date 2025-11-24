'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface FilterBarProps {
  showTypeFilter?: boolean
  showStateFilter?: boolean
  showTagsFilter?: boolean
}

export function FilterBar({
  showTypeFilter = true,
  showStateFilter = true,
  showTagsFilter = true,
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '')

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(window.location.pathname)
    setSelectedType('')
    setSelectedState('')
  }

  const hasFilters = selectedType || selectedState

  return (
    <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        {showTypeFilter && (
          <div className="flex-1">
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Resource Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                handleFilterChange('type', e.target.value)
              }}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
              aria-label="Filter by resource type"
            >
              <option value="">All Types</option>
              <option value="federal">Federal</option>
              <option value="state">State</option>
              <option value="tribal">Tribal</option>
              <option value="emergency">Emergency</option>
              <option value="scholarship">Scholarship</option>
            </select>
          </div>
        )}

        {showStateFilter && (
          <div className="flex-1">
            <label
              htmlFor="state-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              State
            </label>
            <input
              type="text"
              id="state-filter"
              placeholder="e.g., AZ, CA, NM"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                handleFilterChange('state', e.target.value)
              }}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
              aria-label="Filter by state"
            />
          </div>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-earth-rust hover:text-earth-rust/80 font-medium transition-colors"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}
