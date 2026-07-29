import type { ProjectData } from './content-schemas';

export type ProjectStatus = ProjectData['status'];

export const projectStatusMeta = {
  active: {
    label: 'Active',
    glyph: '■',
    tone: 'accent',
  },
  validation: {
    label: 'Validation',
    glyph: '◧',
    tone: 'accent',
  },
  exploratory: {
    label: 'Exploratory',
    glyph: '□',
    tone: 'ink',
  },
  speculative: {
    label: 'Speculative',
    glyph: '◇',
    tone: 'muted',
  },
  paused: {
    label: 'Paused',
    glyph: '▬',
    tone: 'muted',
  },
  completed: {
    label: 'Completed',
    glyph: '■',
    tone: 'strong',
  },
  archived: {
    label: 'Archived',
    glyph: '▧',
    tone: 'quiet',
  },
} as const satisfies Record<
  ProjectStatus,
  {
    label: string;
    glyph: string;
    tone: 'accent' | 'ink' | 'muted' | 'strong' | 'quiet';
  }
>;
