import type { ContentModel } from '../../src/utils/content';

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

export function makeFixtureModel(): ContentModel {
  return {
    topics: [
      {
        id: 'structural-biology',
        data: {
          slug: 'structural-biology',
          label: 'Structural biology',
          facet: 'field',
        },
      },
      {
        id: 'molecular-dynamics',
        data: {
          slug: 'molecular-dynamics',
          label: 'Molecular dynamics',
          facet: 'method',
        },
      },
      {
        id: 'pytorch',
        data: {
          slug: 'pytorch',
          label: 'PyTorch',
          facet: 'tool',
        },
      },
      {
        id: 'reproducibility',
        data: {
          slug: 'reproducibility',
          label: 'Reproducibility',
          facet: 'theme',
        },
      },
    ],
    series: [
      {
        id: 'fixture-series',
        data: {
          slug: 'fixture-series',
          title: 'Fixture Series',
          volume: 'two',
          status: 'active',
          ordered: true,
          description: 'A deliberately fake series used only by tests.',
        },
      },
    ],
    people: [
      {
        id: 'jane-fixture',
        data: {
          id: 'jane-fixture',
          name: 'Jane Fixture',
        },
      },
    ],
    projects: [
      {
        id: 'comprehensive-project',
        data: {
          id: 'PRJ-001',
          title: 'Comprehensive Fixture Project',
          thesis:
            'This fake project has enough shape to exercise schemas without claiming real research.',
          status: 'active',
          started: date('2026-01-01'),
          field: 'structural-biology',
          topics: ['molecular-dynamics', 'reproducibility'],
          type: 'research',
          updates: [
            {
              date: date('2026-07-09'),
              kind: 'result',
              summary:
                'Recorded a fake result for deterministic Ledger ordering.',
            },
          ],
          collaborators: [{ person: 'jane-fixture', role: 'collaborator' }],
          repositories: [],
          outputs: [],
          relatedWriting: ['short-note'],
          featured: false,
          draft: false,
        },
      },
      {
        id: 'no-updates-project',
        data: {
          id: 'PRJ-002',
          title: 'Sparse Fixture Project',
          thesis:
            'This fake project exists so an empty updates array can be tested safely.',
          status: 'exploratory',
          started: date('2026-02-01'),
          field: 'structural-biology',
          topics: [],
          type: 'research',
          updates: [],
          collaborators: [],
          repositories: [],
          outputs: [],
          relatedWriting: [],
          featured: false,
          draft: false,
        },
      },
      {
        id: 'draft-project',
        data: {
          id: 'PRJ-003',
          title: 'Draft Fixture Project',
          thesis:
            'This fake draft project proves draft updates stay out of published utilities.',
          status: 'active',
          started: date('2026-03-01'),
          field: 'structural-biology',
          topics: [],
          type: 'research',
          updates: [
            {
              date: date('2026-07-09'),
              kind: 'note',
              summary: 'Draft update should not appear in the public Ledger.',
            },
          ],
          collaborators: [],
          repositories: [],
          outputs: [],
          relatedWriting: [],
          featured: false,
          draft: true,
        },
      },
    ],
    writing: [
      {
        id: 'short-note',
        data: {
          id: 'WRT-001',
          title: 'Short Fixture Note',
          kind: 'short',
          published: date('2026-07-09'),
          standfirst:
            'This fake note validates published writing while avoiding real site content.',
          topics: ['reproducibility'],
          volume: 'two',
          relatedProjects: ['comprehensive-project'],
          revisions: [],
          featured: false,
          draft: false,
        },
      },
      {
        id: 'draft-note',
        data: {
          id: 'WRT-002',
          title: 'Draft Fixture Note',
          kind: 'note',
          published: date('2026-07-09'),
          standfirst:
            'This fake draft validates that unpublished writing is filtered consistently.',
          topics: ['reproducibility'],
          volume: 'two',
          relatedProjects: [],
          revisions: [],
          featured: false,
          draft: true,
        },
      },
    ],
    reviews: [
      {
        id: 'complete-review',
        body: '## Strongest contribution\n\nIt is useful as a fixture.',
        data: {
          id: 'REV-001',
          reviewed: date('2026-07-09'),
          paper: {
            title: 'Fixture Paper',
            authors: ['Alex Example'],
            year: 2026,
            codeUrl: null,
            dataUrl: null,
          },
          verdict: 'flawed-but-useful',
          verdictLine:
            'The fake review exists to validate review metadata safely.',
          field: 'structural-biology',
          assessment: {
            evidence: { score: 3, note: 'Evidence note for fixture.' },
            novelty: { score: 3, note: 'Novelty note for fixture.' },
            clarity: { score: 3, note: 'Clarity note for fixture.' },
            reproducibility: { score: 3, note: 'Reproducibility note.' },
            usefulness: { score: 3, note: 'Usefulness note for fixture.' },
          },
          topics: ['reproducibility'],
          relation: 'none',
          relatedProjects: ['comprehensive-project'],
          featured: false,
          draft: false,
        },
      },
    ],
    experience: [
      {
        id: 'current-role',
        data: {
          id: 'EXP-001',
          organisation: 'Example Institute',
          position: 'Fixture Assistant',
          start: date('2026-01-01'),
          end: null,
          location: 'Example City',
          context:
            'This fake role provides enough context text to validate the schema safely.',
          contribution:
            'This fake contribution provides enough detail to validate required experience prose.',
          methods: [],
          tools: [],
          outputs: [],
          presentations: [],
          skills: [],
          relatedProjects: ['comprehensive-project'],
          draft: false,
        },
      },
    ],
    now: [
      {
        id: '2026-07-09',
        data: {
          date: date('2026-07-09'),
          location: 'Example City · Example Institute',
          reading: [],
          recentlyDone: [],
          ledgerNote: 'Updated the fake Now entry for Ledger aggregation.',
        },
      },
      {
        id: '2026-05-01',
        data: {
          date: date('2026-05-01'),
          location: 'Example City · Example Institute',
          reading: [],
          recentlyDone: [],
        },
      },
    ],
  };
}
