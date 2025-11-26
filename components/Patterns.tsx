export function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Traditional geometric diamond pattern */}
      <defs>
        <pattern id="geometric-diamonds" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 0L40 20L20 40L0 20Z" fill="currentColor" opacity="0.05" />
          <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#geometric-diamonds)" />
    </svg>
  )
}

export function TribalBorder({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {/* Repeating geometric border pattern */}
      <defs>
        <pattern id="tribal-border-pattern" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
          {/* Diamond */}
          <path d="M30 5L35 10L30 15L25 10Z" fill="currentColor" opacity="0.6" />
          {/* Triangle */}
          <path d="M15 25L20 35L10 35Z" fill="currentColor" opacity="0.4" />
          <path d="M40 25L45 35L35 35Z" fill="currentColor" opacity="0.4" />
          {/* Lines */}
          <line x1="0" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="1200" height="40" fill="url(#tribal-border-pattern)" />
    </svg>
  )
}

export function MountainsSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      {/* Layered mountain ranges with subtle gradients */}
      <defs>
        <linearGradient id="mountain-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="mountain-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="mountain-gradient-3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Back mountains */}
      <path d="M0 300 L0 180 Q200 120 300 140 T600 160 T900 120 L1200 140 L1200 300 Z"
            fill="url(#mountain-gradient-3)" />

      {/* Middle mountains */}
      <path d="M0 300 L0 200 Q150 140 250 160 T500 180 T800 150 Q900 140 1000 160 L1200 180 L1200 300 Z"
            fill="url(#mountain-gradient-2)" />

      {/* Front mountains */}
      <path d="M0 300 L0 220 Q100 180 200 200 T400 220 T700 200 Q850 190 950 210 T1200 230 L1200 300 Z"
            fill="url(#mountain-gradient-1)" />
    </svg>
  )
}

export function SunRays({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sun-gradient">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Sun rays emanating from center */}
      <g transform="translate(100, 100)">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos(angle) * 80}
              y2={Math.sin(angle) * 80}
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.15"
            />
          )
        })}
        <circle cx="0" cy="0" r="90" fill="url(#sun-gradient)" />
      </g>
    </svg>
  )
}

export function FeatherIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 2 8 6 8 12L12 22L16 12C16 6 12 2 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M8 10L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 13L5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 10L18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 13L19 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function ArrowPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="arrow-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M25 10L30 25L25 40L20 25Z" fill="currentColor" opacity="0.06" />
          <path d="M10 25L25 30L40 25L25 20Z" fill="currentColor" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#arrow-pattern)" />
    </svg>
  )
}

export function WavePattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M0 60 Q150 20 300 60 T600 60 T900 60 T1200 60 L1200 120 L0 120 Z"
        fill="currentColor"
        opacity="0.05"
      />
      <path
        d="M0 80 Q150 50 300 80 T600 80 T900 80 T1200 80 L1200 120 L0 120 Z"
        fill="currentColor"
        opacity="0.03"
      />
    </svg>
  )
}
