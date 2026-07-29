export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatYear(date: Date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatList(items: string[]) {
  return new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  }).format(items);
}

export function labelFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
