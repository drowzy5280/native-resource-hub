/**
 * Simple fuzzy search implementation using Levenshtein distance
 * Calculates similarity between two strings (0 = completely different, 1 = identical)
 */

function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )
    }
  }

  return matrix[len1][len2]
}

export function fuzzyMatch(searchTerm: string, target: string): number {
  const search = searchTerm.toLowerCase().trim()
  const text = target.toLowerCase().trim()

  // Exact match
  if (text.includes(search)) {
    return 1.0
  }

  // Calculate similarity using Levenshtein distance
  const distance = levenshteinDistance(search, text)
  const maxLength = Math.max(search.length, text.length)
  const similarity = 1 - distance / maxLength

  return similarity
}

export function fuzzyScore(searchTerm: string, text: string, threshold: number = 0.6): boolean {
  return fuzzyMatch(searchTerm, text) >= threshold
}

/**
 * Generate search suggestions based on common typos and variations
 */
export function generateSearchSuggestions(searchTerm: string): string[] {
  const suggestions: string[] = []
  const term = searchTerm.toLowerCase().trim()

  // Common Native American related terms and their variations
  const commonTerms: Record<string, string[]> = {
    scholarship: ['scholarship', 'scholarships', 'financial aid', 'grants'],
    education: ['education', 'school', 'college', 'university'],
    health: ['health', 'healthcare', 'medical', 'clinic'],
    housing: ['housing', 'home', 'shelter', 'residence'],
    emergency: ['emergency', 'urgent', 'crisis', 'immediate'],
    legal: ['legal', 'law', 'attorney', 'rights'],
    tribal: ['tribal', 'tribe', 'nation', 'indigenous'],
    native: ['native', 'indigenous', 'american indian', 'first nations'],
    benefits: ['benefits', 'assistance', 'aid', 'support'],
    resources: ['resources', 'programs', 'services', 'help'],
  }

  // Find matching terms
  for (const [key, variations] of Object.entries(commonTerms)) {
    for (const variation of variations) {
      if (fuzzyScore(term, variation, 0.7)) {
        suggestions.push(...variations.filter(v => v !== term))
        break
      }
    }
  }

  // Remove duplicates and limit to 5 suggestions
  return Array.from(new Set(suggestions)).slice(0, 5)
}

/**
 * Highlight matching parts of text
 */
export function highlightMatch(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm.trim()})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
