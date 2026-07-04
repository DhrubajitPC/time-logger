import { describe, it, expect } from 'vitest';
import {
  computeStats,
  historyByDay,
  todayEntries,
  rangeStart,
  startOfDay,
  catMap,
} from './derive';
import type { Category, Entry } from '../types';

const H = 3600000;
const M = 60000;

const cats: Category[] = [
  { id: 'work', name: 'Work', color: '#F5A623', tint: '#FFE3A3' },
  { id: 'exercise', name: 'Exercise', color: '#34B76F', tint: '#C9F0D8' },
  { id: 'reading', name: 'Reading', color: '#5B6CFF', tint: '#D7DCFF' },
];

// Fixed "now": Mon Jun 15 2026, 12:00 local.
const NOW = new Date(2026, 5, 15, 12, 0, 0).getTime();
const at = (dayOffset: number, h: number, m: number) =>
  new Date(2026, 5, 15 - dayOffset, h, m, 0).getTime();

const entries: Entry[] = [
  { id: 'e1', catId: 'work', start: at(0, 9, 0), end: at(0, 10, 0) }, // today 1h
  { id: 'e2', catId: 'exercise', start: at(0, 10, 30), end: at(0, 11, 0) }, // today 30m
  { id: 'e3', catId: 'work', start: at(1, 9, 0), end: at(1, 11, 0) }, // yesterday 2h
  { id: 'e4', catId: 'reading', start: at(10, 9, 0), end: at(10, 10, 0) }, // 10 days ago 1h
];

describe('startOfDay / rangeStart', () => {
  it('startOfDay zeroes the time', () => {
    expect(startOfDay(NOW)).toBe(new Date(2026, 5, 15, 0, 0, 0).getTime());
  });
  it('rangeStart(week) goes back 6 days', () => {
    expect(rangeStart(NOW, 'week')).toBe(new Date(2026, 5, 9, 0, 0, 0).getTime());
  });
  it('rangeStart(today) is start of today', () => {
    expect(rangeStart(NOW, 'today')).toBe(startOfDay(NOW));
  });
});

describe('catMap', () => {
  it('indexes categories by id', () => {
    expect(catMap(cats).exercise.name).toBe('Exercise');
  });
});

describe('computeStats', () => {
  it('totals only today for the today range', () => {
    const s = computeStats(entries, cats, NOW, 'today');
    expect(s.grandMs).toBe(H + 30 * M);
    expect(s.legend.map((l) => l.cat.id)).toEqual(['work', 'exercise']); // sorted desc
    expect(s.legend[0].pct).toBe(67); // 1h / 1.5h
    expect(s.legend[1].pct).toBe(33);
    expect(s.pieBg.startsWith('conic-gradient(')).toBe(true);
  });

  it('aggregates the week and merges same-category time', () => {
    const s = computeStats(entries, cats, NOW, 'week');
    expect(s.grandMs).toBe(3 * H + 30 * M); // e1+e2+e3, e4 excluded
    expect(s.legend[0].cat.id).toBe('work');
    expect(s.legend[0].ms).toBe(3 * H); // 1h today + 2h yesterday
    expect(s.legend[0].pct).toBe(86); // 3/3.5
    expect(s.legend[1].pct).toBe(14);
  });

  it('returns an empty pie when nothing is in range', () => {
    const s = computeStats([], cats, NOW, 'today');
    expect(s.grandMs).toBe(0);
    expect(s.legend).toHaveLength(0);
    expect(s.pieBg).toBe('#F3EADF');
  });
});

describe('historyByDay', () => {
  it('groups pre-today entries in range and labels yesterday', () => {
    const days = historyByDay(entries, NOW, 'week');
    expect(days).toHaveLength(1); // only yesterday's e3 (today excluded, e4 out of range)
    expect(days[0].label).toBe('Yesterday');
    expect(days[0].items.map((e) => e.id)).toEqual(['e3']);
  });

  it('excludes today entries', () => {
    const days = historyByDay(entries, NOW, 'today');
    expect(days).toHaveLength(0);
  });
});

describe('todayEntries', () => {
  it('returns today entries newest-first', () => {
    const list = todayEntries(entries, NOW);
    expect(list.map((e) => e.id)).toEqual(['e2', 'e1']); // 10:30 before 9:00
  });
});
