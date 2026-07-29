import { expect, test } from '@playwright/test';

test('production preview serves the Phase 1 shell placeholder', async ({
  page,
}) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'The Starkonium Times',
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle('The Starkonium Times');
  await expect(
    page
      .getByRole('banner')
      .getByRole('link', { name: 'The Starkonium Times' }),
  ).toBeVisible();

  for (const linkName of ['Projects', 'Writing', 'Experience', 'About']) {
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: linkName }),
    ).toBeVisible();
  }
});

test('mobile shell has reachable navigation without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByText('MENU')).toBeVisible();
  await page.getByText('MENU').click();
  await expect(
    page
      .getByRole('navigation', { name: 'Mobile' })
      .getByRole('link', { name: 'Projects' }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});

test('dev component showcase renders Phase 3 examples', async ({ page }) => {
  const response = await page.goto('/dev/components');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { name: 'Component Showcase' }),
  ).toBeVisible();
  await expect(page.getByText('Comprehensive Fixture Project')).toBeVisible();
  await expect(page.getByText('Volume I')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Search The Starkonium Times' }).first(),
  ).toBeVisible();
});
