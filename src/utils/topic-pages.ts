import type { ContentEntry } from './content';
import { isPublished, slugFromEntry } from './content';
import type {
  ExperienceData,
  ProjectData,
  ReviewData,
  TopicData,
  WritingData,
} from './content-schemas';
import { getDerivedProjectFields } from './projects';

export type TopicReferenceType =
  'Projects' | 'Writing' | 'Reviews' | 'Experience';

export interface TopicReference {
  type: TopicReferenceType;
  title: string;
  href: string;
  date: Date;
  description?: string;
}

export interface TopicModel {
  projects: ContentEntry<ProjectData>[];
  writing: ContentEntry<WritingData>[];
  reviews: ContentEntry<ReviewData>[];
  experience: ContentEntry<ExperienceData>[];
}

export function groupTopicsByFacet(topics: ContentEntry<TopicData>[]) {
  const groups = new Map<TopicData['facet'], ContentEntry<TopicData>[]>();

  for (const topic of topics) {
    groups.set(topic.data.facet, [
      ...(groups.get(topic.data.facet) ?? []),
      topic,
    ]);
  }

  return Array.from(groups.entries())
    .map(([facet, entries]) => ({
      facet,
      entries: entries.sort((a, b) => a.data.label.localeCompare(b.data.label)),
    }))
    .sort((a, b) => facetOrder(a.facet) - facetOrder(b.facet));
}

export function getTopicReferences(slug: string, model: TopicModel) {
  const references: TopicReference[] = [
    ...model.projects
      .filter(isPublished)
      .filter((project) =>
        [project.data.field, ...project.data.topics].includes(slug),
      )
      .map((project) => ({
        type: 'Projects' as const,
        title: project.data.title,
        href: `/projects/${slugFromEntry(project)}`,
        date: getDerivedProjectFields(project).updatedAt,
        description: project.data.thesis,
      })),
    ...model.writing
      .filter(isPublished)
      .filter((entry) => entry.data.topics.includes(slug))
      .map((entry) => ({
        type: 'Writing' as const,
        title: entry.data.title,
        href: `/writing/${slugFromEntry(entry)}`,
        date: entry.data.updated ?? entry.data.published,
        description: entry.data.standfirst,
      })),
    ...model.reviews
      .filter(isPublished)
      .filter((entry) =>
        [entry.data.field, ...entry.data.topics].includes(slug),
      )
      .map((entry) => ({
        type: 'Reviews' as const,
        title: entry.data.paper.title,
        href: `/reviews/${slugFromEntry(entry)}`,
        date: entry.data.reviewed,
        description: entry.data.verdictLine,
      })),
    ...model.experience
      .filter(isPublished)
      .filter((entry) =>
        [...entry.data.methods, ...entry.data.tools].includes(slug),
      )
      .map((entry) => ({
        type: 'Experience' as const,
        title: `${entry.data.position} · ${entry.data.organisation}`,
        href: '/experience',
        date: entry.data.start,
        description: entry.data.context,
      })),
  ].sort(compareTopicReferences);

  return references;
}

export function groupTopicReferences(references: TopicReference[]) {
  const types: TopicReferenceType[] = [
    'Projects',
    'Writing',
    'Reviews',
    'Experience',
  ];

  return types.map((type) => ({
    type,
    entries: references.filter((reference) => reference.type === type),
  }));
}

export function getTopicCounts(
  topics: ContentEntry<TopicData>[],
  model: TopicModel,
) {
  return new Map(
    topics.map((topic) => [
      topic.data.slug,
      getTopicReferences(topic.data.slug, model).length,
    ]),
  );
}

function compareTopicReferences(a: TopicReference, b: TopicReference) {
  const dateComparison = b.date.getTime() - a.date.getTime();
  if (dateComparison !== 0) return dateComparison;
  return a.title.localeCompare(b.title);
}

function facetOrder(facet: TopicData['facet']) {
  return ['field', 'method', 'tool', 'theme'].indexOf(facet);
}
