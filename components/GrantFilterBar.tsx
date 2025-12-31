'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface GrantFilterBarProps {
  totalCount?: number
}

const GRANT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'State' },
  { value: 'tribal', label: 'Tribal' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'corporate', label: 'Corporate' },
]

const GRANT_TAGS = [
  'housing',
  'education',
  'healthcare',
  'economic development',
  'infrastructure',
  'agriculture',
  'energy',
  'environment',
  'cultural preservation',
  'language revitalization',
  'youth programs',
  'elder services',
  'tribal governance',
  'social services',
  'workforce development',
  'small business',
  'emergency assistance',
  'transportation',
  'technology',
  'water resources',
]

const AMOUNT_RANGES = [
  { value: '', label: 'Any Amount' },
  { value: '0-50000', label: 'Under $50,000' },
  { value: '50000-250000', label: '$50,000 - $250,000' },
  { value: '250000-1000000', label: '$250,000 - $1,000,000' },
  { value: '1000000-999999999', label: '$1,000,000+' },
]

const DEADLINE_RANGES = [
  { value: '', label: 'All Deadlines' },
  { value: 'next-30', label: 'Next 30 Days' },
  { value: 'next-60', label: 'Next 60 Days' },
  { value: 'next-90', label: 'Next 90 Days' },
  { value: 'rolling', label: 'Rolling/Open' },
]

export function GrantFilterBar({ totalCount }: GrantFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedAmountRange, setSelectedAmountRange] = useState(searchParams.get('amount') || '')
  const [selectedDeadlineRange, setSelectedDeadlineRange] = useState(searchParams.get('deadline') || '')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'deadline-asc')
  const [showTagsDropdown, setShowTagsDropdown] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

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

    // Reset to page 1 when filters change
    params.delete('page')

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

    // Reset to page 1
    params.delete('page')

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(window.location.pathname)
    setSelectedTags([])
    setSelectedType('')
    setSelectedAmountRange('')
    setSelectedDeadlineRange('')
    setSelectedSort('deadline-asc')
  }

  const hasFilters = selectedTags.length > 0 || selectedType || selectedAmountRange || selectedDeadlineRange

  return (
    <div className="bg-white rounded-earth-lg shadow-soft border border-desert/20 p-4 sm:p-6 mb-6">
      {/* Header with results count */}
      {totalCount !== undefined && (
        <div className="mb-4 pb-4 border-b border-desert/40">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text">
              {totalCount} Grant{totalCount !== 1 ? 's' : ''} Found
            </h3>
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm text-pine hover:text-pine-dark transition-colors flex items-center gap-2 font-medium"
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
              <svg
                className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Grant Type */}
        <div className="flex-1 w-full lg:w-auto">
          <label
            htmlFor="type-filter"
            className="block text-sm font-semibold text-text mb-2"
          >
            Grant Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value)
              handleFilterChange('type', e.target.value)
            }}
            className="w-full px-4 py-2 border border-stone/40 rounded-earth focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine bg-white text-text font-medium"
            aria-label="Filter by grant type"
          >
            {GRANT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories/Tags */}
        <div className="flex-1 w-full lg:w-auto relative">
          <label className="block text-sm font-semibold text-text mb-2">
            Categories {selectedTags.length > 0 && `(${selectedTags.length})`}
          </label>
          <button
            type="button"
            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
            className="w-full px-4 py-2 border border-stone/40 rounded-earth focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine text-left flex items-center justify-between bg-white"
            aria-label="Filter by categories"
          >
            <span className={selectedTags.length === 0 ? 'text-stone-light truncate' : 'text-text font-medium truncate'}>
              {selectedTags.length === 0
                ? 'Select categories...'
                : selectedTags.slice(0, 3).join(', ') + (selectedTags.length > 3 ? '...' : '')}
            </span>
            <svg
              className={`w-5 h-5 text-text-secondary transition-transform flex-shrink-0 ml-2 ${
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
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowTagsDropdown(false)}
              />
              <div className="absolute z-20 mt-1 w-full bg-white border border-stone/40 rounded-earth shadow-soft max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {GRANT_TAGS.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center px-3 py-2 hover:bg-desert/30 rounded-earth cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="mr-3 h-4 w-4 text-pine border-stone/40 rounded focus:ring-pine/30"
                      />
                      <span className="text-text font-medium capitalize">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sort By */}
        <div className="flex-1 w-full lg:w-auto">
          <label
            htmlFor="sort-filter"
            className="block text-sm font-semibold text-text mb-2"
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
            className="w-full px-4 py-2 border border-stone/40 rounded-earth focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine bg-white text-text font-medium"
            aria-label="Sort results"
          >
            <option value="deadline-asc">Deadline (Soonest)</option>
            <option value="amount-desc">Amount (Highest)</option>
            <option value="amount-asc">Amount (Lowest)</option>
            <option value="newest">Recently Added</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-pine hover:text-pine-dark font-medium transition-colors whitespace-nowrap"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-desert/40">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Amount Range */}
            <div className="flex-1">
              <label
                htmlFor="amount-filter"
                className="block text-sm font-semibold text-text mb-2"
              >
                Award Amount
              </label>
              <select
                id="amount-filter"
                value={selectedAmountRange}
                onChange={(e) => {
                  setSelectedAmountRange(e.target.value)
                  handleFilterChange('amount', e.target.value)
                }}
                className="w-full px-4 py-2 border border-stone/40 rounded-earth focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine bg-white text-text font-medium"
                aria-label="Filter by award amount"
              >
                {AMOUNT_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline Range */}
            <div className="flex-1">
              <label
                htmlFor="deadline-filter"
                className="block text-sm font-semibold text-text mb-2"
              >
                Deadline
              </label>
              <select
                id="deadline-filter"
                value={selectedDeadlineRange}
                onChange={(e) => {
                  setSelectedDeadlineRange(e.target.value)
                  handleFilterChange('deadline', e.target.value)
                }}
                className="w-full px-4 py-2 border border-stone/40 rounded-earth focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine bg-white text-text font-medium"
                aria-label="Filter by deadline"
              >
                {DEADLINE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasFilters && (
            <div className="mt-4">
              <div className="text-sm text-text-secondary mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {selectedType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pine/10 text-pine-dark border border-pine/30 rounded-full text-sm font-medium">
                    {GRANT_TYPES.find(t => t.value === selectedType)?.label}
                    <button
                      onClick={() => {
                        setSelectedType('')
                        handleFilterChange('type', '')
                      }}
                      className="hover:bg-pine/20 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedAmountRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold-dark border border-gold/30 rounded-full text-sm font-medium">
                    {AMOUNT_RANGES.find(r => r.value === selectedAmountRange)?.label}
                    <button
                      onClick={() => {
                        setSelectedAmountRange('')
                        handleFilterChange('amount', '')
                      }}
                      className="hover:bg-gold/20 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedDeadlineRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-clay/10 text-clay-dark border border-clay/30 rounded-full text-sm font-medium">
                    {DEADLINE_RANGES.find(r => r.value === selectedDeadlineRange)?.label}
                    <button
                      onClick={() => {
                        setSelectedDeadlineRange('')
                        handleFilterChange('deadline', '')
                      }}
                      className="hover:bg-clay/20 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-desert/20 text-text border border-desert/40 rounded-full text-sm font-medium capitalize">
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="hover:bg-desert/30 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
