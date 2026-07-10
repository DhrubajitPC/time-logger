import type { Category, Entry, TrackerData } from '../types';
import { catMap, todayEntries } from '../lib/derive';
import { fmtTimer, type TimeSettings } from '../lib/format';
import EntryRow from './EntryRow';

interface Props {
  data: TrackerData;
  now: number;
  settings: TimeSettings;
  onStart: (catId: string) => void;
  onStop: () => void;
  onManage: () => void;
  onAdd: () => void;
  onEdit: (e: Entry) => void;
}

const sectionTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 18,
};

export default function TrackTab({
  data,
  now,
  settings,
  onStart,
  onStop,
  onManage,
  onAdd,
  onEdit,
}: Props) {
  const cats = catMap(data.categories);
  const timer = data.activeTimer;
  const timerCat: Category | undefined = timer ? cats[timer.catId] : undefined;
  const today = todayEntries(data.entries, now);

  return (
    <div>
      {timer && timerCat ? (
        <button
          onClick={onStop}
          className="timer-card"
          aria-label={`Stop tracking ${timerCat.name}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="pulse-dot" />
              <div style={{ fontWeight: 700, fontSize: 13 }}>
                Tracking · {timerCat.name}
              </div>
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmtTimer(now - timer.start, settings.showSeconds)}
            </div>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--clay)' }} />
          </div>
        </button>
      ) : (
        <div
          style={{
            marginTop: 18,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: '22px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Nothing tracking — tap a category below to start
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginTop: 24,
        }}
      >
        <div style={sectionTitle}>Tap to start</div>
        <button onClick={onManage} className="btn-ghost" style={{ fontSize: 13 }}>
          Edit
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        {data.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onStart(c.id)}
            className="tile"
            style={{
              background: c.tint,
              border: `2px solid ${timer?.catId === c.id ? 'var(--ink)' : 'transparent'}`,
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: c.color }} />
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{c.name}</div>
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 24,
        }}
      >
        <div style={sectionTitle}>Today</div>
        <button onClick={onAdd} className="btn-ghost" style={{ fontSize: 13 }}>
          + Add entry
        </button>
      </div>
      {today.length > 0 ? (
        <div
          style={{
            marginTop: 10,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: '4px 16px',
          }}
        >
          {today.map((e, i) => (
            <EntryRow
              key={e.id}
              entry={e}
              cat={cats[e.catId]}
              last={i === today.length - 1}
              settings={settings}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: 10,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: 20,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          No entries yet today
        </div>
      )}
    </div>
  );
}
