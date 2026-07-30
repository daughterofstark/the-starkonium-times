import { expect, test } from '@playwright/test';

test('production preview serves the Phase 4 homepage', async ({ page }) => {
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
  await expect(
    page.getByText('A public notebook for research, software, paper reviews'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Recent Ledger' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Currently' })).toBeVisible();
  await expect(
    page.getByText('Example City · Example Institute').first(),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Selected projects' }),
  ).toBeVisible();
  await expect(page.getByText('Comprehensive Fixture Project')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Latest writing' }),
  ).toBeVisible();
  await expect(page.getByText('Short Fixture Note')).toBeVisible();

  for (const linkName of ['Projects', 'Writing', 'Experience', 'About']) {
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: linkName }),
    ).toBeVisible();
  }

  await expect(
    page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: /components/i }),
  ).toHaveCount(0);
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

test('projects index renders public projects and enhances filters', async ({
  page,
}) => {
  const response = await page.goto('/projects');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Projects' }),
  ).toBeVisible();
  await expect(page.getByText('Comprehensive Fixture Project')).toBeVisible();
  await expect(page.getByText('Draft Fixture Project')).toHaveCount(0);

  await page.getByLabel('Status').selectOption('completed');
  await expect(page).toHaveURL(/status=completed/);
  await expect(page.getByText('Completed Fixture Project')).toBeVisible();
  await expect(
    page.locator('[data-project-item][data-status="active"]').first(),
  ).toBeHidden();

  await page.getByLabel('Field').selectOption('structural-biology');
  await expect(page).toHaveURL(/field=structural-biology/);
  await page.getByRole('link', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/\/projects$/);
});

test('project detail pages render published records and update anchors', async ({
  page,
}) => {
  const response = await page.goto('/projects/comprehensive-project');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Comprehensive Fixture Project',
    }),
  ).toBeVisible();
  await expect(page.locator('header.page-header')).not.toContainText('PRJ-002');
  await expect(page.locator('#updates')).toBeVisible();
  await expect(
    page.getByText('Rebuilt the fake validation set and recorded'),
  ).toBeVisible();
  await expect(page.getByText('fixture-repository')).toBeVisible();
});

test('minimal published project renders and draft project stays unpublished', async ({
  page,
}) => {
  const minimal = await page.goto('/projects/minimal-public-project');

  expect(minimal?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Minimal Public Fixture Project',
    }),
  ).toBeVisible();
  await expect(
    page.getByText('only required fields can still render'),
  ).toBeVisible();

  const draft = await page.goto('/projects/draft-project');

  expect(draft?.status()).toBe(404);
});

test('homepage project links resolve to built project routes', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'All projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Projects' }),
  ).toBeVisible();
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
