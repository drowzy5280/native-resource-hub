'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-earth text-midnight dark:text-cream bg-white/90 dark:bg-gray-800/90 hover:bg-desert/30 dark:hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm border border-desert/30 dark:border-white/30"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <nav
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-6">
          <button
            onClick={closeMenu}
            className="self-end p-2 rounded-earth text-midnight dark:text-cream hover:bg-desert/20 dark:hover:bg-white/10 mb-8 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col space-y-2">
            <Link
              href="/resources"
              onClick={closeMenu}
              className="text-lg text-midnight dark:text-cream hover:text-clay dark:hover:text-gold transition-colors font-medium py-3 px-2 rounded-earth hover:bg-desert/20 dark:hover:bg-white/10 min-h-[44px] flex items-center"
            >
              Resources
            </Link>
            <Link
              href="/nonprofits"
              onClick={closeMenu}
              className="text-lg text-midnight dark:text-cream hover:text-clay dark:hover:text-gold transition-colors font-medium py-3 px-2 rounded-earth hover:bg-desert/20 dark:hover:bg-white/10 min-h-[44px] flex items-center"
            >
              Nonprofits
            </Link>
            <Link
              href="/tribes"
              onClick={closeMenu}
              className="text-lg text-midnight dark:text-cream hover:text-clay dark:hover:text-gold transition-colors font-medium py-3 px-2 rounded-earth hover:bg-desert/20 dark:hover:bg-white/10 min-h-[44px] flex items-center"
            >
              Tribes
            </Link>
            <Link
              href="/scholarships"
              onClick={closeMenu}
              className="text-lg text-midnight dark:text-cream hover:text-clay dark:hover:text-gold transition-colors font-medium py-3 px-2 rounded-earth hover:bg-desert/20 dark:hover:bg-white/10 min-h-[44px] flex items-center"
            >
              Scholarships
            </Link>

            {/* Theme Toggle */}
            <div className="pt-4 mt-4 border-t border-desert/20 dark:border-white/20">
              <div className="flex items-center justify-between py-3 px-2">
                <span className="text-lg text-midnight dark:text-cream font-medium">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
