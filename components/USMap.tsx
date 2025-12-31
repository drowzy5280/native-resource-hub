'use client'

import { useState } from 'react'
import Link from 'next/link'

interface StateData {
  name: string
  slug: string
  count?: number
}

interface USMapProps {
  stateData?: Record<string, number>
  selectedState?: string
  onStateSelect?: (state: string) => void
  interactive?: boolean
  showTooltip?: boolean
  className?: string
}

const states: StateData[] = [
  { name: 'Alabama', slug: 'alabama' },
  { name: 'Alaska', slug: 'alaska' },
  { name: 'Arizona', slug: 'arizona' },
  { name: 'Arkansas', slug: 'arkansas' },
  { name: 'California', slug: 'california' },
  { name: 'Colorado', slug: 'colorado' },
  { name: 'Connecticut', slug: 'connecticut' },
  { name: 'Delaware', slug: 'delaware' },
  { name: 'Florida', slug: 'florida' },
  { name: 'Georgia', slug: 'georgia' },
  { name: 'Hawaii', slug: 'hawaii' },
  { name: 'Idaho', slug: 'idaho' },
  { name: 'Illinois', slug: 'illinois' },
  { name: 'Indiana', slug: 'indiana' },
  { name: 'Iowa', slug: 'iowa' },
  { name: 'Kansas', slug: 'kansas' },
  { name: 'Kentucky', slug: 'kentucky' },
  { name: 'Louisiana', slug: 'louisiana' },
  { name: 'Maine', slug: 'maine' },
  { name: 'Maryland', slug: 'maryland' },
  { name: 'Massachusetts', slug: 'massachusetts' },
  { name: 'Michigan', slug: 'michigan' },
  { name: 'Minnesota', slug: 'minnesota' },
  { name: 'Mississippi', slug: 'mississippi' },
  { name: 'Missouri', slug: 'missouri' },
  { name: 'Montana', slug: 'montana' },
  { name: 'Nebraska', slug: 'nebraska' },
  { name: 'Nevada', slug: 'nevada' },
  { name: 'New Hampshire', slug: 'new-hampshire' },
  { name: 'New Jersey', slug: 'new-jersey' },
  { name: 'New Mexico', slug: 'new-mexico' },
  { name: 'New York', slug: 'new-york' },
  { name: 'North Carolina', slug: 'north-carolina' },
  { name: 'North Dakota', slug: 'north-dakota' },
  { name: 'Ohio', slug: 'ohio' },
  { name: 'Oklahoma', slug: 'oklahoma' },
  { name: 'Oregon', slug: 'oregon' },
  { name: 'Pennsylvania', slug: 'pennsylvania' },
  { name: 'Rhode Island', slug: 'rhode-island' },
  { name: 'South Carolina', slug: 'south-carolina' },
  { name: 'South Dakota', slug: 'south-dakota' },
  { name: 'Tennessee', slug: 'tennessee' },
  { name: 'Texas', slug: 'texas' },
  { name: 'Utah', slug: 'utah' },
  { name: 'Vermont', slug: 'vermont' },
  { name: 'Virginia', slug: 'virginia' },
  { name: 'Washington', slug: 'washington' },
  { name: 'West Virginia', slug: 'west-virginia' },
  { name: 'Wisconsin', slug: 'wisconsin' },
  { name: 'Wyoming', slug: 'wyoming' },
]

// Simplified grid layout positions for states
const statePositions: Record<string, { row: number; col: number }> = {
  washington: { row: 0, col: 1 },
  oregon: { row: 1, col: 0 },
  california: { row: 2, col: 0 },
  nevada: { row: 2, col: 1 },
  idaho: { row: 1, col: 2 },
  montana: { row: 0, col: 3 },
  wyoming: { row: 1, col: 3 },
  utah: { row: 2, col: 2 },
  arizona: { row: 3, col: 1 },
  'new-mexico': { row: 3, col: 2 },
  colorado: { row: 2, col: 3 },
  'north-dakota': { row: 0, col: 4 },
  'south-dakota': { row: 1, col: 4 },
  nebraska: { row: 2, col: 4 },
  kansas: { row: 3, col: 4 },
  oklahoma: { row: 4, col: 4 },
  texas: { row: 4, col: 3 },
  minnesota: { row: 0, col: 5 },
  iowa: { row: 1, col: 5 },
  missouri: { row: 2, col: 5 },
  arkansas: { row: 3, col: 5 },
  louisiana: { row: 4, col: 5 },
  wisconsin: { row: 0, col: 6 },
  illinois: { row: 1, col: 6 },
  indiana: { row: 1, col: 7 },
  ohio: { row: 1, col: 8 },
  michigan: { row: 0, col: 7 },
  kentucky: { row: 2, col: 7 },
  tennessee: { row: 2, col: 6 },
  mississippi: { row: 3, col: 6 },
  alabama: { row: 3, col: 7 },
  georgia: { row: 3, col: 8 },
  florida: { row: 4, col: 8 },
  'south-carolina': { row: 2, col: 9 },
  'north-carolina': { row: 2, col: 8 },
  virginia: { row: 1, col: 9 },
  'west-virginia': { row: 2, col: 8 },
  pennsylvania: { row: 0, col: 9 },
  'new-york': { row: 0, col: 10 },
  'new-jersey': { row: 1, col: 10 },
  maryland: { row: 2, col: 10 },
  delaware: { row: 2, col: 11 },
  connecticut: { row: 0, col: 11 },
  'rhode-island': { row: 0, col: 12 },
  massachusetts: { row: 0, col: 11 },
  vermont: { row: 0, col: 10 },
  'new-hampshire': { row: 0, col: 11 },
  maine: { row: 0, col: 12 },
  alaska: { row: 5, col: 0 },
  hawaii: { row: 5, col: 2 },
}

function getColorIntensity(count: number, max: number): string {
  if (count === 0) return 'bg-desert/30'
  const intensity = Math.min(count / max, 1)
  if (intensity > 0.75) return 'bg-pine'
  if (intensity > 0.5) return 'bg-pine/70'
  if (intensity > 0.25) return 'bg-pine/50'
  return 'bg-pine/30'
}

export function USMap({
  stateData = {},
  selectedState,
  onStateSelect,
  interactive = true,
  showTooltip = true,
  className = '',
}: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const maxCount = Math.max(...Object.values(stateData), 1)

  return (
    <div className={`relative ${className}`}>
      {/* Tooltip */}
      {showTooltip && hoveredState && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-3 py-2 bg-text text-white rounded-earth text-sm shadow-lg z-10 whitespace-nowrap">
          {states.find((s) => s.slug === hoveredState)?.name}
          {stateData[hoveredState] !== undefined && (
            <span className="ml-2 text-gold">({stateData[hoveredState]} resources)</span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
        <span>Resources:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-desert/30 rounded" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pine/30 rounded" />
          <span>Few</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pine/70 rounded" />
          <span>Some</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pine rounded" />
          <span>Many</span>
        </div>
      </div>

      {/* Grid Map */}
      <div className="grid grid-cols-13 gap-1">
        {Array.from({ length: 6 * 13 }).map((_, index) => {
          const row = Math.floor(index / 13)
          const col = index % 13

          const state = states.find((s) => {
            const pos = statePositions[s.slug]
            return pos && pos.row === row && pos.col === col
          })

          if (!state) {
            return <div key={index} className="aspect-square" />
          }

          const count = stateData[state.slug] || 0
          const isSelected = selectedState === state.slug
          const isHovered = hoveredState === state.slug
          const colorClass = getColorIntensity(count, maxCount)

          if (interactive) {
            return (
              <Link
                key={state.slug}
                href={`/resources/state/${state.slug}`}
                className={`aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium transition-all cursor-pointer ${colorClass} ${
                  isSelected ? 'ring-2 ring-gold ring-offset-1' : ''
                } ${isHovered ? 'scale-110 shadow-lg z-10' : ''} ${
                  count > 0 ? 'text-white hover:scale-105' : 'text-text-muted hover:bg-desert/50'
                }`}
                onMouseEnter={() => setHoveredState(state.slug)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={(e) => {
                  if (onStateSelect) {
                    e.preventDefault()
                    onStateSelect(state.slug)
                  }
                }}
                title={`${state.name}${count > 0 ? ` (${count} resources)` : ''}`}
              >
                {state.name.slice(0, 2).toUpperCase()}
              </Link>
            )
          }

          return (
            <div
              key={state.slug}
              className={`aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium ${colorClass} ${
                count > 0 ? 'text-white' : 'text-text-muted'
              }`}
              title={`${state.name}${count > 0 ? ` (${count} resources)` : ''}`}
            >
              {state.name.slice(0, 2).toUpperCase()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function StateSelector({
  value,
  onChange,
  className = '',
}: {
  value?: string
  onChange: (state: string) => void
  className?: string
}) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-2 border-2 border-desert/40 rounded-earth-lg focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 bg-white ${className}`}
    >
      <option value="">All States</option>
      {states.map((state) => (
        <option key={state.slug} value={state.name}>
          {state.name}
        </option>
      ))}
    </select>
  )
}

export function StateList({ className = '' }: { className?: string }) {
  const regions = {
    'Pacific Northwest': ['washington', 'oregon', 'idaho'],
    Southwest: ['arizona', 'new-mexico', 'nevada', 'utah', 'colorado'],
    'Great Plains': ['montana', 'wyoming', 'north-dakota', 'south-dakota', 'nebraska', 'kansas', 'oklahoma'],
    Midwest: ['minnesota', 'iowa', 'wisconsin', 'illinois', 'michigan', 'indiana', 'ohio', 'missouri'],
    South: ['texas', 'louisiana', 'arkansas', 'mississippi', 'alabama', 'tennessee', 'kentucky'],
    Southeast: ['florida', 'georgia', 'south-carolina', 'north-carolina', 'virginia', 'west-virginia'],
    Northeast: ['maine', 'new-hampshire', 'vermont', 'massachusetts', 'rhode-island', 'connecticut', 'new-york', 'new-jersey', 'pennsylvania', 'maryland', 'delaware'],
    'Pacific & Other': ['california', 'alaska', 'hawaii'],
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Object.entries(regions).map(([region, stateSlugs]) => (
        <div key={region}>
          <h3 className="font-heading font-semibold text-text mb-3">{region}</h3>
          <ul className="space-y-1">
            {stateSlugs.map((slug) => {
              const state = states.find((s) => s.slug === slug)
              if (!state) return null
              return (
                <li key={slug}>
                  <Link
                    href={`/resources/state/${slug}`}
                    className="text-text-secondary hover:text-pine transition-colors text-sm py-1 block"
                  >
                    {state.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
