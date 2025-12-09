'use client'

/**
 * Honeypot field for bot detection
 *
 * This component renders a hidden field that bots typically fill out.
 * If the field is filled, the form submission should be rejected.
 *
 * Usage:
 * 1. Add <HoneypotField /> to your form
 * 2. In your form handler, call validateHoneypot(formData)
 * 3. Reject submission if validation returns false
 */

import { useId } from 'react'

interface HoneypotFieldProps {
  /** Name attribute for the hidden field */
  fieldName?: string
}

export function HoneypotField({ fieldName = 'website_url' }: HoneypotFieldProps) {
  const id = useId()

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        height: 0,
        width: 0,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <label htmlFor={id}>
        Leave this field empty
      </label>
      <input
        type="text"
        id={id}
        name={fieldName}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  )
}

/**
 * Validate honeypot field on the server
 * Returns true if the submission is valid (field is empty)
 */
export function validateHoneypot(
  formData: FormData | { get: (key: string) => string | null },
  fieldName = 'website_url'
): boolean {
  const value = formData.get(fieldName)
  // If the honeypot field has any value, it's likely a bot
  return !value || value === ''
}

/**
 * Time-based honeypot validation
 * Bots typically submit forms instantly, while humans take time
 */
export function getFormTimestamp(): string {
  return Date.now().toString(36) // Base36 encoded timestamp
}

export function validateFormTiming(
  timestamp: string | null,
  minSeconds = 3,
  maxSeconds = 3600 // 1 hour
): boolean {
  if (!timestamp) return false

  try {
    const submittedAt = parseInt(timestamp, 36)
    const now = Date.now()
    const elapsedSeconds = (now - submittedAt) / 1000

    // Form should take at least minSeconds to fill out
    // and no more than maxSeconds (prevents replay attacks)
    return elapsedSeconds >= minSeconds && elapsedSeconds <= maxSeconds
  } catch {
    return false
  }
}

/**
 * Combined honeypot component with timing
 */
interface SmartHoneypotProps {
  honeypotName?: string
  timestampName?: string
}

export function SmartHoneypot({
  honeypotName = 'website_url',
  timestampName = '_form_ts',
}: SmartHoneypotProps) {
  const timestamp = getFormTimestamp()

  return (
    <>
      <HoneypotField fieldName={honeypotName} />
      <input type="hidden" name={timestampName} value={timestamp} />
    </>
  )
}

/**
 * Full validation of smart honeypot
 */
export function validateSmartHoneypot(
  formData: FormData | { get: (key: string) => string | null },
  options?: {
    honeypotName?: string
    timestampName?: string
    minSeconds?: number
    maxSeconds?: number
  }
): { valid: boolean; reason?: string } {
  const {
    honeypotName = 'website_url',
    timestampName = '_form_ts',
    minSeconds = 3,
    maxSeconds = 3600,
  } = options || {}

  // Check honeypot
  if (!validateHoneypot(formData, honeypotName)) {
    return { valid: false, reason: 'honeypot_filled' }
  }

  // Check timing
  const timestamp = formData.get(timestampName) as string | null
  if (!validateFormTiming(timestamp, minSeconds, maxSeconds)) {
    return { valid: false, reason: 'timing_invalid' }
  }

  return { valid: true }
}
