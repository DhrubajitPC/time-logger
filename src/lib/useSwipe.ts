import { useRef } from 'react';

/** Classifies a gesture from its deltas. Returns a direction only when the
 *  move is clearly horizontal (dominates vertical) and past the threshold —
 *  otherwise null, so vertical scrolls and taps are ignored. */
export function resolveSwipe(
  dx: number,
  dy: number,
  threshold: number,
): 'left' | 'right' | null {
  if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return null;
  return dx < 0 ? 'left' : 'right';
}

interface Opts {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal travel (px) to count as a swipe. */
  threshold?: number;
}

/** Detects a horizontal swipe from touch events, ignoring mostly-vertical
 *  moves (so it never fights the page's vertical scroll) and small taps.
 *  Returns props to spread onto the element you want swipeable. */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 60 }: Opts) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const t = e.changedTouches[0];
      const dir = resolveSwipe(t.clientX - s.x, t.clientY - s.y, threshold);
      if (dir === 'left') onSwipeLeft?.();
      else if (dir === 'right') onSwipeRight?.();
    },
  };
}
