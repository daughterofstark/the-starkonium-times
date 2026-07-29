import { describe, expect, it } from 'vitest';

import { getLedger } from '../../src/utils/ledger';
import { makeFixtureModel } from './content-fixtures';

function first<T>(items: T[]) {
  const item = items[0];
  if (!item) throw new Error('Expected fixture item.');
  return item;
}

describe('Ledger aggregation', () => {
  it('aggregates published writing, reviews, project updates, and Now notes', () => {
    expect(getLedger(makeFixtureModel()).map((entry) => entry.type)).toEqual([
      'article',
      'review',
      'update',
      'now',
    ]);
  });

  it('sorts deterministically across repeated runs', () => {
    const model = makeFixtureModel();

    expect(getLedger(model)).toEqual(getLedger(model));
  });

  it('uses the required tie-break order for same-day entries', () => {
    const types = getLedger(makeFixtureModel()).map((entry) => entry.type);

    expect(types).toEqual(['article', 'review', 'update', 'now']);
  });

  it('ignores draft content', () => {
    const summaries = getLedger(makeFixtureModel()).map(
      (entry) => entry.summary,
    );

    expect(summaries.join(' ')).not.toContain('Draft');
  });

  it('includes Now only when ledgerNote exists', () => {
    const nowEntries = getLedger(makeFixtureModel()).filter(
      (entry) => entry.type === 'now',
    );

    expect(nowEntries).toHaveLength(1);
    expect(first(nowEntries).summary).toBe(
      'Updated the fake Now entry for Ledger aggregation.',
    );
  });

  it('filters project updates by project slug', () => {
    const entries = getLedger(makeFixtureModel(), {
      projectSlug: 'comprehensive-project',
      types: ['update'],
    });

    expect(entries).toHaveLength(1);
    expect(first(entries)).toMatchObject({
      href: '/projects/comprehensive-project#updates',
      projectId: 'PRJ-001',
    });
  });

  it('handles projects with no updates without throwing', () => {
    const entries = getLedger(makeFixtureModel(), {
      projectSlug: 'no-updates-project',
      types: ['update'],
    });

    expect(entries).toEqual([]);
  });

  it('matches the committed fixture snapshot', () => {
    expect(
      getLedger(makeFixtureModel()).map((entry) => ({
        key: entry.key,
        type: entry.type,
        tag: entry.tag,
        href: entry.href,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "href": "/writing/short-note",
          "key": "article:short-note:2026-07-09:7f459fa4",
          "tag": "SHT",
          "type": "article",
        },
        {
          "href": "/reviews/complete-review",
          "key": "review:complete-review:2026-07-09:48a2a901",
          "tag": "REV",
          "type": "review",
        },
        {
          "href": "/projects/comprehensive-project#updates",
          "key": "update:comprehensive-project:2026-07-09:6f484024",
          "tag": "RES",
          "type": "update",
        },
        {
          "href": "/now",
          "key": "now:2026-07-09:2026-07-09:8aa0fd14",
          "tag": "NOW",
          "type": "now",
        },
      ]
    `);
  });
});
