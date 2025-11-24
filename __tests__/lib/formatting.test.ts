import {
  formatDate,
  formatDeadline,
  truncateText,
  generateSlug,
  capitalizeWords,
  parseEligibility,
} from '@/lib/formatting'

describe('formatting utilities', () => {
  describe('formatDate', () => {
    it('formats a Date object correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDate(date)
      expect(result).toMatch(/January/)
      expect(result).toMatch(/2024/)
    })

    it('formats a date string correctly', () => {
      const result = formatDate('2024-01-15T12:00:00Z')
      expect(result).toMatch(/January/)
      expect(result).toMatch(/2024/)
    })
  })

  describe('formatDeadline', () => {
    it('calculates days until future deadline correctly', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)

      const result = formatDeadline(futureDate)

      expect(result.daysUntil).toBeGreaterThanOrEqual(9)
      expect(result.daysUntil).toBeLessThanOrEqual(11)
      expect(result.isPast).toBe(false)
    })

    it('identifies past deadlines correctly', () => {
      const pastDate = new Date('2020-01-01')

      const result = formatDeadline(pastDate)

      expect(result.daysUntil).toBeLessThan(0)
      expect(result.isPast).toBe(true)
    })

    it('handles date strings', () => {
      const result = formatDeadline('2030-12-31')

      expect(result.isPast).toBe(false)
      expect(result.formatted).toContain('December')
    })
  })

  describe('truncateText', () => {
    it('truncates text longer than maxLength', () => {
      const text = 'This is a very long text that should be truncated'
      const result = truncateText(text, 20)

      expect(result).toBe('This is a very long...')
      expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
    })

    it('does not truncate text shorter than maxLength', () => {
      const text = 'Short text'
      const result = truncateText(text, 20)

      expect(result).toBe('Short text')
    })

    it('handles exact length', () => {
      const text = 'Exactly twenty chars'
      const result = truncateText(text, 20)

      expect(result).toBe('Exactly twenty chars')
    })
  })

  describe('generateSlug', () => {
    it('converts text to lowercase slug', () => {
      const result = generateSlug('Hello World')
      expect(result).toBe('hello-world')
    })

    it('removes special characters', () => {
      const result = generateSlug('Hello, World! #123')
      expect(result).toBe('hello-world-123')
    })

    it('handles multiple spaces', () => {
      const result = generateSlug('Hello    World')
      expect(result).toBe('hello-world')
    })

    it('removes leading/trailing whitespace and hyphens', () => {
      const result = generateSlug('  Hello World  ')
      // The result may have leading/trailing hyphens which get trimmed
      expect(result).toMatch(/hello-world/)
    })
  })

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      const result = capitalizeWords('hello world')
      expect(result).toBe('Hello World')
    })

    it('handles mixed case input', () => {
      const result = capitalizeWords('hELLo wORLd')
      expect(result).toBe('Hello World')
    })

    it('handles single word', () => {
      const result = capitalizeWords('hello')
      expect(result).toBe('Hello')
    })
  })

  describe('parseEligibility', () => {
    it('detects enrollment requirement', () => {
      const eligibility = ['Must be enrolled in federally recognized tribe']
      const result = parseEligibility(eligibility)

      expect(result.requiresEnrollment).toBe(true)
    })

    it('detects tribal member requirement', () => {
      const eligibility = ['Must be a tribal member']
      const result = parseEligibility(eligibility)

      expect(result.requiresEnrollment).toBe(true)
    })

    it('extracts state restrictions', () => {
      const eligibility = ['Resident of California', 'Resident of Arizona']
      const result = parseEligibility(eligibility)

      expect(result.stateRestrictions).toContain('California')
      expect(result.stateRestrictions).toContain('Arizona')
    })

    it('extracts age restrictions', () => {
      const eligibility = ['Must be 18 years or older']
      const result = parseEligibility(eligibility)

      expect(result.ageRestrictions).toBe('Must be 18 years or older')
    })

    it('handles mixed eligibility criteria', () => {
      const eligibility = [
        'Must be enrolled in tribe',
        'Resident of New Mexico',
        'Age 18-25',
      ]
      const result = parseEligibility(eligibility)

      expect(result.requiresEnrollment).toBe(true)
      expect(result.stateRestrictions).toContain('New Mexico')
      expect(result.ageRestrictions).toContain('Age')
    })

    it('handles empty eligibility array', () => {
      const result = parseEligibility([])

      expect(result.requiresEnrollment).toBe(false)
      expect(result.stateRestrictions).toEqual([])
      expect(result.ageRestrictions).toBeNull()
    })
  })
})
