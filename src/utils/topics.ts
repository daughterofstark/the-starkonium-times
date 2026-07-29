import type { ContentEntry } from './content';
import type { TopicData } from './content-schemas';
import { labelFromSlug } from './format';

export function resolveTopicLabels(
  slugs: string[],
  topics: ContentEntry<TopicData>[],
) {
  const topicMap = new Map(
    topics.map((topic) => [topic.data.slug, topic.data.label]),
  );
  return slugs.map((slug) => ({
    slug,
    label: topicMap.get(slug) ?? labelFromSlug(slug),
    known: topicMap.has(slug),
  }));
}
