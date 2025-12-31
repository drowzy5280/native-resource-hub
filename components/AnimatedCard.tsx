'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'border' | 'none'
  clickEffect?: boolean
  enterAnimation?: 'fade' | 'slide-up' | 'slide-left' | 'scale' | 'none'
  delay?: number
}

export function AnimatedCard({
  children,
  className = '',
  hoverEffect = 'lift',
  clickEffect = true,
  enterAnimation = 'fade',
  delay = 0,
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const hoverStyles = {
    lift: 'hover:-translate-y-1 hover:shadow-soft-lg',
    glow: 'hover:shadow-[0_0_20px_rgba(107,146,112,0.3)]',
    scale: 'hover:scale-[1.02]',
    border: 'hover:border-pine',
    none: '',
  }

  const enterStyles = {
    fade: `transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`,
    'slide-up': `transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`,
    'slide-left': `transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`,
    scale: `transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`,
    none: '',
  }

  const handleClick = () => {
    if (clickEffect) {
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 150)
    }
  }

  return (
    <div
      ref={cardRef}
      className={`
        transition-all duration-300 ease-out
        ${hoverStyles[hoverEffect]}
        ${enterStyles[enterAnimation]}
        ${isClicked ? 'scale-[0.98]' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

export function PulseOnHover({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`group ${className}`}>
      <div className="transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        {children}
      </div>
    </div>
  )
}

export function ShimmerButton({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden
        before:absolute before:inset-0 before:-translate-x-full
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        hover:before:animate-shimmer
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export function CountUp({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
}: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className = '',
}: {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className={className}>
      <circle
        className="text-desert/30"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      <circle
        className="text-pine transition-all duration-500 ease-out"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  )
}

export function TypeWriter({
  text,
  speed = 50,
  className = '',
  onComplete,
}: {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

export function Skeleton({
  className = '',
  variant = 'text',
}: {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-earth',
  }

  return (
    <div
      className={`animate-pulse bg-desert/40 ${variantStyles[variant]} ${className}`}
    />
  )
}

export function FadeInStagger({
  children,
  className = '',
  staggerDelay = 100,
}: {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
