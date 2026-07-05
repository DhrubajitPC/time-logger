import type { Category, Entry, RangeKey } from '../types';
import { toDateStr } from './format';

export const RANGE_DAYS: Record<RangeKey, number> = { today: 0, week: 6, month: 29 };

/** Categories sorted for display: ascending by `order`, newest (smallest) on
 *  top. Legacy docs without an order fall back to 0, keeping their input order
 *  (Array.prototype.sort is stable). */
export function sortCategories<T extends { order?: number }>(cats: T[]): T[] {
  return cats.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** The order value to assign a newly created category so it lands on top. */
export function nextTopOrder(cats: { order?: number }[]): number {
  return cats.reduce((m, c) => Math.min(m, c.order ?? 0), 0) - 1;
}

export function catMap(categories: Category[]): Record<string, Category> {
  const m: Record<string, Category> = {};
  for (const c of categories) m[c.id] = c;
  return m;
}

export function startOfDay(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function rangeStart(now: number, range: RangeKey): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - RANGE_DAYS[range]);
  return d.getTime();
}

export interface LegendItem {
  cat: Category;
  ms: number;
  pct: number;
}

export interface Stats {
  legend: LegendItem[];
  pieBg: string;
  grandMs: number;
}

export function computeStats(
  entries: Entry[],
  categories: Category[],
  now: number,
  range: RangeKey,
): Stats {
  const from = rangeStart(now, range);
  const inRange = entries.filter((e) => e.end > from);
  const totals: Record<string, number> = {};
  let grand = 0;
  for (const e of inRange) {
    const ms = e.end - e.start;
    totals[e.catId] = (totals[e.catId] || 0) + ms;
    grand += ms;
  }
  const legendData = categories
    .filter((c) => totals[c.id])
    .map((c) => ({ cat: c, ms: totals[c.id] }))
    .sort((a, b) => b.ms - a.ms);

  let acc = 0;
  const segs = legendData.map((l) => {
    const startPct = (acc / grand) * 100;
    acc += l.ms;
    const endPct = (acc / grand) * 100;
    return `${l.cat.color} ${startPct.toFixed(2)}% ${endPct.toFixed(2)}%`;
  });

  const legend: LegendItem[] = legendData.map((l) => ({
    ...l,
    pct: grand ? Math.round((l.ms / grand) * 100) : 0,
  }));

  return {
    legend,
    grandMs: grand,
    pieBg: segs.length ? `conic-gradient(${segs.join(', ')})` : '#F3EADF',
  };
}

export interface DayGroup {
  key: string;
  label: string;
  items: Entry[];
}

/** Entries in the selected range, before today, grouped by calendar day (newest first). */
export function historyByDay(
  entries: Entry[],
  now: number,
  range: RangeKey,
): DayGroup[] {
  const from = rangeStart(now, range);
  const today = startOfDay(now);
  const sorted = entries.slice().sort((a, b) => b.start - a.start);
  const groups: Record<string, Entry[]> = {};
  for (const e of sorted) {
    if (e.end > from && e.start < today) {
      const k = toDateStr(e.start);
      (groups[k] ||= []).push(e);
    }
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = toDateStr(yesterday.getTime());

  return Object.keys(groups)
    .sort()
    .reverse()
    .map((k) => {
      const dt = new Date(k + 'T12:00');
      const label =
        k === yKey
          ? 'Yesterday'
          : dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      return { key: k, label, items: groups[k] };
    });
}

export function todayEntries(entries: Entry[], now: number): Entry[] {
  const today = startOfDay(now);
  return entries
    .slice()
    .sort((a, b) => b.start - a.start)
    .filter((e) => e.start >= today);
}
