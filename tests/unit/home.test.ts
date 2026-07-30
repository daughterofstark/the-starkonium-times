import { describe, expect, it } from 'vitest';

import {
  getLatestNow,
  getNowFreshness,
  selectHomepageProjects,
  selectLatestReview,
  selectLatestWriting,
} from '../../src/utils/home';
import { makeFixtureModel } from './content-fixtures';

describe('homepage selection utilities', () => {
  it('selects non-draft projects and caps the homepage list', () => {
    const model = makeFixtureModel();
    const projects = selectHomepageProjects(model.projects, 2);

    expect(projects).toHaveLength(2);
    expect(projects.map((project) => project.id)).toEqual([
      'comprehensive-project',
      'no-updates-project',
    ]);
    expect(projects.some((project) => project.data.draft)).toBe(false);
  });

  it('prefers featured projects before recently updated projects', () => {
    const model = makeFixtureModel();
    const featuredCandidate = model.projects.find(
      (project) => project.id === 'no-updates-project',
    );
    const recentCandidate = model.projects.find(
      (project) => project.id === 'comprehensive-project',
    );

    if (!featuredCandidate || !recentCandidate) {
      throw new Error('Expected project fixtures to exist.');
    }

    const [firstProject] = selectHomepageProjects([
      {
        ...featuredCandidate,
        data: { ...featuredCandidate.data, featured: true },
      },
      recentCandidate,
    ]);

    expect(firstProject?.id).toBe('no-updates-project');
  });

  it('selects only published writing in newest-first order', () => {
    const model = makeFixtureModel();
    const writing = selectLatestWriting(model.writing);

    expect(writing.map((entry) => entry.id)).toEqual(['short-note']);
  });

  it('selects the newest published review', () => {
    const model = makeFixtureModel();
    const review = selectLatestReview(model.reviews);

    expect(review?.id).toBe('complete-review');
  });

  it('selects the newest Now entry', () => {
    const model = makeFixtureModel();
    const now = getLatestNow(model.now);

    expect(now?.id).toBe('2026-07-09');
  });

  it('labels fresh and overdue Now entries without failing empty-state pages', () => {
    const model = makeFixtureModel();
    const now = getLatestNow(model.now);

    if (!now) {
      throw new Error('Expected Now fixture to exist.');
    }

    const freshness = getNowFreshness(
      now,
      new Date('2026-09-10T00:00:00.000Z'),
    );

    expect(freshness.daysSinceUpdate).toBe(63);
    expect(freshness.overdue).toBe(true);
    expect(freshness.label).toBe('Updated 63 days ago');
  });
});
