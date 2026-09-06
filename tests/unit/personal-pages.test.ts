import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getExperienceDateRange,
  getPersonName,
  getRelatedProjectTitles,
  resolveTopicOrText,
  selectExperienceEntries,
} from '../../src/utils/experience';
import {
  getNowHeaderMeta,
  getNowRows,
  selectCurrentNow,
} from '../../src/utils/now';
import {
  getTopicCounts,
  getTopicReferences,
  groupTopicReferences,
  groupTopicsByFacet,
} from '../../src/utils/topic-pages';
import { makeFixtureModel } from './content-fixtures';

const repoRoot = process.cwd();

describe('personal page utilities', () => {
  it('sorts public experience entries and formats current date ranges', () => {
    const model = makeFixtureModel();
    const entries = selectExperienceEntries(model.experience);

    expect(entries).toHaveLength(1);
    expect(entries[0]?.data.draft).toBe(false);
    expect(getExperienceDateRange(entries[0]!)).toBe('Jan 01, 2026 — Present');
  });

  it('resolves experience people, project links, and known topic labels', () => {
    const model = makeFixtureModel();
    const entry = model.experience[0]!;

    expect(getPersonName('jane-fixture', model.people)).toBe('Jane Fixture');
    expect(
      getRelatedProjectTitles(entry.data.relatedProjects, model.projects),
    ).toEqual([
      {
        slug: 'comprehensive-project',
        title: 'Comprehensive Fixture Project',
      },
    ]);
    expect(resolveTopicOrText(['molecular-dynamics'], model.topics)).toEqual([
      'Molecular dynamics',
    ]);
  });

  it('selects the newest Now entry and marks overdue updates after 60 days', () => {
    const model = makeFixtureModel();
    const now = selectCurrentNow(model.now);

    expect(now?.id).toBe('2026-07-09');
    expect(
      getNowHeaderMeta(now!, new Date('2026-09-10T00:00:00.000Z')).text,
    ).toContain('overdue');
    expect(getNowRows(now!).map((row) => row.label)).toContain('Location');
  });

  it('groups topics by facet and counts typed public references', () => {
    const model = makeFixtureModel();
    const groups = groupTopicsByFacet(model.topics);
    const counts = getTopicCounts(model.topics, model);
    const references = getTopicReferences('reproducibility', model);
    const groupedReferences = groupTopicReferences(references);

    expect(groups.map((group) => group.facet)).toEqual([
      'field',
      'method',
      'tool',
      'theme',
    ]);
    expect(counts.get('structural-biology')).toBeGreaterThan(0);
    expect(groupedReferences.map((group) => group.type)).toEqual([
      'Projects',
      'Writing',
      'Reviews',
      'Experience',
    ]);
    expect(
      groupedReferences.find((group) => group.type === 'Projects')?.entries,
    ).toHaveLength(1);
  });

  it('keeps the about page free of forbidden marketing words', () => {
    const source = readFileSync(
      join(repoRoot, 'src/pages/about.astro'),
      'utf8',
    );
    const forbidden = [
      'passionate',
      'innovative',
      'cutting-edge',
      'leveraging',
      'at the intersection of',
      'results-driven',
      'aspiring',
      'journey',
    ];

    for (const word of forbidden) {
      expect(source.toLowerCase()).not.toContain(word);
    }
  });

  it('does not create a contact route and keeps contact email as plain text', () => {
    const contactPageExists =
      existsSync(join(repoRoot, 'src/pages/contact.astro')) ||
      existsSync(join(repoRoot, 'src/pages/contact/index.astro'));
    const source = readFileSync(
      join(repoRoot, 'src/components/ContactBlock.astro'),
      'utf8',
    );

    expect(contactPageExists).toBe(false);
    expect(source).toContain('contact@example.com');
    expect(source).not.toContain('mailto:');
    expect(source).not.toContain('<button');
  });
});
