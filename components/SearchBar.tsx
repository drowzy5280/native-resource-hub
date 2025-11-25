'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl px-2 sm:px-0">
      <div className="relative" role="search">
        <input
          type="search"
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
      </div>
    </form>
  )
}
