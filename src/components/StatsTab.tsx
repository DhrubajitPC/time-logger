import type { Entry, RangeKey, TrackerData } from '../types';
import { catMap, computeStats, historyByDay } from '../lib/derive';
import { fmtDur, type TimeSettings } from '../lib/format';
import EntryRow from './EntryRow';

interface Props {
  data: TrackerData;
  now: number;
  range: RangeKey;
  settings: TimeSettings;
  onRange: (r: RangeKey) => void;
  onEdit: (e: Entry) => void;
}

const RANGES: { key: RangeKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--r-lg)',
};

export default function StatsTab({ data, now, range, settings, onRange, onEdit }: Props) {
  const cats = catMap(data.categories);
  const { legend, pieBg, grandMs } = computeStats(data.entries, data.categories, now, range);
  const history = historyByDay(data.entries, now, range);

  return (
    <div>
      <div className="seg" style={{ marginTop: 16, alignSelf: 'flex-start', width: 'fit-content' }}>
        {RANGES.map((r) => {
          const active = range === r.key;
          return (
            <button
              key={r.key}
              onClick={() => onRange(r.key)}
              className={active ? 'seg-item seg-item--active' : 'seg-item'}
              aria-pressed={active}
              style={{ padding: '8px 18px' }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {legend.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '26px 0 10px 0' }}>
            <div
              style={{
                width: 210,
                height: 210,
                borderRadius: '50%',
                background: pieBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px rgba(46, 42, 36, 0.1)',
              }}
            >
              <div
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: '50%',
                  background: 'var(--bg-warm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{ fontWeight: 700, fontSize: 24, fontVariantNumeric: 'tabular-nums' }}
                >
                  {fmtDur(grandMs)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>
                  tracked
                </div>
              </div>
            </div>
          </div>
          <div style={{ ...card, marginTop: 14, padding: '4px 16px' }}>
            {legend.map((l, i) => (
              <div
                key={l.cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: i === legend.length - 1 ? 'none' : '1px solid var(--line)',
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 4,
                    background: l.cat.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{l.cat.name}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)' }}>
                  {l.pct}%
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, minWidth: 52, textAlign: 'right' }}>
                  {fmtDur(l.ms)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            ...card,
            marginTop: 30,
            padding: '30px 22px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Nothing tracked in this range yet
        </div>
      )}

      {history.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 26 }}>History</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {history.map((day) => (
              <div key={day.key}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  {day.label}
                </div>
                <div style={{ ...card, padding: '4px 16px' }}>
                  {day.items.map((e, i) => (
                    <EntryRow
                      key={e.id}
                      entry={e}
                      cat={cats[e.catId]}
                      last={i === day.items.length - 1}
                      settings={settings}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
