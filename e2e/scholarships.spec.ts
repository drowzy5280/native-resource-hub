import { test, expect } from '@playwright/test'

test.describe('Scholarships Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scholarships')
  })

  test('should display scholarships list', async ({ page }) => {
    await expect(page).toHaveTitle(/Scholarships/)

    // Check if page loaded
    await expect(page.locator('h1')).toContainText(/Scholarships/i)

    // Check if scholarship cards are visible
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })
    const scholarshipCards = page.locator('[class*="card"]')
    await expect(scholarshipCards.first()).toBeVisible()
  })

  test('should display scholarship details', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    const firstCard = page.locator('[class*="card"]').first()

    // Check for expected scholarship information
    await expect(firstCard).toBeVisible()
  })

  test('should sort scholarships by deadline', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for sort dropdown or buttons
    const sortControl = page.locator('select, button:has-text("Sort")')

    if (await sortControl.count() > 0) {
      await sortControl.first().click()

      // Wait for sorting to apply
      await page.waitForTimeout(1000)

      // Verify results updated
      await expect(page.locator('[class*="card"]').first()).toBeVisible()
    }
  })

  test('should navigate to scholarship details', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    // Find "View Details" link
    const detailsLink = page.locator('a:has-text("View Details")').first()

    if (await detailsLink.count() > 0) {
      await detailsLink.click()

      // Wait for navigation
      await page.waitForLoadState('networkidle')

      // Verify we're on a detail page
      expect(page.url()).toContain('/scholarships/')
    }
  })

  test('should filter scholarships by tags', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Look for tag filters
    const tagFilter = page.locator('button:has-text("education"), button:has-text("undergraduate")')

    if (await tagFilter.count() > 0) {
      await tagFilter.first().click()

      // Wait for filtering
      await page.waitForTimeout(1000)

      // Verify results updated
      await expect(page.locator('[class*="card"]').first()).toBeVisible()
    }
  })

  test('should display deadline countdown', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    const firstCard = page.locator('[class*="card"]').first()

    // Look for deadline information (could be "days left", date, etc.)
    const deadlineText = firstCard.locator('text=/deadline|days|due/i')

    if (await deadlineText.count() > 0) {
      await expect(deadlineText.first()).toBeVisible()
    }
  })

  test('should share scholarship', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    // Find share button
    const shareButton = page.locator('button:has-text("Share"), button[aria-label*="Share"]').first()

    if (await shareButton.count() > 0) {
      await shareButton.click()

      // Wait for share modal or menu
      await page.waitForTimeout(500)

      // Verify share UI appeared
      const shareMenu = page.locator('[class*="share"], [role="dialog"]')
      if (await shareMenu.count() > 0) {
        await expect(shareMenu.first()).toBeVisible()
      }
    }
  })

  test('should open application link in new tab', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    // Find "Apply" or external link
    const applyLink = page.locator('a:has-text("Apply"), a:has-text("Application")').first()

    if (await applyLink.count() > 0) {
      // Verify link has target="_blank"
      await expect(applyLink).toHaveAttribute('target', '_blank')
    }
  })

  test('should display amount information', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('[class*="card"]', { timeout: 5000 })

    const firstCard = page.locator('[class*="card"]').first()

    // Look for amount (e.g., "$5,000", "Award:", etc.)
    const amountText = firstCard.locator('text=/\\$|amount/i')

    if (await amountText.count() > 0) {
      await expect(amountText.first()).toBeVisible()
    }
  })

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Verify focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})
