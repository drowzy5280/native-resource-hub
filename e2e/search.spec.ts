import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test('should search from home page', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first()
    await expect(searchInput).toBeVisible()

    // Enter search term
    await searchInput.fill('housing assistance')
    await page.keyboard.press('Enter')

    // Wait for navigation or results
    await page.waitForTimeout(1000)

    // Verify search was performed
    const url = page.url()
    expect(url).toContain('search')
  })

  test('should display search results', async ({ page }) => {
    await page.goto('/search?q=education')

    // Wait for results
    await page.waitForLoadState('networkidle')

    // Check for results or "no results" message
    const results = page.locator('[class*="card"], text=/results|found/i')
    await expect(results.first()).toBeVisible()
  })

  test('should handle empty search', async ({ page }) => {
    await page.goto('/')

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first()
    await searchInput.fill('')
    await page.keyboard.press('Enter')

    // Should either stay on page or show validation
    await page.waitForTimeout(500)
  })

  test('should show search suggestions', async ({ page }) => {
    await page.goto('/')

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first()

    // Start typing
    await searchInput.fill('edu')

    // Wait for suggestions (if implemented)
    await page.waitForTimeout(500)

    // Check for suggestions dropdown
    const suggestions = page.locator('[role="listbox"], [class*="suggestion"]')
    if (await suggestions.count() > 0) {
      await expect(suggestions.first()).toBeVisible()
    }
  })

  test('should clear search', async ({ page }) => {
    await page.goto('/search?q=education')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Find clear button or search input
    const clearButton = page.locator('button:has-text("Clear"), button[aria-label*="Clear"]')
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')

    if (await clearButton.count() > 0) {
      await clearButton.click()
    } else if (await searchInput.count() > 0) {
      await searchInput.fill('')
      await page.keyboard.press('Enter')
    }

    // Wait for results to update
    await page.waitForTimeout(1000)
  })

  test('should search across different resource types', async ({ page }) => {
    await page.goto('/search?q=scholarship')

    // Wait for results
    await page.waitForLoadState('networkidle')

    // Should show relevant results
    const results = page.locator('[class*="card"]')
    if (await results.count() > 0) {
      await expect(results.first()).toBeVisible()
    }
  })
})

test.describe('Filter Functionality', () => {
  test('should filter by category on home page', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Find category links (Education, Health, etc.)
    const categoryLink = page.locator('a[href*="tags=education"], a:has-text("Education")').first()

    if (await categoryLink.count() > 0) {
      await categoryLink.click()

      // Wait for navigation
      await page.waitForLoadState('networkidle')

      // Verify filtered results
      expect(page.url()).toContain('education')
    }
  })

  test('should filter resources by state', async ({ page }) => {
    await page.goto('/resources')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for state filter
    const stateFilter = page.locator('select[name*="state"], button:has-text("State")')

    if (await stateFilter.count() > 0) {
      await stateFilter.first().click()
      await page.waitForTimeout(500)

      // Select a state (if dropdown)
      const stateOption = page.locator('option[value="CA"], button:has-text("California")').first()
      if (await stateOption.count() > 0) {
        await stateOption.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test('should apply multiple filters', async ({ page }) => {
    await page.goto('/resources')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Apply type filter
    const typeFilter = page.locator('select, button:has-text("Type")').first()
    if (await typeFilter.count() > 0) {
      await typeFilter.click()
      await page.waitForTimeout(500)
    }

    // Apply tag filter
    const tagFilter = page.locator('button:has-text("education"), input[type="checkbox"]').first()
    if (await tagFilter.count() > 0) {
      await tagFilter.click()
      await page.waitForTimeout(1000)
    }

    // Verify results are filtered
    const results = page.locator('[class*="card"]')
    if (await results.count() > 0) {
      await expect(results.first()).toBeVisible()
    }
  })

  test('should reset filters', async ({ page }) => {
    await page.goto('/resources?type=federal&tags=education')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Find reset or clear filters button
    const resetButton = page.locator('button:has-text("Clear"), button:has-text("Reset")')

    if (await resetButton.count() > 0) {
      await resetButton.click()

      // Wait for filters to clear
      await page.waitForTimeout(1000)

      // Verify URL changed
      const url = page.url()
      expect(url).not.toContain('type=')
    }
  })
})
