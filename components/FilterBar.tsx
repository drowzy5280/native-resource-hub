'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface FilterBarProps {
  showTypeFilter?: boolean
  showStateFilter?: boolean
  showTagsFilter?: boolean
  showSortFilter?: boolean
  sortOptions?: { value: string; label: string }[]
  availableTags?: string[]
}

const DEFAULT_TAGS = [
  'Advocacy',
  'Business',
  'Cultural Preservation',
  'Education',
  'Elders',
  'Emergency',
  'Employment',
  'Financial Assistance',
  'Health',
  'Housing',
  'Language',
  'Legal',
  'Mental Health',
  'Scholarships',
  'STEM',
  'Substance Abuse',
  'Veterans',
  'Youth',
]

export function FilterBar({
  showTypeFilter = true,
  showStateFilter = true,
  showTagsFilter = true,
  showSortFilter = false,
  sortOptions = [],
  availableTags = DEFAULT_TAGS,
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || '')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagsDropdown, setShowTagsDropdown] = useState(false)

  useEffect(() => {
    const tagsParam = searchParams.get('tags')
    if (tagsParam) {
      setSelectedTags(tagsParam.split(',').filter(Boolean))
    } else {
      setSelectedTags([])
    }
  }, [searchParams])

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`?${params.toString()}`)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(newTags)

    const params = new URLSearchParams(searchParams)
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(window.location.pathname)
    setSelectedType('')
    setSelectedState('')
    setSelectedSort('')
    setSelectedTags([])
  }

  const hasFilters = selectedType || selectedState || selectedSort || selectedTags.length > 0

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

        {showTagsFilter && availableTags.length > 0 && (
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-earth-brown mb-2">
              Categories {selectedTags.length > 0 && `(${selectedTags.length})`}
            </label>
            <button
              type="button"
              onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal text-left flex items-center justify-between bg-white"
              aria-label="Filter by categories"
            >
              <span className="text-earth-brown/70">
                {selectedTags.length === 0
                  ? 'Select categories...'
                  : selectedTags.join(', ')}
              </span>
              <svg
                className={`w-5 h-5 text-earth-brown/50 transition-transform ${
                  showTagsDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showTagsDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-earth-sand rounded-earth shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {availableTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center px-3 py-2 hover:bg-earth-cream rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="mr-3 h-4 w-4 text-earth-teal border-earth-sand rounded focus:ring-earth-teal"
                      />
                      <span className="text-earth-brown">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showSortFilter && sortOptions.length > 0 && (
          <div className="flex-1">
            <label
              htmlFor="sort-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Sort By
            </label>
            <select
              id="sort-filter"
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value)
                handleFilterChange('sort', e.target.value)
              }}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
              aria-label="Sort results"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
