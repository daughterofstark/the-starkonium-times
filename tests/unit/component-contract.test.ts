import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { projectStatusMeta } from '../../src/utils/status';
import { resolveTopicLabels } from '../../src/utils/topics';
import { makeFixtureModel } from './content-fixtures';

function readComponent(name: string) {
  return readFileSync(
    new URL(`../../src/components/${name}.astro`, import.meta.url),
    'utf8',
  );
}

describe('Phase 3 component contracts', () => {
  it('keeps MetadataList semantic as a definition list', () => {
    const source = readComponent('MetadataList');

    expect(source).toContain('<dl');
    expect(source).toContain('<dt>');
    expect(source).toContain('<dd');
  });

  it('keeps SearchTrigger accessible and honest about future search', () => {
    const source = readComponent('SearchTrigger');

    expect(source).toContain('aria-label="Search The Starkonium Times"');
    expect(source).toContain('href="/search"');
  });

  it('keeps ReviewPreview free of aggregate-score output', () => {
    const source = readComponent('ReviewPreview');

    expect(source).not.toMatch(/averageScore|overallScore|aggregate/i);
  });

  it('resolves known topics and labels unknown topics defensively', () => {
    const labels = resolveTopicLabels(
      ['structural-biology', 'unknown-topic'],
      makeFixtureModel().topics,
    );

    expect(labels).toEqual([
      { slug: 'structural-biology', label: 'Structural biology', known: true },
      { slug: 'unknown-topic', label: 'Unknown Topic', known: false },
    ]);
  });

  it('defines all project statuses for status components', () => {
    expect(Object.keys(projectStatusMeta)).toEqual([
      'active',
      'validation',
      'exploratory',
      'speculative',
      'paused',
      'completed',
      'archived',
    ]);
  });
});
