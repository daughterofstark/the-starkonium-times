import { z } from 'astro/zod';

export const projectStatuses = [
  'active',
  'validation',
  'exploratory',
  'speculative',
  'paused',
  'completed',
  'archived',
] as const;

export const updateKinds = [
  'built',
  'result',
  'validated',
  'replan',
  'fixed',
  'paused',
  'resumed',
  'submitted',
  'published',
  'note',
] as const;

export const writingKinds = [
  'essay',
  'explainer',
  'note',
  'reflection',
  'literature',
  'personal',
  'short',
] as const;

export const topicFacets = ['field', 'method', 'tool', 'theme'] as const;

export const topicSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(2).max(80),
  facet: z.enum(topicFacets),
  description: z.string().max(240).optional(),
});

export const seriesSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3).max(100),
  volume: z.enum(['one', 'two']),
  status: z.enum(['active', 'complete', 'paused', 'abandoned']),
  ordered: z.boolean().default(true),
  description: z.string().min(20).max(320),
});

export const personSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(2).max(100),
  affiliation: z.string().max(140).optional(),
  role: z.string().max(140).optional(),
  url: z.string().url().optional(),
  orcid: z
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/)
    .optional(),
});

export const projectUpdateSchema = z
  .object({
    date: z.coerce.date(),
    kind: z.enum(updateKinds),
    summary: z.string().min(10).max(200),
    link: z.string().url().optional(),
  })
  .refine((update) => update.kind !== 'paused' || update.summary.length >= 20, {
    message: 'A paused update must record why with at least 20 characters.',
  });

export const outputSchema = z.object({
  kind: z.enum([
    'preprint',
    'paper',
    'poster',
    'talk',
    'dataset',
    'package',
    'thesis',
  ]),
  title: z.string().min(3).max(160),
  venue: z.string().max(120).optional(),
  date: z.coerce.date().optional(),
  doi: z.string().optional(),
  url: z.string().url().optional(),
});

export const projectSchema = z.object({
  id: z.string().regex(/^PRJ-\d{3}$/),
  title: z.string().min(3).max(90),
  thesis: z.string().min(40).max(320),
  status: z.enum(projectStatuses),
  started: z.coerce.date(),
  field: z.string(),
  updated: z.coerce.date().optional(),
  topics: z.array(z.string()).default([]),
  type: z
    .enum([
      'research',
      'software',
      'analysis',
      'writing',
      'teaching',
      'experiment',
    ])
    .default('research'),
  updates: z.array(projectUpdateSchema).default([]),
  collaborators: z
    .array(
      z.object({
        person: z.string(),
        role: z.enum([
          'supervisor',
          'collaborator',
          'co-author',
          'advisor',
          'student',
        ]),
      }),
    )
    .default([]),
  repositories: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        description: z.string().max(140).optional(),
        language: z.string().optional(),
        license: z.string().optional(),
      }),
    )
    .default([]),
  outputs: z.array(outputSchema).default([]),
  relatedWriting: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export const writingSchema = z
  .object({
    id: z.string().regex(/^WRT-\d{3}$/),
    title: z.string().min(3).max(110),
    kind: z.enum(writingKinds),
    published: z.coerce.date(),
    standfirst: z.string().min(60).max(280),
    topics: z.array(z.string()).min(1),
    updated: z.coerce.date().optional(),
    volume: z.enum(['one', 'two']).default('two'),
    series: z.string().optional(),
    seriesIndex: z.number().int().positive().optional(),
    relatedProjects: z.array(z.string()).default([]),
    revisions: z
      .array(
        z.object({
          date: z.coerce.date(),
          note: z.string().max(200),
        }),
      )
      .default([]),
    originalUrl: z.string().url().optional(),
    seoTitle: z.string().max(60).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .refine((entry) => !entry.series || entry.seriesIndex !== undefined, {
    message: 'A piece in a series must declare its seriesIndex.',
  })
  .refine((entry) => entry.volume !== 'one' || Boolean(entry.originalUrl), {
    message: 'Volume I posts must record their originalUrl.',
  });

export const assessmentDimensionSchema = z.object({
  score: z.number().int().min(1).max(5),
  note: z.string().min(10).max(160),
});

export const reviewSchema = z
  .object({
    id: z.string().regex(/^REV-\d{3}$/),
    reviewed: z.coerce.date(),
    paper: z.object({
      title: z.string().min(3),
      authors: z.array(z.string()).min(1),
      year: z.number().int().min(1900).max(2100),
      journal: z.string().optional(),
      volume: z.string().optional(),
      pages: z.string().optional(),
      doi: z
        .string()
        .regex(/^10\.\d{4,9}\/\S+$/)
        .optional(),
      preprintUrl: z.string().url().optional(),
      codeUrl: z.string().url().nullable().default(null),
      dataUrl: z.string().url().nullable().default(null),
    }),
    verdict: z.enum([
      'convincing',
      'partly-convincing',
      'interesting-but-unconvincing',
      'not-convincing',
      'important',
      'flawed-but-useful',
    ]),
    verdictLine: z.string().min(40).max(160),
    field: z.string(),
    assessment: z.object({
      evidence: assessmentDimensionSchema,
      novelty: assessmentDimensionSchema,
      clarity: assessmentDimensionSchema,
      reproducibility: assessmentDimensionSchema,
      usefulness: assessmentDimensionSchema,
    }),
    topics: z.array(z.string()).default([]),
    reproduction: z
      .object({
        attempted: z.boolean(),
        outcome: z.enum(['reproduced', 'partial', 'failed', 'not-attempted']),
        note: z.string().max(400).optional(),
      })
      .optional(),
    relation: z
      .enum(['none', 'cited-by-me', 'competing', 'collaborators'])
      .default('none'),
    relatedProjects: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .strict();

export const experienceSchema = z.object({
  id: z.string().regex(/^EXP-\d{3}$/),
  organisation: z.string().min(2).max(120),
  position: z.string().min(2).max(120),
  start: z.coerce.date(),
  end: z.coerce.date().nullable().default(null),
  location: z.string().min(2).max(120),
  context: z.string().min(80).max(600),
  contribution: z.string().min(80),
  group: z.string().optional(),
  supervisor: z.string().optional(),
  methods: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  outputs: z.array(outputSchema).default([]),
  presentations: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  lessons: z.string().optional(),
  relatedProjects: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const nowSchema = z.object({
  date: z.coerce.date(),
  location: z.string().min(2).max(120),
  building: z.string().optional(),
  buildingProject: z.string().optional(),
  investigating: z.string().optional(),
  writing: z.string().optional(),
  reading: z.array(z.string()).default([]),
  learning: z.string().optional(),
  recentlyDone: z
    .array(
      z.object({
        text: z.string(),
        date: z.coerce.date(),
      }),
    )
    .default([]),
  thinkingAbout: z.string().optional(),
  ledgerNote: z.string().max(120).optional(),
});

export type ProjectData = z.infer<typeof projectSchema>;
export type WritingData = z.infer<typeof writingSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type NowData = z.infer<typeof nowSchema>;
export type TopicData = z.infer<typeof topicSchema>;
export type SeriesData = z.infer<typeof seriesSchema>;
export type PersonData = z.infer<typeof personSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
