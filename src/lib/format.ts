export interface TimeSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
}

export const DEFAULT_SETTINGS: TimeSettings = {
  timeFormat: '12h',
  showSeconds: true,
};

export function fmtClock(ts: number, s: TimeSettings): string {
  const d = new Date(ts);
  const m = String(d.getMinutes()).padStart(2, '0');
  let h = d.getHours();
  if (s.timeFormat === '12h') {
    const ap = h >= 12 ? 'p' : 'a';
    h = h % 12 || 12;
    return `${h}:${m}${ap}`;
  }
  return `${h}:${m}`;
}

export function fmtDur(ms: number): string {
  const mins = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function fmtTimer(ms: number, showSeconds: boolean): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  if (showSeconds) return `${h}:${mm}:${String(sec).padStart(2, '0')}`;
  return `${h}:${mm}`;
}

export function toDateStr(ts: number): string {
  const d = new Date(ts);
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function toTimeStr(ts: number): string {
  const d = new Date(ts);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}
