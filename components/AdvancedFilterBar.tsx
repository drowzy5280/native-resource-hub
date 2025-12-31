'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  FilterOption,
  RESOURCE_TYPES,
  DIFFICULTIES,
  POPULAR_TAGS,
  AMOUNT_RANGES,
  US_STATES,
} from '@/lib/constants'

interface AdvancedFilterBarProps {
  showTypeFilter?: boolean
  showStateFilter?: boolean
  showTagFilter?: boolean
  showDifficultyFilter?: boolean
  showAmountFilter?: boolean // For scholarships
  showSortFilter?: boolean
  sortOptions?: FilterOption[]
}

export function AdvancedFilterBar({
  showTypeFilter,
  showStateFilter,
  showTagFilter,
  showDifficultyFilter,
  showAmountFilter,
  showSortFilter,
  sortOptions,
}: AdvancedFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(false)

  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')

  // Initialize from URL params
  useEffect(() => {
    const types = searchParams.get('type')?.split(',').filter(Boolean) || []
    const states = searchParams.get('state')?.split(',').filter(Boolean) || []
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const difficulty = searchParams.get('difficulty')?.split(',').filter(Boolean) || []
    const amount = searchParams.get('amount') || ''
    const sort = searchParams.get('sort') || ''

    setSelectedTypes(types)
    setSelectedStates(states)
    setSelectedTags(tags)
    setSelectedDifficulty(difficulty)
    setSelectedAmountRange(amount)
    setSortBy(sort)
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Clear old params
    params.delete('type')
    params.delete('state')
    params.delete('tags')
    params.delete('difficulty')
    params.delete('amount')
    params.delete('sort')

    // Add new params
    if (selectedTypes.length > 0) params.set('type', selectedTypes.join(','))
    if (selectedStates.length > 0) params.set('state', selectedStates.join(','))
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    if (selectedDifficulty.length > 0) params.set('difficulty', selectedDifficulty.join(','))
    if (selectedAmountRange) params.set('amount', selectedAmountRange)
    if (sortBy) params.set('sort', sortBy)

    // Reset to page 1
    params.set('page', '1')

    router.push(`?${params.toString()}`)
    setIsExpanded(false)
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedStates([])
    setSelectedTags([])
    setSelectedDifficulty([])
    setSelectedAmountRange('')
    setSortBy('')
    router.push('?page=1')
    setIsExpanded(false)
  }

  const toggleMultiSelect = (value: string, currentSelection: string[], setter: (val: string[]) => void) => {
    if (currentSelection.includes(value)) {
      setter(currentSelection.filter(v => v !== value))
    } else {
      setter([...currentSelection, value])
    }
  }

  const activeFilterCount = selectedTypes.length + selectedStates.length + selectedTags.length +
    selectedDifficulty.length + (selectedAmountRange ? 1 : 0)

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-desert/60 rounded-earth hover:border-pine/50 transition-colors font-medium text-text"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-pine text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-clay hover:text-clay-dark transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-white border-2 border-desert/60 rounded-earth-lg p-6 space-y-6">
          {/* Resource Type Filter */}
          {showTypeFilter && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">Resource Type (Multi-select)</label>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleMultiSelect(type.value, selectedTypes, setSelectedTypes)}
                    className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
                      selectedTypes.includes(type.value)
                        ? 'bg-pine text-white border-pine'
                        : 'bg-white text-text border-desert/60 hover:border-pine/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags Filter */}
          {showTagFilter && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">Categories (Multi-select)</label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => toggleMultiSelect(tag.value, selectedTags, setSelectedTags)}
                    className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
                      selectedTags.includes(tag.value)
                        ? 'bg-pine text-white border-pine'
                        : 'bg-white text-text border-desert/60 hover:border-pine/50'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* State Filter */}
          {showStateFilter && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">States (Multi-select)</label>
              <div className="max-h-40 overflow-y-auto border border-desert/40 rounded-earth p-3">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {US_STATES.map((state) => (
                    <button
                      key={state}
                      onClick={() => toggleMultiSelect(state, selectedStates, setSelectedStates)}
                      className={`px-2 py-1 text-sm rounded border transition-all font-medium ${
                        selectedStates.includes(state)
                          ? 'bg-pine text-white border-pine'
                          : 'bg-white text-text border-desert/60 hover:border-pine/50'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Difficulty Filter */}
          {showDifficultyFilter && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">Application Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => toggleMultiSelect(diff.value, selectedDifficulty, setSelectedDifficulty)}
                    className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
                      selectedDifficulty.includes(diff.value)
                        ? 'bg-pine text-white border-pine'
                        : 'bg-white text-text border-desert/60 hover:border-pine/50'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount Range Filter (for scholarships) */}
          {showAmountFilter && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">Scholarship Amount</label>
              <div className="flex flex-wrap gap-2">
                {AMOUNT_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedAmountRange(range.value === selectedAmountRange ? '' : range.value)}
                    className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
                      selectedAmountRange === range.value
                        ? 'bg-pine text-white border-pine'
                        : 'bg-white text-text border-desert/60 hover:border-pine/50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Filter */}
          {showSortFilter && sortOptions && (
            <div>
              <label className="block text-sm font-semibold text-text mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-stone/40 rounded-earth focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/30 bg-white text-text font-medium transition-all"
              >
                <option value="">Default</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Apply Buttons */}
          <div className="flex gap-3 pt-4 border-t border-desert/40">
            <button
              onClick={applyFilters}
              className="flex-1 px-6 py-3 bg-pine text-white rounded-earth font-semibold hover:bg-pine-dark transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-6 py-3 bg-white text-text border-2 border-desert/60 rounded-earth font-semibold hover:border-pine/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
