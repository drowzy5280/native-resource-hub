'use client'

import { useState, useEffect } from 'react'
import { savedItems, SavedItem } from '@/lib/localStorage'
import { useToast } from './Toast'

interface SaveButtonProps {
  id: string
  type: SavedItem['type']
  title: string
  variant?: 'icon' | 'button'
}

export function SaveButton({ id, type, title, variant = 'button' }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setIsSaved(savedItems.isSaved(id, type))
  }, [id, type])

  const handleToggle = () => {
    if (isSaved) {
      savedItems.remove(id, type)
      setIsSaved(false)
      toast.addToast('Removed from saved items', 'info')
    } else {
      savedItems.add({ id, type, title })
      setIsSaved(true)
      toast.addToast('Saved for later!', 'success')
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-all ${
          isSaved
            ? 'text-red-500 hover:text-red-600 bg-red-50'
            : 'text-text-muted hover:text-red-500 hover:bg-red-50'
        }`}
        aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
        title={isSaved ? 'Remove from saved' : 'Save for later'}
      >
        <svg
          className="w-5 h-5"
          fill={isSaved ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-earth transition-all ${
        isSaved
          ? 'text-white bg-red-500 hover:bg-red-600'
          : 'text-pine bg-pine/5 hover:bg-pine/10 border border-pine/20 hover:border-pine/40'
      }`}
      aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
    >
      <svg
        className="w-4 h-4"
        fill={isSaved ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isSaved ? 'Saved' : 'Save'}
    </button>
  )
}
