import type { ContentEntry } from './content';
import { isPublished, slugFromEntry } from './content';
import type { ReviewData, WritingData } from './content-schemas';
import { labelFromSlug } from './format';

export type WritingFeedItem =
  | {
      type: 'writing';
      key: string;
      title: string;
      description: string;
      href: string;
      date: Date;
      kind: WritingData['kind'];
      label: string;
      volume: WritingData['volume'];
      entry: ContentEntry<WritingData>;
      featured: boolean;
    }
  | {
      type: 'review';
      key: string;
      title: string;
      description: string;
      href: string;
      date: Date;
      kind: 'review';
      label: 'Review';
      volume: 'two';
      entry: ContentEntry<ReviewData>;
      featured: boolean;
    };

export interface TocItem {
  depth: 2 | 3;
  id: string;
  text: string;
}

export function getWritingFeed(
  writing: ContentEntry<WritingData>[],
  reviews: ContentEntry<ReviewData>[],
) {
  return [
    ...writing.filter(isPublished).map(toWritingFeedItem),
    ...reviews.filter(isPublished).map(toReviewFeedItem),
  ].sort(compareFeedItems);
}

export function getFeaturedWriting(items: WritingFeedItem[], limit = 2) {
  return items.filter((item) => item.featured).slice(0, limit);
}

export function groupWritingByYear(items: WritingFeedItem[]) {
  const groups = new Map<string, WritingFeedItem[]>();

  for (const item of items) {
    const year = String(item.date.getUTCFullYear());
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }

  return Array.from(groups.entries()).map(([year, yearItems]) => ({
    year,
    items: yearItems,
  }));
}

export function getWritingKindOptions(items: WritingFeedItem[]) {
  const kinds = Array.from(new Set(items.map((item) => item.kind))).sort(
    (a, b) => getKindLabel(a).localeCompare(getKindLabel(b)),
  );

  return kinds.map((kind) => ({
    kind,
    label: getKindLabel(kind),
  }));
}

export function getReadingMinutes(body = '') {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function shouldShowReadingTime(minutes: number) {
  return minutes >= 3;
}

export function prepareProseHtml(html: string) {
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();
  const content = html.replace(
    /<h([23])>(.*?)<\/h\1>/g,
    (_match, depth: string, rawText: string) => {
      const text = stripTags(rawText).trim();
      const baseId = slugify(text) || 'section';
      const id = uniqueId(baseId, usedIds);
      toc.push({ depth: depth === '2' ? 2 : 3, id, text });
      return `<h${depth} id="${id}">${rawText}</h${depth}>`;
    },
  );

  return { html: content, toc };
}

export function getRelatedWriting(
  current: ContentEntry<WritingData>,
  entries: ContentEntry<WritingData>[],
  limit = 3,
) {
  return entries
    .filter((entry) => entry.id !== current.id)
    .filter(isPublished)
    .map((entry) => ({ entry, score: getRelatedScore(current, entry) }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        getWritingSortDate(b.entry).getTime() -
        getWritingSortDate(a.entry).getTime()
      );
    })
    .slice(0, limit)
    .map((candidate) => candidate.entry);
}

export function getSeriesNavigation(
  current: ContentEntry<WritingData>,
  entries: ContentEntry<WritingData>[],
) {
  if (!current.data.series) {
    return null;
  }

  const seriesEntries = entries
    .filter(isPublished)
    .filter((entry) => entry.data.series === current.data.series)
    .sort((a, b) => (a.data.seriesIndex ?? 0) - (b.data.seriesIndex ?? 0));
  const index = seriesEntries.findIndex((entry) => entry.id === current.id);

  if (index === -1) {
    return null;
  }

  return {
    previous: index > 0 ? seriesEntries[index - 1] : null,
    next: index < seriesEntries.length - 1 ? seriesEntries[index + 1] : null,
  };
}

function toWritingFeedItem(entry: ContentEntry<WritingData>): WritingFeedItem {
  return {
    type: 'writing',
    key: `writing:${slugFromEntry(entry)}`,
    title: entry.data.title,
    description: entry.data.standfirst,
    href: `/writing/${slugFromEntry(entry)}`,
    date: getWritingSortDate(entry),
    kind: entry.data.kind,
    label: getKindLabel(entry.data.kind),
    volume: entry.data.volume,
    entry,
    featured: entry.data.featured,
  };
}

function toReviewFeedItem(entry: ContentEntry<ReviewData>): WritingFeedItem {
  return {
    type: 'review',
    key: `review:${slugFromEntry(entry)}`,
    title: entry.data.paper.title,
    description: entry.data.verdictLine,
    href: `/reviews/${slugFromEntry(entry)}`,
    date: entry.data.reviewed,
    kind: 'review',
    label: 'Review',
    volume: 'two',
    entry,
    featured: entry.data.featured,
  };
}

function compareFeedItems(a: WritingFeedItem, b: WritingFeedItem) {
  const dateComparison = b.date.getTime() - a.date.getTime();
  if (dateComparison !== 0) return dateComparison;
  return a.title.localeCompare(b.title);
}

function getKindLabel(kind: WritingFeedItem['kind']) {
  return kind === 'review' ? 'Reviews' : labelFromSlug(kind);
}

function getWritingSortDate(entry: ContentEntry<WritingData>) {
  return entry.data.updated ?? entry.data.published;
}

function getRelatedScore(
  current: ContentEntry<WritingData>,
  candidate: ContentEntry<WritingData>,
) {
  let score = 0;

  if (current.data.series && current.data.series === candidate.data.series) {
    score += 3;
  }

  const candidateProjects = new Set(candidate.data.relatedProjects);
  for (const project of current.data.relatedProjects) {
    if (candidateProjects.has(project)) score += 2;
  }

  const candidateTopics = new Set(candidate.data.topics);
  for (const topic of current.data.topics) {
    if (candidateTopics.has(topic)) score += 1;
  }

  return score;
}

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, '');
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueId(baseId: string, usedIds: Set<string>) {
  let id = baseId;
  let index = 2;

  while (usedIds.has(id)) {
    id = `${baseId}-${index}`;
    index += 1;
  }

  usedIds.add(id);
  return id;
}
