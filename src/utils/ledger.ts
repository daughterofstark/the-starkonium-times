import type { ContentEntry, ContentModel } from './content';
import { isPublished, isoDate, slugFromEntry } from './content';
import type {
  NowData,
  ProjectData,
  ReviewData,
  WritingData,
} from './content-schemas';

export type LedgerEntry = {
  key: string;
  date: Date;
  type: 'update' | 'article' | 'review' | 'now';
  tag: string;
  projectId?: string;
  projectSlug?: string;
  projectTitle?: string;
  summary: string;
  href: string;
};

export type LedgerSource = Pick<
  ContentModel,
  'projects' | 'writing' | 'reviews' | 'now'
>;

export interface LedgerOptions {
  limit?: number;
  types?: LedgerEntry['type'][];
  projectSlug?: string;
  since?: Date;
}

const typePriority: Record<LedgerEntry['type'], number> = {
  article: 0,
  review: 1,
  update: 2,
  now: 3,
};

const updateTags = {
  built: 'UPD',
  result: 'RES',
  validated: 'VAL',
  replan: 'PLN',
  fixed: 'FIX',
  paused: 'PSE',
  resumed: 'RSM',
  submitted: 'SUB',
  published: 'PUB',
  note: 'NTE',
} as const satisfies Record<ProjectData['updates'][number]['kind'], string>;

const writingTags = {
  essay: 'ESS',
  explainer: 'EXP',
  note: 'NTE',
  reflection: 'REF',
  literature: 'LIT',
  personal: 'PER',
  short: 'SHT',
} as const satisfies Record<WritingData['kind'], string>;

export function getLedger(source: LedgerSource, opts: LedgerOptions = {}) {
  const entries = [
    ...projectUpdateEntries(source.projects),
    ...writingEntries(source.writing),
    ...reviewEntries(source.reviews),
    ...nowEntries(source.now),
  ]
    .filter((entry) => (opts.types ? opts.types.includes(entry.type) : true))
    .filter((entry) =>
      opts.projectSlug ? entry.projectSlug === opts.projectSlug : true,
    )
    .filter((entry) => (opts.since ? entry.date >= opts.since : true))
    .sort(compareLedgerEntries);

  return opts.limit ? entries.slice(0, opts.limit) : entries;
}

function projectUpdateEntries(
  projects: ContentEntry<ProjectData>[],
): LedgerEntry[] {
  return projects.flatMap((project) => {
    if (!isPublished(project)) {
      return [];
    }

    const slug = slugFromEntry(project);
    return project.data.updates.map((update) => ({
      key: makeLedgerKey('update', slug, update.date, update.summary),
      date: update.date,
      type: 'update',
      tag: updateTags[update.kind],
      projectId: project.data.id,
      projectSlug: slug,
      projectTitle: project.data.title,
      summary: update.summary,
      href: `/projects/${slug}#updates`,
    }));
  });
}

function writingEntries(entries: ContentEntry<WritingData>[]): LedgerEntry[] {
  return entries.filter(isPublished).map((entry) => {
    const slug = slugFromEntry(entry);
    return {
      key: makeLedgerKey(
        'article',
        slug,
        entry.data.published,
        entry.data.title,
      ),
      date: entry.data.published,
      type: 'article',
      tag: writingTags[entry.data.kind],
      summary: entry.data.title,
      href: `/writing/${slug}`,
    };
  });
}

function reviewEntries(entries: ContentEntry<ReviewData>[]): LedgerEntry[] {
  return entries.filter(isPublished).map((entry) => {
    const slug = slugFromEntry(entry);
    return {
      key: makeLedgerKey(
        'review',
        slug,
        entry.data.reviewed,
        entry.data.verdictLine,
      ),
      date: entry.data.reviewed,
      type: 'review',
      tag: 'REV',
      summary: entry.data.verdictLine,
      href: `/reviews/${slug}`,
    };
  });
}

function nowEntries(entries: ContentEntry<NowData>[]): LedgerEntry[] {
  return entries
    .filter((entry) => Boolean(entry.data.ledgerNote))
    .map((entry) => ({
      key: makeLedgerKey(
        'now',
        slugFromEntry(entry),
        entry.data.date,
        entry.data.ledgerNote ?? '',
      ),
      date: entry.data.date,
      type: 'now',
      tag: 'NOW',
      summary: entry.data.ledgerNote ?? '',
      href: '/now',
    }));
}

function compareLedgerEntries(a: LedgerEntry, b: LedgerEntry) {
  const dateComparison = b.date.getTime() - a.date.getTime();
  if (dateComparison !== 0) return dateComparison;

  const typeComparison = typePriority[a.type] - typePriority[b.type];
  if (typeComparison !== 0) return typeComparison;

  const projectComparison = (a.projectId ?? 'ZZZ').localeCompare(
    b.projectId ?? 'ZZZ',
  );
  if (projectComparison !== 0) return projectComparison;

  return a.key.localeCompare(b.key);
}

function makeLedgerKey(
  type: LedgerEntry['type'],
  slugOrId: string,
  date: Date,
  summary: string,
) {
  return `${type}:${slugOrId}:${isoDate(date)}:${hash8(summary)}`;
}

function hash8(input: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 8);
}
