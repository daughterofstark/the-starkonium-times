import type { ContentEntry } from './content';
import { isPublished } from './content';
import type {
  ExperienceData,
  PersonData,
  ProjectData,
  TopicData,
} from './content-schemas';
import { formatDate } from './format';

export function selectExperienceEntries(
  entries: ContentEntry<ExperienceData>[],
) {
  return entries.filter(isPublished).sort(compareExperienceByStartDesc);
}

export function getExperienceDateRange(entry: ContentEntry<ExperienceData>) {
  const start = formatDate(entry.data.start);
  const end = entry.data.end ? formatDate(entry.data.end) : 'Present';
  return `${start} — ${end}`;
}

export function getExperienceYear(entry: ContentEntry<ExperienceData>) {
  return String(entry.data.start.getUTCFullYear());
}

export function getPersonName(
  id: string | undefined,
  people: ContentEntry<PersonData>[],
) {
  if (!id) return null;
  return people.find((person) => person.data.id === id)?.data.name ?? id;
}

export function getRelatedProjectTitles(
  slugs: string[],
  projects: ContentEntry<ProjectData>[],
) {
  return slugs
    .map((slug) => ({
      slug,
      title:
        projects.find((project) => project.id === slug)?.data.title ?? slug,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function resolveTopicOrText(
  slugs: string[],
  topics: ContentEntry<TopicData>[],
) {
  return slugs.map((slug) => {
    const topic = topics.find((entry) => entry.data.slug === slug);
    return topic?.data.label ?? slug;
  });
}

function compareExperienceByStartDesc(
  a: ContentEntry<ExperienceData>,
  b: ContentEntry<ExperienceData>,
) {
  const dateComparison = b.data.start.getTime() - a.data.start.getTime();
  if (dateComparison !== 0) return dateComparison;
  return a.data.organisation.localeCompare(b.data.organisation);
}
