import { describe, it, expect } from 'vitest';
import { resolveSwipe } from './useSwipe';

const T = 60;

describe('resolveSwipe', () => {
  it('detects a left swipe (negative dx)', () => {
    expect(resolveSwipe(-100, 10, T)).toBe('left');
  });

  it('detects a right swipe (positive dx)', () => {
    expect(resolveSwipe(100, -10, T)).toBe('right');
  });

  it('ignores moves shorter than the threshold', () => {
    expect(resolveSwipe(40, 0, T)).toBeNull();
    expect(resolveSwipe(-59, 0, T)).toBeNull();
  });

  it('ignores mostly-vertical gestures (scroll)', () => {
    expect(resolveSwipe(80, 100, T)).toBeNull(); // dx not dominant enough
    expect(resolveSwipe(-70, 90, T)).toBeNull();
  });

  it('accepts a horizontal swipe with minor vertical drift', () => {
    expect(resolveSwipe(120, 30, T)).toBe('right');
  });
});
