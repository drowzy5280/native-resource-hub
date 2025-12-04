'use client'

import { useState, useEffect } from 'react'

type TextSize = 'small' | 'medium' | 'large' | 'extra-large'
type ContrastMode = 'normal' | 'high'

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [textSize, setTextSize] = useState<TextSize>('medium')
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal')

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedTextSize = localStorage.getItem('textSize') as TextSize
    const savedContrast = localStorage.getItem('contrastMode') as ContrastMode

    if (savedTextSize) {
      setTextSize(savedTextSize)
      applyTextSize(savedTextSize)
    }

    if (savedContrast) {
      setContrastMode(savedContrast)
      applyContrastMode(savedContrast)
    }
  }, [])

  const applyTextSize = (size: TextSize) => {
    const root = document.documentElement
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large')
    root.classList.add(`text-${size}`)
    localStorage.setItem('textSize', size)
  }

  const applyContrastMode = (mode: ContrastMode) => {
    const root = document.documentElement
    if (mode === 'high') {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    localStorage.setItem('contrastMode', mode)
  }

  const handleTextSizeChange = (size: TextSize) => {
    setTextSize(size)
    applyTextSize(size)
  }

  const handleContrastChange = (mode: ContrastMode) => {
    setContrastMode(mode)
    applyContrastMode(mode)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 bg-pine text-white rounded-full shadow-soft-lg hover:bg-pine-dark transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {/* Control Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed bottom-32 md:bottom-24 right-4 md:right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-earth-lg shadow-soft-lg border border-desert/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold text-text">Accessibility</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-desert/30 rounded-earth transition-colors"
                aria-label="Close accessibility settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Text Size Controls */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-3">
                Text Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['small', 'medium', 'large', 'extra-large'] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleTextSizeChange(size)}
                    className={`px-4 py-2 rounded-earth border-2 transition-all font-medium capitalize ${
                      textSize === size
                        ? 'bg-pine text-white border-pine'
                        : 'bg-white text-text border-desert/60 hover:border-pine/50'
                    }`}
                    aria-pressed={textSize === size}
                  >
                    {size === 'extra-large' ? 'XL' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Mode Controls */}
            <div>
              <label className="block text-sm font-medium text-text mb-3">
                Contrast Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleContrastChange('normal')}
                  className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
                    contrastMode === 'normal'
                      ? 'bg-pine text-white border-pine'
                      : 'bg-white text-text border-desert/60 hover:border-pine/50'
                  }`}
                  aria-pressed={contrastMode === 'normal'}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleContrastChange('high')}
                  className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${
                    contrastMode === 'high'
                      ? 'bg-pine text-white border-pine'
                      : 'bg-white text-text border-desert/60 hover:border-pine/50'
                  }`}
                  aria-pressed={contrastMode === 'high'}
                >
                  High Contrast
                </button>
              </div>
            </div>

            {/* Info Text */}
            <p className="text-xs text-text-muted mt-4 pt-4 border-t border-desert/30">
              These settings are saved to your browser and will persist across visits.
            </p>
          </div>
        </>
      )}
    </>
  )
}
