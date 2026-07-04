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

export default function StatsTab({ data, now, range, settings, onRange, onEdit }: Props) {
  const cats = catMap(data.categories);
  const { legend, pieBg, grandMs } = computeStats(data.entries, data.categories, now, range);
  const history = historyByDay(data.entries, now, range);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {RANGES.map((r) => {
          const active = range === r.key;
          return (
            <div
              key={r.key}
              onClick={() => onRange(r.key)}
              style={{
                background: active ? '#2D2438' : '#FBEBD9',
                color: active ? '#fff' : '#B09A85',
                borderRadius: 999,
                padding: '8px 18px',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {r.label}
            </div>
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
                boxShadow: '0 14px 30px rgba(45,36,56,0.12)',
              }}
            >
              <div
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: '50%',
                  background: '#FFF6EC',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26 }}>
                  {fmtDur(grandMs)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#B09A85' }}>tracked</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, background: '#fff', borderRadius: 20, padding: '4px 16px' }}>
            {legend.map((l, i) => (
              <div
                key={l.cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: i === legend.length - 1 ? 'none' : '1px solid #F3EADF',
                }}
              >
                <div
                  style={{ width: 12, height: 12, borderRadius: 4, background: l.cat.color, flexShrink: 0 }}
                />
                <div style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{l.cat.name}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#B09A85' }}>{l.pct}%</div>
                <div style={{ fontWeight: 800, fontSize: 14, minWidth: 52, textAlign: 'right' }}>
                  {fmtDur(l.ms)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            marginTop: 30,
            background: '#FBEBD9',
            border: '2px dashed #E8D3BC',
            borderRadius: 28,
            padding: '30px 22px',
            textAlign: 'center',
            color: '#B09A85',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Nothing tracked in this range yet
        </div>
      )}

      {history.length > 0 && (
        <>
          <div
            style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, marginTop: 26 }}
          >
            History
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {history.map((day) => (
              <div key={day.key}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 13,
                    color: '#B09A85',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: 6,
                  }}
                >
                  {day.label}
                </div>
                <div style={{ background: '#fff', borderRadius: 20, padding: '4px 16px' }}>
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
