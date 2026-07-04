import { describe, it, expect } from 'vitest';
import {
  fmtClock,
  fmtDur,
  fmtTimer,
  toDateStr,
  toTimeStr,
  type TimeSettings,
} from './format';

const H = 3600000;
const M = 60000;

const s12: TimeSettings = { timeFormat: '12h', showSeconds: true };
const s24: TimeSettings = { timeFormat: '24h', showSeconds: true };

describe('fmtDur', () => {
  it('formats minutes only', () => {
    expect(fmtDur(30 * M)).toBe('30m');
  });
  it('formats whole hours', () => {
    expect(fmtDur(2 * H)).toBe('2h');
  });
  it('formats hours and minutes', () => {
    expect(fmtDur(H + 30 * M)).toBe('1h 30m');
  });
  it('rounds to the nearest minute', () => {
    expect(fmtDur(89 * 1000)).toBe('1m'); // 89s → 1.48m → 1m
    expect(fmtDur(0)).toBe('0m');
  });
  it('clamps negative durations to 0m', () => {
    expect(fmtDur(-5000)).toBe('0m');
  });
});

describe('fmtClock', () => {
  it('formats 12h with am/pm', () => {
    expect(fmtClock(new Date(2026, 0, 1, 9, 5).getTime(), s12)).toBe('9:05a');
    expect(fmtClock(new Date(2026, 0, 1, 13, 5).getTime(), s12)).toBe('1:05p');
  });
  it('handles midnight and noon in 12h', () => {
    expect(fmtClock(new Date(2026, 0, 1, 0, 0).getTime(), s12)).toBe('12:00a');
    expect(fmtClock(new Date(2026, 0, 1, 12, 0).getTime(), s12)).toBe('12:00p');
  });
  it('formats 24h', () => {
    expect(fmtClock(new Date(2026, 0, 1, 9, 5).getTime(), s24)).toBe('9:05');
    expect(fmtClock(new Date(2026, 0, 1, 13, 5).getTime(), s24)).toBe('13:05');
    expect(fmtClock(new Date(2026, 0, 1, 0, 0).getTime(), s24)).toBe('0:00');
  });
});

describe('fmtTimer', () => {
  const ms = (H + 2 * M + 3 * 1000);
  it('includes seconds when enabled', () => {
    expect(fmtTimer(ms, true)).toBe('1:02:03');
  });
  it('omits seconds when disabled', () => {
    expect(fmtTimer(ms, false)).toBe('1:02');
  });
  it('clamps negatives', () => {
    expect(fmtTimer(-1000, true)).toBe('0:00:00');
  });
});

describe('toDateStr / toTimeStr', () => {
  it('zero-pads date parts', () => {
    expect(toDateStr(new Date(2026, 2, 5, 8, 9).getTime())).toBe('2026-03-05');
  });
  it('zero-pads time parts', () => {
    expect(toTimeStr(new Date(2026, 2, 5, 8, 9).getTime())).toBe('08:09');
  });
});
