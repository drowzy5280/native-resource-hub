'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

interface Suggestion {
  type: 'resource' | 'scholarship' | 'tag'
  text: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`
        )
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setSuggestions([])
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(query)}`)

      // Save to recent searches
      saveRecentSearch(query.trim())
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(suggestion.text)}`)

    // Save to recent searches
    saveRecentSearch(suggestion.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const saveRecentSearch = (searchTerm: string) => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const updated = [searchTerm, ...recent.filter((s: string) => s !== searchTerm)].slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    } catch (error) {
      console.error('Failed to save recent search:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resource':
        return (
          <svg className="w-4 h-4 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'scholarship':
        return (
          <svg className="w-4 h-4 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        )
      case 'tag':
        return (
          <svg className="w-4 h-4 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl px-2 sm:px-0">
      <div ref={wrapperRef} className="relative" role="search">
        <input
          type="search"
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for resources, tribes, scholarships..."
          className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-14 text-base sm:text-lg rounded-earth-lg border-2 border-earth-sand focus:border-earth-teal focus:outline-none transition-colors"
          aria-label="Search for resources, tribes, and scholarships"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-earth-sand rounded-earth-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left hover:bg-desert/10 transition-colors flex items-center gap-3 ${
                      index === selectedIndex ? 'bg-desert/20' : ''
                    }`}
                  >
                    {getTypeIcon(suggestion.type)}
                    <span className="text-gray-900 flex-1">{suggestion.text}</span>
                    <span className="text-xs text-gray-500 capitalize">{suggestion.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  )
}
