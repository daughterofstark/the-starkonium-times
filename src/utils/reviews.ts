import type { ContentEntry } from './content';
import { isPublished, slugFromEntry } from './content';
import type { ReviewData } from './content-schemas';
import { labelFromSlug } from './format';

export const requiredReviewSections = [
  'Verdict',
  'Central question',
  'Methods',
  'Main claims',
  'Strongest contribution',
  'Weaknesses',
  'Limitations',
  'Reproducibility',
  'What I learned',
  'Open questions',
  'What I would do next',
  'Overall assessment',
] as const;

export function selectReviewIndexEntries(reviews: ContentEntry<ReviewData>[]) {
  return reviews.filter(isPublished).sort(compareReviewsByDateDesc);
}

export function getReviewVerdictOptions(reviews: ContentEntry<ReviewData>[]) {
  return Array.from(new Set(reviews.map((review) => review.data.verdict)))
    .sort((a, b) => labelFromSlug(a).localeCompare(labelFromSlug(b)))
    .map((verdict) => ({ value: verdict, label: labelFromSlug(verdict) }));
}

export function getReviewFieldOptions(reviews: ContentEntry<ReviewData>[]) {
  return Array.from(new Set(reviews.map((review) => review.data.field))).sort();
}

export function getDoiHref(doi: string) {
  return `https://doi.org/${doi}`;
}

export function getReviewHref(review: ContentEntry<ReviewData>) {
  return `/reviews/${slugFromEntry(review)}`;
}

export function formatAuthors(authors: string[]) {
  if (authors.length <= 6) {
    return authors.join(', ');
  }

  return `${authors.slice(0, 6).join(', ')} et al.`;
}

export function getAvailability(review: ContentEntry<ReviewData>) {
  return {
    code: Boolean(review.data.paper.codeUrl),
    data: Boolean(review.data.paper.dataUrl),
  };
}

export function getMissingReviewSections(body = '') {
  return requiredReviewSections.filter(
    (section) =>
      !new RegExp(`^##\\s+${escapeRegExp(section)}\\b`, 'm').test(body),
  );
}

export function splitReviewHtmlSections(html: string) {
  const sections = new Map<string, string>();
  const matches = Array.from(html.matchAll(/<h2 id="([^"]+)">.*?<\/h2>/g));

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const next = matches[index + 1];
    if (match?.index === undefined || !match[1]) continue;

    sections.set(match[1], html.slice(match.index, next?.index ?? html.length));
  }

  return {
    verdict: sections.get('verdict') ?? '',
    remaining: matches
      .filter((match) => match[1] !== 'verdict')
      .map((match) => sections.get(match[1] ?? '') ?? '')
      .join(''),
  };
}

function compareReviewsByDateDesc(
  a: ContentEntry<ReviewData>,
  b: ContentEntry<ReviewData>,
) {
  const dateComparison = b.data.reviewed.getTime() - a.data.reviewed.getTime();
  if (dateComparison !== 0) return dateComparison;
  return a.data.paper.title.localeCompare(b.data.paper.title);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
