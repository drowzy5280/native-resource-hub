'use client'

import { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  onApply?: () => void
  onClear?: () => void
}

export function MobileFilterSheet({
  isOpen,
  onClose,
  title = 'Filters',
  children,
  onApply,
  onClear,
}: MobileFilterSheetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted) return null

  const sheetContent = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white rounded-t-2xl shadow-xl max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-stone/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-stone/20">
            <h2 className="text-lg font-heading font-bold text-text">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-desert/30 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-4 border-t border-stone/20 bg-desert/30">
            {onClear && (
              <button
                onClick={() => {
                  onClear()
                }}
                className="flex-1 px-4 py-3 border border-stone/40 rounded-earth font-semibold text-text bg-white hover:bg-desert/30 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => {
                onApply?.()
                onClose()
              }}
              className="flex-1 px-4 py-3 bg-pine text-white rounded-earth font-semibold hover:bg-pine-dark transition-colors"
            >
              Apply Filters
            </button>
          </div>

          {/* Safe area padding for iOS */}
          <div className="h-safe-area-inset-bottom bg-desert/30" />
        </div>
      </div>
    </>
  )

  return createPortal(sheetContent, document.body)
}

// Filter button that triggers the sheet on mobile
interface FilterButtonProps {
  onClick: () => void
  activeCount?: number
}

export function MobileFilterButton({ onClick, activeCount = 0 }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-stone/40 rounded-earth shadow-soft hover:shadow-md hover:border-stone/60 transition-all"
    >
      <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      <span className="font-semibold text-text">Filters</span>
      {activeCount > 0 && (
        <span className="px-2 py-0.5 bg-pine text-white text-xs font-bold rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  )
}
