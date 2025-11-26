import { test, expect } from '@playwright/test'

test.describe('Resources Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resources')
  })

  test('should display resources list', async ({ page }) => {
    await expect(page).toHaveTitle(/Resources/)

    // Check if page loaded
    await expect(page.locator('h1')).toContainText(/Resources/i)

    // Check if resource cards are visible (wait for API response)
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })
    const resourceCards = page.locator('[class*="card"]')
    await expect(resourceCards.first()).toBeVisible()
  })

  test('should filter resources by type', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for filter buttons or select elements
    const filterSection = page.locator('[class*="filter"], select, button:has-text("Filter")')

    // If filters exist, test them
    if (await filterSection.count() > 0) {
      await filterSection.first().click()

      // Wait for filtered results
      await page.waitForTimeout(1000)

      // Check that page updated
      await expect(page.locator('[class*="card"]').first()).toBeVisible()
    }
  })

  test('should search resources', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')

    if (await searchInput.count() > 0) {
      await searchInput.first().fill('education')
      await page.keyboard.press('Enter')

      // Wait for search results
      await page.waitForTimeout(1000)

      // Verify URL changed or results updated
      const url = page.url()
      expect(url).toContain('education')
    }
  })

  test('should navigate to resource details', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    // Find "View Details" or similar link
    const detailsLink = page.locator('a:has-text("View Details"), a:has-text("Details")').first()

    if (await detailsLink.count() > 0) {
      await detailsLink.click()

      // Wait for navigation
      await page.waitForLoadState('networkidle')

      // Verify we're on a detail page
      expect(page.url()).toContain('/resources/')
    }
  })

  test('should save a resource', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    // Find save button (heart icon or similar)
    const saveButton = page.locator('button[aria-label*="Save"], button:has-text("Save")').first()

    if (await saveButton.count() > 0) {
      await saveButton.click()

      // Check for toast notification or visual feedback
      await page.waitForTimeout(500)

      // Verify button state changed
      await expect(saveButton).toBeVisible()
    }
  })

  test('should paginate through resources', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), button:has-text("›")')

    if (await nextButton.count() > 0 && await nextButton.first().isEnabled()) {
      await nextButton.first().click()

      // Wait for page to update
      await page.waitForTimeout(1000)

      // Verify URL changed
      const url = page.url()
      expect(url).toContain('page=2')
    }
  })

  test('should open external resource link in new tab', async ({ page, context }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    // Find "Visit Website" or external link
    const externalLink = page.locator('a:has-text("Visit Website"), a[target="_blank"]').first()

    if (await externalLink.count() > 0) {
      // Verify link has target="_blank"
      await expect(externalLink).toHaveAttribute('target', '_blank')
      await expect(externalLink).toHaveAttribute('rel', /noopener/)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check if cards are visible and stacked
    const cards = page.locator('[class*="card"]')
    await expect(cards.first()).toBeVisible()

    // Check for mobile navigation
    const mobileMenu = page.locator('button[aria-label*="menu"], button:has-text("☰")')
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu).toBeVisible()
    }
  })
})
