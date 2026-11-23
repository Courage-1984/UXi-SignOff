import { expect, test } from '@playwright/test'

test('loads builder with no console errors and core actions', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Copy Signature' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy Raw HTML' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Share template link' })).toBeVisible()

  await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
  expect(errors, errors.join('\n')).toEqual([])
})