import type {
  ExperienceData,
  NowData,
  PersonData,
  ProjectData,
  ReviewData,
  SeriesData,
  TopicData,
  WritingData,
} from './content-schemas';

export interface ContentEntry<TData> {
  id: string;
  data: TData;
  body?: string;
}

export interface ContentModel {
  topics: ContentEntry<TopicData>[];
  series: ContentEntry<SeriesData>[];
  people: ContentEntry<PersonData>[];
  projects: ContentEntry<ProjectData>[];
  writing: ContentEntry<WritingData>[];
  reviews: ContentEntry<ReviewData>[];
  experience: ContentEntry<ExperienceData>[];
  now: ContentEntry<NowData>[];
}

export function isPublished(entry: { data: { draft?: boolean } }) {
  return entry.data.draft !== true;
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function slugFromEntry(entry: { id: string }) {
  return entry.id.replace(/\.(md|mdx)$/i, '');
}

export function getTopicMap(topics: ContentEntry<TopicData>[]) {
  return new Map(topics.map((topic) => [topic.data.slug, topic.data]));
}

export function assertValidContentModel(model: ContentModel) {
  const errors: string[] = [];
  const topicMap = getTopicMap(model.topics);
  const projectSlugs = new Set(model.projects.map(slugFromEntry));
  const writingSlugs = new Set(model.writing.map(slugFromEntry));
  const seriesSlugs = new Set(model.series.map((entry) => entry.data.slug));
  const peopleIds = new Set(model.people.map((entry) => entry.data.id));

  validateUniqueIds('projects', model.projects, errors);
  validateUniqueIds('writing', model.writing, errors);
  validateUniqueIds('reviews', model.reviews, errors);
  validateUniqueIds('experience', model.experience, errors);

  for (const project of model.projects) {
    validateFieldTopic(
      project.data.field,
      topicMap,
      `project ${project.id}`,
      errors,
    );
    validateTopics(
      project.data.topics,
      topicMap,
      `project ${project.id}`,
      errors,
    );
    validateReferences(
      project.data.relatedWriting,
      writingSlugs,
      `project ${project.id} relatedWriting`,
      errors,
    );
    validateReferences(
      project.data.collaborators.map((collaborator) => collaborator.person),
      peopleIds,
      `project ${project.id} collaborators`,
      errors,
    );
    validateDuplicateUpdates(project, errors);
  }

  for (const writing of model.writing) {
    validateTopics(
      writing.data.topics,
      topicMap,
      `writing ${writing.id}`,
      errors,
    );
    validateReferences(
      writing.data.relatedProjects,
      projectSlugs,
      `writing ${writing.id} relatedProjects`,
      errors,
    );
    if (writing.data.series) {
      validateReferences(
        [writing.data.series],
        seriesSlugs,
        `writing ${writing.id} series`,
        errors,
      );
    }
  }

  for (const review of model.reviews) {
    validateFieldTopic(
      review.data.field,
      topicMap,
      `review ${review.id}`,
      errors,
    );
    validateTopics(review.data.topics, topicMap, `review ${review.id}`, errors);
    validateReferences(
      review.data.relatedProjects,
      projectSlugs,
      `review ${review.id} relatedProjects`,
      errors,
    );
    validateReviewBody(review, errors);
  }

  for (const entry of model.experience) {
    validateReferences(
      entry.data.relatedProjects,
      projectSlugs,
      `experience ${entry.id} relatedProjects`,
      errors,
    );
    if (entry.data.supervisor) {
      validateReferences(
        [entry.data.supervisor],
        peopleIds,
        `experience ${entry.id} supervisor`,
        errors,
      );
    }
  }

  for (const entry of model.now) {
    validateNowLocation(entry.data.location, `now ${entry.id}`, errors);
    if (entry.data.buildingProject) {
      validateReferences(
        [entry.data.buildingProject],
        projectSlugs,
        `now ${entry.id} buildingProject`,
        errors,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

function validateUniqueIds(
  collection: string,
  entries: ContentEntry<{ id: string }>[],
  errors: string[],
) {
  const seen = new Map<string, string>();
  for (const entry of entries) {
    const previous = seen.get(entry.data.id);
    if (previous) {
      errors.push(
        `Duplicate ${collection} id ${entry.data.id}: ${previous} and ${entry.id}.`,
      );
    }
    seen.set(entry.data.id, entry.id);
  }
}

function validateFieldTopic(
  slug: string,
  topicMap: Map<string, TopicData>,
  context: string,
  errors: string[],
) {
  const topic = topicMap.get(slug);
  if (!topic) {
    errors.push(`${context} field "${slug}" is not in topics.`);
    return;
  }
  if (topic.facet !== 'field') {
    errors.push(
      `${context} field "${slug}" must use a topic with facet "field".`,
    );
  }
}

function validateTopics(
  slugs: string[],
  topicMap: Map<string, TopicData>,
  context: string,
  errors: string[],
) {
  for (const slug of slugs) {
    if (!topicMap.has(slug)) {
      errors.push(`${context} references unknown topic "${slug}".`);
    }
  }
}

function validateReferences(
  slugs: string[],
  validSlugs: Set<string>,
  context: string,
  errors: string[],
) {
  for (const slug of slugs) {
    if (!validSlugs.has(slug)) {
      errors.push(`${context} references missing entry "${slug}".`);
    }
  }
}

function validateDuplicateUpdates(
  entry: ContentEntry<ProjectData>,
  errors: string[],
) {
  const seen = new Set<string>();
  for (const update of entry.data.updates) {
    const key = `${isoDate(update.date)}:${update.kind}:${update.summary}`;
    if (seen.has(key)) {
      errors.push(`project ${entry.id} has duplicate update ${key}.`);
    }
    seen.add(key);
  }
}

function validateReviewBody(entry: ContentEntry<ReviewData>, errors: string[]) {
  if (entry.body && !/^## Strongest contribution\b/m.test(entry.body)) {
    errors.push(
      `review ${entry.id} must include a "## Strongest contribution" heading.`,
    );
  }
}

export function validateNowLocation(
  location: string,
  context = 'now entry',
  errors: string[] = [],
) {
  const precisePattern =
    /\d|\b(street|road|lane|avenue|apt|flat|floor|block)\b/i;
  if (precisePattern.test(location)) {
    errors.push(`${context} location must be city/institution level only.`);
  }
  if (errors.length > 0 && context === 'now entry') {
    throw new Error(errors.join('\n'));
  }
}
