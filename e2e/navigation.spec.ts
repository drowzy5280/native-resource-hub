import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Resources
    await page.getByRole('link', { name: 'Resources' }).first().click()
    await expect(page).toHaveURL(/\/resources/)
    await expect(page.getByRole('heading', { name: /All Resources/i })).toBeVisible()

    // Navigate to Tribes
    await page.getByRole('link', { name: 'Tribes' }).first().click()
    await expect(page).toHaveURL(/\/tribes/)
    await expect(page.getByRole('heading', { name: /Federally Recognized Tribes/i })).toBeVisible()

    // Navigate to Scholarships
    await page.getByRole('link', { name: 'Scholarships' }).first().click()
    await expect(page).toHaveURL(/\/scholarships/)
    await expect(page.getByRole('heading', { name: /Scholarships/i })).toBeVisible()

    // Navigate back to home
    await page.getByRole('link', { name: 'Native Resource Hub' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('should show mobile navigation menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Click hamburger menu
    await page.getByRole('button', { name: /Toggle menu/i }).click()

    // Check if mobile menu items are visible
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Resources' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Tribes' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Scholarships' })).toBeVisible()
  })
})
