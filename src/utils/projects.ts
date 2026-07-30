import type { ContentEntry } from './content';
import { isPublished, isoDate } from './content';
import type { ProjectData } from './content-schemas';

export function getDerivedProjectFields(project: ContentEntry<ProjectData>) {
  const floor = project.data.updated ?? project.data.started;
  const updatedAt = project.data.updates.reduce(
    (latest, update) => (update.date > latest ? update.date : latest),
    floor,
  );

  return {
    updatedAt,
    updatedIso: isoDate(updatedAt),
    updateCount: project.data.updates.length,
    revision: project.data.updates.length + 1,
    isCurrent:
      project.data.status === 'active' || project.data.status === 'validation',
  };
}

export function selectProjectIndexEntries(
  projects: ContentEntry<ProjectData>[],
) {
  return projects.filter(isPublished).sort(compareProjectsForIndex);
}

export function compareProjectsForIndex(
  a: ContentEntry<ProjectData>,
  b: ContentEntry<ProjectData>,
) {
  const updatedComparison =
    getDerivedProjectFields(b).updatedAt.getTime() -
    getDerivedProjectFields(a).updatedAt.getTime();

  if (updatedComparison !== 0) {
    return updatedComparison;
  }

  return a.data.title.localeCompare(b.data.title);
}
