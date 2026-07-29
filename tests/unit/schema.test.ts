import { describe, expect, it } from 'vitest';

import {
  assertValidContentModel,
  isPublished,
  validateNowLocation,
} from '../../src/utils/content';
import {
  assessmentDimensionSchema,
  projectSchema,
  projectUpdateSchema,
  reviewSchema,
  writingSchema,
} from '../../src/utils/content-schemas';
import { getDerivedProjectFields } from '../../src/utils/projects';
import { makeFixtureModel } from './content-fixtures';

function first<T>(items: T[]) {
  const item = items[0];
  if (!item) throw new Error('Expected fixture item.');
  return item;
}

function second<T>(items: T[]) {
  const item = items[1];
  if (!item) throw new Error('Expected second fixture item.');
  return item;
}

describe('content schemas and relationship validation', () => {
  it('accepts the valid fixture model', () => {
    expect(() => assertValidContentModel(makeFixtureModel())).not.toThrow();
  });

  it('rejects unknown topics', () => {
    const model = makeFixtureModel();
    first(model.projects).data.topics.push('unknown-topic');

    expect(() => assertValidContentModel(model)).toThrow(/unknown topic/);
  });

  it('requires project field to use a field topic', () => {
    const model = makeFixtureModel();
    first(model.projects).data.field = 'molecular-dynamics';

    expect(() => assertValidContentModel(model)).toThrow(/facet "field"/);
  });

  it('detects duplicate IDs within a collection', () => {
    const model = makeFixtureModel();
    second(model.projects).data.id = first(model.projects).data.id;

    expect(() => assertValidContentModel(model)).toThrow(
      /Duplicate projects id/,
    );
  });

  it('rejects malformed project IDs and short theses', () => {
    const valid = first(makeFixtureModel().projects).data;

    expect(projectSchema.safeParse({ ...valid, id: 'PROJECT-1' }).success).toBe(
      false,
    );
    expect(
      projectSchema.safeParse({ ...valid, thesis: 'Too short.' }).success,
    ).toBe(false);
  });

  it('requires paused updates to explain the pause', () => {
    expect(
      projectUpdateSchema.safeParse({
        date: '2026-07-09',
        kind: 'paused',
        summary: 'Paused.',
      }).success,
    ).toBe(false);
  });

  it('uses one shared draft filtering helper', () => {
    const model = makeFixtureModel();

    expect(
      model.projects.filter(isPublished).map((entry) => entry.id),
    ).not.toContain('draft-project');
  });

  it('derives updatedAt from project updates', () => {
    const project = first(makeFixtureModel().projects);

    expect(getDerivedProjectFields(project).updatedIso).toBe('2026-07-09');
  });

  it('requires Volume I writing to include originalUrl', () => {
    const valid = first(makeFixtureModel().writing).data;

    expect(
      writingSchema.safeParse({
        ...valid,
        volume: 'one',
        originalUrl: undefined,
      }).success,
    ).toBe(false);
  });

  it('requires series writing to include seriesIndex', () => {
    const valid = first(makeFixtureModel().writing).data;

    expect(
      writingSchema.safeParse({
        ...valid,
        series: 'fixture-series',
        seriesIndex: undefined,
      }).success,
    ).toBe(false);
  });

  it('requires review assessment dimensions to carry notes', () => {
    expect(assessmentDimensionSchema.safeParse({ score: 4 }).success).toBe(
      false,
    );
  });

  it('rejects aggregate review score fields', () => {
    const valid = first(makeFixtureModel().reviews).data;

    expect(
      reviewSchema.safeParse({
        ...valid,
        averageScore: 3,
      }).success,
    ).toBe(false);
  });

  it('requires the Strongest contribution heading in review bodies', () => {
    const model = makeFixtureModel();
    first(model.reviews).body = '## Limits\n\nOnly a fixture.';

    expect(() => assertValidContentModel(model)).toThrow(
      /Strongest contribution/,
    );
  });

  it('rejects overly precise Now locations', () => {
    expect(() => validateNowLocation('Example City · 12 Example Road')).toThrow(
      /city\/institution/,
    );
  });

  it('detects broken slug references', () => {
    const model = makeFixtureModel();
    first(model.writing).data.relatedProjects = ['missing-project'];

    expect(() => assertValidContentModel(model)).toThrow(/missing entry/);
  });
});
