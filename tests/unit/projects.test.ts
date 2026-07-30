import { describe, expect, it } from 'vitest';

import { selectProjectIndexEntries } from '../../src/utils/projects';
import { makeFixtureModel } from './content-fixtures';

describe('project utilities', () => {
  it('selects non-draft projects for the public project index', () => {
    const model = makeFixtureModel();
    const projects = selectProjectIndexEntries(model.projects);

    expect(projects.map((project) => project.id)).not.toContain(
      'draft-project',
    );
  });

  it('sorts public projects by derived update date, then title', () => {
    const model = makeFixtureModel();
    const projects = selectProjectIndexEntries([
      {
        id: 'z-project',
        data: {
          ...model.projects[1]!.data,
          id: 'PRJ-101',
          title: 'Z Project',
          started: new Date('2026-01-01T00:00:00.000Z'),
          updated: new Date('2026-05-01T00:00:00.000Z'),
          draft: false,
        },
      },
      {
        id: 'a-project',
        data: {
          ...model.projects[1]!.data,
          id: 'PRJ-102',
          title: 'A Project',
          started: new Date('2026-01-01T00:00:00.000Z'),
          updated: new Date('2026-05-01T00:00:00.000Z'),
          draft: false,
        },
      },
      model.projects[0]!,
    ]);

    expect(projects.map((project) => project.id)).toEqual([
      'comprehensive-project',
      'a-project',
      'z-project',
    ]);
  });
});
