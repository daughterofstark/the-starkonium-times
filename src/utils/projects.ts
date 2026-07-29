import type { ContentEntry } from './content';
import { isoDate } from './content';
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
