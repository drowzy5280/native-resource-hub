'use client'

import { useState, useEffect } from 'react'

interface DeadlineCountdownProps {
  deadline: Date | string
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'badge'
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calculateTimeLeft(deadline: Date): TimeLeft {
  const now = new Date()
  const difference = deadline.getTime() - now.getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  }
}

function getUrgencyLevel(days: number): 'critical' | 'urgent' | 'warning' | 'normal' {
  if (days <= 3) return 'critical'
  if (days <= 7) return 'urgent'
  if (days <= 14) return 'warning'
  return 'normal'
}

const urgencyStyles = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    accent: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
    pulse: true,
  },
  urgent: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    accent: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
    pulse: false,
  },
  warning: {
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    text: 'text-gold-dark',
    accent: 'text-gold',
    badge: 'bg-gold/20 text-gold-dark',
    pulse: false,
  },
  normal: {
    bg: 'bg-pine/5',
    border: 'border-pine/20',
    text: 'text-pine-dark',
    accent: 'text-pine',
    badge: 'bg-pine/10 text-pine-dark',
    pulse: false,
  },
}

export function DeadlineCountdown({
  deadline,
  showDays = true,
  showHours = true,
  showMinutes = true,
  size = 'md',
  variant = 'default',
}: DeadlineCountdownProps) {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(deadlineDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadlineDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [deadlineDate])

  if (timeLeft.total <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone/10 text-text-muted rounded-earth text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Deadline passed
      </div>
    )
  }

  const urgency = getUrgencyLevel(timeLeft.days)
  const styles = urgencyStyles[urgency]

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${styles.badge} rounded-full text-xs font-medium ${styles.pulse ? 'animate-pulse' : ''}`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {timeLeft.days > 0 ? `${timeLeft.days}d left` : `${timeLeft.hours}h left`}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${styles.text}`}>
        <svg className={`w-4 h-4 ${styles.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </div>
    )
  }

  const sizeStyles = {
    sm: {
      container: 'p-3',
      number: 'text-xl',
      label: 'text-xs',
    },
    md: {
      container: 'p-4',
      number: 'text-2xl',
      label: 'text-xs',
    },
    lg: {
      container: 'p-5',
      number: 'text-3xl',
      label: 'text-sm',
    },
  }

  const sizeStyle = sizeStyles[size]

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-earth-lg ${sizeStyle.container} ${styles.pulse ? 'animate-pulse' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <svg className={`w-5 h-5 ${styles.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={`font-medium ${styles.text}`}>
          {urgency === 'critical' && 'Deadline approaching!'}
          {urgency === 'urgent' && 'Apply soon'}
          {urgency === 'warning' && 'Deadline in 2 weeks'}
          {urgency === 'normal' && 'Time remaining'}
        </span>
      </div>
      <div className="flex gap-3 justify-center">
        {showDays && (
          <div className="text-center">
            <div className={`${sizeStyle.number} font-bold ${styles.accent} font-heading`}>
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className={`${sizeStyle.label} ${styles.text} uppercase tracking-wide`}>Days</div>
          </div>
        )}
        {showHours && (
          <>
            <div className={`${styles.text} ${sizeStyle.number} font-light`}>:</div>
            <div className="text-center">
              <div className={`${sizeStyle.number} font-bold ${styles.accent} font-heading`}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className={`${sizeStyle.label} ${styles.text} uppercase tracking-wide`}>Hours</div>
            </div>
          </>
        )}
        {showMinutes && (
          <>
            <div className={`${styles.text} ${sizeStyle.number} font-light`}>:</div>
            <div className="text-center">
              <div className={`${sizeStyle.number} font-bold ${styles.accent} font-heading`}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className={`${sizeStyle.label} ${styles.text} uppercase tracking-wide`}>Min</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function DeadlineUrgencyIndicator({ deadline }: { deadline: Date | string }) {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone/20 text-text-muted rounded text-xs">
        Expired
      </span>
    )
  }

  if (daysLeft <= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium animate-pulse">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
      </span>
    )
  }

  if (daysLeft <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
        {daysLeft} days left
      </span>
    )
  }

  if (daysLeft <= 14) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/20 text-gold-dark rounded text-xs font-medium">
        {daysLeft} days left
      </span>
    )
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pine/10 text-pine-dark rounded text-xs">
        {daysLeft} days left
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-desert/30 text-text-secondary rounded text-xs">
      {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </span>
  )
}
