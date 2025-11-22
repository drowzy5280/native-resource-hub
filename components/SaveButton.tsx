'use client'

import { useState } from 'react'
import { postFetcher } from '@/lib/fetchers'

interface SaveButtonProps {
  userId: string
  resourceId: string
  initialSaved?: boolean
}

export function SaveButton({ userId, resourceId, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      if (saved) {
        await postFetcher('/api/user/removeResource', { userId, resourceId })
        setSaved(false)
      } else {
        await postFetcher('/api/user/saveResource', { userId, resourceId })
        setSaved(true)
      }
    } catch (error) {
      console.error('Error toggling save:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        saved
          ? 'bg-earth-rust text-white'
          : 'bg-earth-sand/30 text-earth-brown hover:bg-earth-sand/50'
      } disabled:opacity-50`}
      aria-label={saved ? 'Remove from saved' : 'Save resource'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={saved ? 0 : 2}
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
