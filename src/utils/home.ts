import type { ContentEntry } from './content';
import { isPublished } from './content';
import type {
  NowData,
  ProjectData,
  ReviewData,
  WritingData,
} from './content-schemas';
import { getDerivedProjectFields } from './projects';

const dayMs = 24 * 60 * 60 * 1000;
const nowOverdueDays = 60;

export interface NowFreshness {
  daysSinceUpdate: number;
  overdue: boolean;
  label: string;
}

export function selectHomepageProjects(
  projects: ContentEntry<ProjectData>[],
  limit = 4,
) {
  const published = projects.filter(isPublished);
  const featured = published
    .filter((project) => project.data.featured)
    .sort(compareProjectsByUpdatedDesc);
  const featuredIds = new Set(featured.map((project) => project.id));
  const remaining = published
    .filter((project) => !featuredIds.has(project.id))
    .sort(compareProjectsByUpdatedDesc);

  return [...featured, ...remaining].slice(0, limit);
}

export function selectLatestWriting(
  writing: ContentEntry<WritingData>[],
  limit = 3,
) {
  return writing
    .filter(isPublished)
    .sort(compareWritingByDateDesc)
    .slice(0, limit);
}

export function selectLatestReview(reviews: ContentEntry<ReviewData>[]) {
  return reviews.filter(isPublished).sort(compareReviewsByDateDesc)[0] ?? null;
}

export function getLatestNow(entries: ContentEntry<NowData>[]) {
  return [...entries].sort(compareNowByDateDesc)[0] ?? null;
}

export function getNowFreshness(
  entry: ContentEntry<NowData>,
  referenceDate = new Date(),
): NowFreshness {
  const daysSinceUpdate = Math.max(
    0,
    Math.floor(
      (startOfUtcDay(referenceDate) - startOfUtcDay(entry.data.date)) / dayMs,
    ),
  );

  return {
    daysSinceUpdate,
    overdue: daysSinceUpdate > nowOverdueDays,
    label:
      daysSinceUpdate === 0
        ? 'Updated today'
        : `Updated ${daysSinceUpdate} day${daysSinceUpdate === 1 ? '' : 's'} ago`,
  };
}

function compareProjectsByUpdatedDesc(
  a: ContentEntry<ProjectData>,
  b: ContentEntry<ProjectData>,
) {
  return (
    getDerivedProjectFields(b).updatedAt.getTime() -
    getDerivedProjectFields(a).updatedAt.getTime()
  );
}

function compareWritingByDateDesc(
  a: ContentEntry<WritingData>,
  b: ContentEntry<WritingData>,
) {
  return getWritingSortDate(b).getTime() - getWritingSortDate(a).getTime();
}

function compareReviewsByDateDesc(
  a: ContentEntry<ReviewData>,
  b: ContentEntry<ReviewData>,
) {
  return b.data.reviewed.getTime() - a.data.reviewed.getTime();
}

function compareNowByDateDesc(
  a: ContentEntry<NowData>,
  b: ContentEntry<NowData>,
) {
  return b.data.date.getTime() - a.data.date.getTime();
}

function getWritingSortDate(entry: ContentEntry<WritingData>) {
  return entry.data.updated ?? entry.data.published;
}

function startOfUtcDay(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
