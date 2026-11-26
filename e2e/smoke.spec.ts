import { expect, test } from '@playwright/test'

test('loads builder with no console errors and core actions in header', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('/')
  const header = page.locator('header')
  await expect(header.getByRole('button', { name: /Copy rich HTML signature/i })).toBeVisible()
  await expect(header.getByRole('button', { name: /Copy table HTML source/i })).toBeVisible()
  await expect(header.getByRole('button', { name: 'Undo last change' })).toBeVisible()
  expect(errors, errors.join('\n')).toEqual([])
})

test('layout section collapses', async ({ page }) => {
  await page.goto('/')
  const section = page.locator('details').filter({ hasText: 'Layout & spacing' })
  await expect(section).toHaveAttribute('open', '')
  await section.locator('summary').click()
  await expect(section).not.toHaveAttribute('open', '')
})

test('collapse all and expand all builder sections', async ({ page }) => {
  await page.goto('/')
  const layout = page.locator('details').filter({ hasText: 'Layout & spacing' })
  await expect(layout).toHaveAttribute('open', '')
  await page.getByRole('button', { name: 'Collapse all' }).click()
  await expect(layout).not.toHaveAttribute('open', '')
  await page.getByRole('button', { name: 'Expand all' }).click()
  await expect(layout).toHaveAttribute('open', '')
})

test('headshot alt appears in raw html copy flow', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await page.getByText('Dual Visual', { exact: true }).click()
  await page.locator('details').filter({ hasText: 'Logo & headshot' }).locator('summary').click()
  await page.getByPlaceholder('/assets/qa/headshot-square.png').fill('/assets/qa/headshot-square.png')
  await page.getByLabel('Headshot alt text').fill('E2E Headshot Alt')
  await page.locator('header').getByRole('button', { name: /Copy table HTML source/i }).click()
  const clip = await page.evaluate(() => navigator.clipboard.readText())
  expect(clip).toContain('alt="E2E Headshot Alt"')
})

test('custom gif banner in compiled output', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await page.getByText('Logo + promo stack', { exact: true }).click()
  const bannerPanel = page.locator('details', {
    has: page.locator('summary', { hasText: 'Campaign banner', exact: true }),
  })
  await bannerPanel.locator('summary').click()
  await bannerPanel.getByRole('combobox').selectOption('custom')
  await page.getByLabel('Image URL (PNG, GIF, …)').fill('/assets/qa/promo.gif')
  await page.locator('header').getByRole('button', { name: /Copy table HTML source/i }).click()
  const clip = await page.evaluate(() => navigator.clipboard.readText())
  expect(clip).toContain('promo.gif')
})