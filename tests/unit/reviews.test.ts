import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getDoiHref,
  getMissingReviewSections,
  getReviewVerdictOptions,
  selectReviewIndexEntries,
  splitReviewHtmlSections,
} from '../../src/utils/reviews';
import { makeFixtureModel } from './content-fixtures';

describe('review utilities', () => {
  it('selects public reviews in reverse review-date order', () => {
    const model = makeFixtureModel();
    const reviews = selectReviewIndexEntries(model.reviews);

    expect(reviews.map((review) => review.id)).toEqual(['complete-review']);
  });

  it('creates verdict filter options from public reviews', () => {
    const model = makeFixtureModel();
    const options = getReviewVerdictOptions(model.reviews);

    expect(options).toEqual([
      { value: 'flawed-but-useful', label: 'Flawed But Useful' },
    ]);
  });

  it('detects missing required review sections', () => {
    const missing = getMissingReviewSections('## Verdict\n\nText');

    expect(missing).toContain('Strongest contribution');
    expect(missing).toContain('Overall assessment');
  });

  it('splits the prose verdict from the remaining review body', () => {
    const sections = splitReviewHtmlSections(
      '<h2 id="verdict">Verdict</h2><p>Verdict text.</p><h2 id="methods">Methods</h2><p>Method text.</p>',
    );

    expect(sections.verdict).toContain('Verdict text');
    expect(sections.remaining).toContain('Method text');
    expect(sections.remaining).not.toContain('Verdict text');
  });

  it('formats DOI links', () => {
    expect(getDoiHref('10.1234/fixture.paper')).toBe(
      'https://doi.org/10.1234/fixture.paper',
    );
  });

  it('does not add aggregate numeric rating fields to source', () => {
    const terms = ['average', 'overall', 'total'].map(
      (prefix) => `${prefix}Score`,
    );
    terms.push(...['aggregate', 'review'].map((prefix) => `${prefix}Rating`));
    const files = [
      'src/components/AssessmentStrip.astro',
      'src/pages/reviews/[slug].astro',
      'src/pages/reviews/index.astro',
      'src/utils/reviews.ts',
    ];
    const source = files
      .map((file) => readFileSync(join(process.cwd(), file), 'utf8'))
      .join('\n');

    for (const term of terms) {
      expect(source).not.toContain(term);
    }
  });
});
