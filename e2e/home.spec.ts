import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check if the hero title is visible
    await expect(page.getByRole('heading', { name: /Find Resources for Your Community/i })).toBeVisible()
  })

  test('should display search bar', async ({ page }) => {
    await page.goto('/')

    // Check if search input is present
    const searchInput = page.getByPlaceholder(/Search for resources, tribes, scholarships/i)
    await expect(searchInput).toBeVisible()
  })

  test('should display stats cards', async ({ page }) => {
    await page.goto('/')

    // Check for stats sections
    await expect(page.getByText(/Resources Available/i)).toBeVisible()
    await expect(page.getByText(/Scholarships/i)).toBeVisible()
    await expect(page.getByText(/Tribes Listed/i)).toBeVisible()
  })

  test('should navigate to resources page', async ({ page }) => {
    await page.goto('/')

    // Click on the Resources link
    await page.getByRole('link', { name: 'Resources' }).first().click()

    // Verify we're on the resources page
    await expect(page).toHaveURL(/\/resources/)
  })

  test('should perform search', async ({ page }) => {
    await page.goto('/')

    // Fill in search box
    const searchInput = page.getByPlaceholder(/Search for resources, tribes, scholarships/i)
    await searchInput.fill('education')

    // Submit search
    await searchInput.press('Enter')

    // Should navigate to search page
    await expect(page).toHaveURL(/\/search\?q=education/)
  })
})
