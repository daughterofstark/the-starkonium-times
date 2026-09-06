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
      .getByRole('link', { name: 'The Starkonium Times', exact: true }),
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
  await expect(
    page.getByRole('link', {
      name: 'Comprehensive Fixture Project',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Latest writing' }),
  ).toBeVisible();
  await expect(
    page
      .getByLabel('Latest writing')
      .getByRole('link', { name: 'Short Fixture Note', exact: true }),
  ).toBeVisible();

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

test('writing index renders feed entries and kind filtering', async ({
  page,
}) => {
  const response = await page.goto('/writing');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Writing' }),
  ).toBeVisible();
  await expect(page.getByText('Short Fixture Note')).toBeVisible();
  await expect(
    page
      .getByRole('main')
      .getByRole('link', {
        name: 'A Fictional Paper for Schema Tests',
        exact: true,
      })
      .first(),
  ).toBeVisible();
  await expect(page.getByText('Draft Fixture Note')).toHaveCount(0);
  await expect(page.getByText('Volume I').first()).toBeVisible();
  await expect(page.getByText(/\b(old|legacy|archived)\b/i)).toHaveCount(0);

  await page.getByRole('link', { name: 'Reviews' }).click();
  await expect(page).toHaveURL(/kind=review/);
  await expect(
    page
      .locator('[data-writing-item][data-kind="review"]')
      .getByRole('link', {
        name: 'A Fictional Paper for Schema Tests',
        exact: true,
      })
      .first(),
  ).toBeVisible();
  await expect(
    page.locator('[data-writing-item][data-kind="short"]').first(),
  ).toBeHidden();
});

test('writing detail pages render prose, metadata, and optional foot sections', async ({
  page,
}) => {
  const response = await page.goto('/writing/long-essay');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Long Essay Fixture' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'A fixture with a job' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'A fixture with a job' }),
  ).toBeVisible();
  await expect(page.locator('[data-reading-progress]')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Revisions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Related' })).toBeVisible();
});

test('short and minimal writing pages omit empty article machinery', async ({
  page,
}) => {
  const short = await page.goto('/writing/short-note');

  expect(short?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Short Fixture Note' }),
  ).toBeVisible();
  await expect(page.locator('[data-reading-progress]')).toHaveCount(0);

  const minimal = await page.goto('/writing/article-no-metadata');

  expect(minimal?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Minimal Writing Fixture' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Revisions' })).toHaveCount(0);
});

test('writing technical fixture ships no KaTeX or Shiki client requests', async ({
  page,
}) => {
  const clientLibraryRequests: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (/katex|shiki/i.test(url)) {
      clientLibraryRequests.push(url);
    }
  });

  const response = await page.goto('/writing/technical-article');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByText('score = Σ fake_observation').first(),
  ).toBeVisible();
  expect(clientLibraryRequests).toHaveLength(0);
});

test('reviews index renders records and enhances filters', async ({ page }) => {
  const response = await page.goto('/reviews');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Paper reviews' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'A Fictional Paper for Schema Tests',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText('doi:10.1234/fixture.paper')).toBeVisible();

  await page.getByLabel('Verdict').selectOption('flawed-but-useful');
  await expect(page).toHaveURL(/verdict=flawed-but-useful/);
  await expect(
    page.getByRole('link', {
      name: 'A Fictional Paper for Schema Tests',
      exact: true,
    }),
  ).toBeVisible();

  await page.getByLabel('Field').selectOption('structural-biology');
  await expect(page).toHaveURL(/field=structural-biology/);
  await page.getByRole('link', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/\/reviews$/);
});

test('review detail renders prose verdict, record, assessment, reproduction, and citation', async ({
  page,
}) => {
  const response = await page.goto('/reviews/complete-review');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'A Fictional Paper for Schema Tests',
    }),
  ).toBeVisible();
  await expect(page.locator('meta[name="citation_doi"]')).toHaveAttribute(
    'content',
    '10.1234/fixture.paper',
  );
  await expect(
    page.getByRole('link', { name: 'doi:10.1234/fixture.paper' }),
  ).toHaveAttribute('href', 'https://doi.org/10.1234/fixture.paper');
  await expect(page.getByRole('heading', { name: 'Verdict' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Assessment', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('img', { name: /Evidence: 3 out of 5/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Reproducibility record' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Citation' })).toBeVisible();
});

test('writing feed review link resolves to the review detail page', async ({
  page,
}) => {
  await page.goto('/writing');
  await page
    .locator('[data-writing-item][data-kind="review"]')
    .getByRole('link', {
      name: 'A Fictional Paper for Schema Tests',
      exact: true,
    })
    .first()
    .click();

  await expect(page).toHaveURL(/\/reviews\/complete-review$/);
  await expect(page.getByRole('heading', { name: 'Verdict' })).toBeVisible();
});

test('draft writing page stays unpublished and homepage writing link resolves', async ({
  page,
}) => {
  const draft = await page.goto('/writing/draft-note');

  expect(draft?.status()).toBe(404);

  await page.goto('/');
  await page.getByRole('link', { name: 'All writing' }).click();
  await expect(page).toHaveURL(/\/writing$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Writing' }),
  ).toBeVisible();
});

test('dev component showcase renders Phase 3 examples', async ({ page }) => {
  const response = await page.goto('/dev/components');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { name: 'Component Showcase' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'Comprehensive Fixture Project',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText('Volume I').first()).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Search The Starkonium Times' }).first(),
  ).toBeVisible();
});

test('personal pages render experience, about, now, and colophon', async ({
  page,
}) => {
  let response = await page.goto('/experience');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Experience' }),
  ).toBeVisible();
  await expect(page.getByText('Fixture Research Assistant')).toBeVisible();
  await expect(page.getByText('Minimal Fixture Lab')).toBeVisible();
  await expect(page.getByRole('button')).toHaveCount(0);

  response = await page.goto('/about');
  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'About' }),
  ).toBeVisible();
  await expect(page.getByText('contact@example.com').first()).toBeVisible();
  await expect(
    page.getByRole('button', { name: /contact@example.com/i }),
  ).toHaveCount(0);

  response = await page.goto('/now');
  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Now' }),
  ).toBeVisible();
  await expect(
    page.getByText('Example City · Example Institute'),
  ).toBeVisible();

  response = await page.goto('/colophon');
  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Colophon' }),
  ).toBeVisible();
  await expect(page.getByText('Code is MIT')).toBeVisible();
});

test('topics pages group references by facet and type counts', async ({
  page,
}) => {
  let response = await page.goto('/topics');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Topics' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Structural biology/ }),
  ).toBeVisible();

  response = await page.goto('/topics/structural-biology');
  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Structural biology' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Projects \(/ }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /Writing \(/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Reviews \(/ })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /Experience \(/ }),
  ).toBeVisible();
});

test('404 page renders required helpful links and no contact route exists', async ({
  page,
}) => {
  const missing = await page.goto('/definitely-missing');

  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'No page here.' }),
  ).toBeVisible();
  for (const linkName of ['Archive', 'Writing', 'Search']) {
    await expect(page.getByRole('link', { name: linkName })).toBeVisible();
  }

  const contact = await page.goto('/contact');
  expect(contact?.status()).toBe(404);
});
