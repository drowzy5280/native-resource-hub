'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)

  const shortcuts: ShortcutConfig[] = [
    {
      key: '/',
      description: 'Focus search bar',
      action: () => {
        const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"]')
        searchInput?.focus()
      },
    },
    {
      key: 'h',
      description: 'Go to home',
      action: () => router.push('/'),
    },
    {
      key: 'r',
      description: 'Go to resources',
      action: () => router.push('/resources'),
    },
    {
      key: 's',
      description: 'Go to scholarships',
      action: () => router.push('/scholarships'),
    },
    {
      key: 't',
      description: 'Go to tribes',
      action: () => router.push('/tribes'),
    },
    {
      key: 'n',
      description: 'Go to nonprofits',
      action: () => router.push('/nonprofits'),
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(prev => !prev),
    },
    {
      key: 'Escape',
      description: 'Close dialogs/modals',
      action: () => setShowHelp(false),
    },
    {
      key: 'j',
      description: 'Next item (in lists)',
      action: () => {
        const focusable = document.querySelectorAll<HTMLElement>('[data-focusable="true"], .resource-card, .scholarship-card')
        const current = document.activeElement as HTMLElement
        const currentIndex = Array.from(focusable).indexOf(current)
        const nextIndex = currentIndex < focusable.length - 1 ? currentIndex + 1 : 0
        focusable[nextIndex]?.focus()
      },
    },
    {
      key: 'k',
      description: 'Previous item (in lists)',
      action: () => {
        const focusable = document.querySelectorAll<HTMLElement>('[data-focusable="true"], .resource-card, .scholarship-card')
        const current = document.activeElement as HTMLElement
        const currentIndex = Array.from(focusable).indexOf(current)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1
        focusable[prevIndex]?.focus()
      },
    },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Escape even in inputs
      if (e.key !== 'Escape') return
    }

    for (const shortcut of shortcuts) {
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() || e.key === shortcut.key
      const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey)
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
      const altMatch = shortcut.alt ? e.altKey : !e.altKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault()
        shortcut.action()
        break
      }
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!showHelp) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-earth-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-text dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-earth"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.filter(s => s.key !== 'Escape').map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <span className="text-text-secondary dark:text-gray-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-text dark:text-gray-200 rounded text-sm font-mono">
                {shortcut.shift && 'Shift + '}
                {shortcut.ctrl && 'Ctrl + '}
                {shortcut.alt && 'Alt + '}
                {shortcut.key === '/' ? '/' : shortcut.key.toUpperCase()}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-text-muted dark:text-gray-400 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Esc</kbd> to close
        </p>
      </div>
    </div>
  )
}

// Small indicator showing keyboard shortcuts are available
export function KeyboardShortcutsIndicator() {
  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-30">
      <button
        onClick={() => {
          const event = new KeyboardEvent('keydown', { key: '?', shiftKey: true })
          document.dispatchEvent(event)
        }}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-earth shadow-soft hover:shadow-md transition-shadow text-sm text-text-secondary dark:text-gray-400"
        title="Show keyboard shortcuts"
      >
        Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">?</kbd> for shortcuts
      </button>
    </div>
  )
}
