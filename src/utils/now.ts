import type { ContentEntry } from './content';
import type { NowData } from './content-schemas';
import { formatDate } from './format';
import { getLatestNow, getNowFreshness } from './home';

export type NowRow = {
  label: string;
  value: string[];
  type: 'chips';
};

export function selectCurrentNow(entries: ContentEntry<NowData>[]) {
  return getLatestNow(entries);
}

export function getNowHeaderMeta(
  entry: ContentEntry<NowData>,
  referenceDate = new Date(),
) {
  const freshness = getNowFreshness(entry, referenceDate);

  return {
    updated: formatDate(entry.data.date),
    freshness,
    text: `updated ${formatDate(entry.data.date)} · ${
      freshness.daysSinceUpdate === 0
        ? 'today'
        : `${freshness.daysSinceUpdate} day${
            freshness.daysSinceUpdate === 1 ? '' : 's'
          } ago`
    }${freshness.overdue ? ' · overdue' : ''}`,
  };
}

export function getNowRows(entry: ContentEntry<NowData>): NowRow[] {
  const rows: NowRow[] = [];

  pushRow(rows, 'Building', entry.data.building);
  pushRow(rows, 'Investigating', entry.data.investigating);
  pushRow(rows, 'Writing', entry.data.writing);
  pushRow(rows, 'Reading', entry.data.reading);
  pushRow(rows, 'Learning', entry.data.learning);
  pushRow(
    rows,
    'Recently done',
    entry.data.recentlyDone.map(
      (item) => `${item.text} (${formatDate(item.date)})`,
    ),
  );
  pushRow(rows, 'Thinking about', entry.data.thinkingAbout);
  pushRow(rows, 'Location', entry.data.location);

  return rows;
}

function pushRow(rows: NowRow[], label: string, value?: string | string[]) {
  const values = Array.isArray(value)
    ? value.filter(Boolean)
    : value
      ? [value]
      : [];

  if (values.length > 0) {
    rows.push({ label, value: values, type: 'chips' });
  }
}
