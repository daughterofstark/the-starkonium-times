import { expect, test } from '@playwright/test';

test('production preview serves the Phase 0 smoke page', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'The Starkonium Times — Phase 0',
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle('The Starkonium Times — Phase 0');
});
