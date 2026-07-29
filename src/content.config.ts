import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';

import {
  experienceSchema,
  nowSchema,
  personSchema,
  projectSchema,
  reviewSchema,
  seriesSchema,
  topicSchema,
  writingSchema,
} from './utils/content-schemas';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: projectSchema,
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: writingSchema,
});

const reviews = defineCollection({
  loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
  schema: reviewSchema,
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: experienceSchema,
});

const now = defineCollection({
  loader: glob({ base: './src/content/now', pattern: '*.md' }),
  schema: nowSchema,
});

const topics = defineCollection({
  loader: file('src/content/topics.yaml'),
  schema: topicSchema,
});

const series = defineCollection({
  loader: file('src/content/series.yaml'),
  schema: seriesSchema,
});

const people = defineCollection({
  loader: file('src/content/people.yaml'),
  schema: personSchema,
});

export const collections = {
  projects,
  writing,
  reviews,
  experience,
  now,
  topics,
  series,
  people,
};
