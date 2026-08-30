import { describe, expect, it } from 'vitest';

import {
  getReadingMinutes,
  getRelatedWriting,
  getWritingFeed,
  groupWritingByYear,
  prepareProseHtml,
  shouldShowReadingTime,
} from '../../src/utils/writing';
import { makeFixtureModel } from './content-fixtures';

describe('writing utilities', () => {
  it('builds a public writing feed that includes reviews and excludes drafts', () => {
    const model = makeFixtureModel();
    const feed = getWritingFeed(model.writing, model.reviews);

    expect(feed.map((item) => item.key)).toEqual([
      'review:complete-review',
      'writing:short-note',
    ]);
    expect(feed.some((item) => item.key === 'writing:draft-note')).toBe(false);
  });

  it('groups writing feed entries by year', () => {
    const model = makeFixtureModel();
    const groups = groupWritingByYear(
      getWritingFeed(model.writing, model.reviews),
    );

    expect(groups).toHaveLength(1);
    expect(groups[0]?.year).toBe('2026');
  });

  it('extracts a table of contents from rendered prose headings', () => {
    const prepared = prepareProseHtml(
      '<h2>First section</h2><p>Body</p><h3>Detail</h3>',
    );

    expect(prepared.toc).toEqual([
      { depth: 2, id: 'first-section', text: 'First section' },
      { depth: 3, id: 'detail', text: 'Detail' },
    ]);
    expect(prepared.html).toContain(
      '<h2 id="first-section">First section</h2>',
    );
  });

  it('hides reading time below three minutes', () => {
    expect(shouldShowReadingTime(getReadingMinutes('short text'))).toBe(false);
  });

  it('scores related writing without recommendation copy', () => {
    const model = makeFixtureModel();
    const current = model.writing.find((entry) => entry.id === 'short-note');

    if (!current) {
      throw new Error('Expected short-note fixture.');
    }

    const related = getRelatedWriting(current, model.writing);

    expect(related).toHaveLength(0);
  });
});
