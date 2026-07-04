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
  fontFamily: "'Fredoka', sans-serif",
  fontWeight: 600,
  fontSize: 18,
};

const linkAction: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 13,
  color: '#FF6B57',
  cursor: 'pointer',
  padding: '4px 8px',
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
        <div
          onClick={onStop}
          style={{
            marginTop: 18,
            background: '#FF6B57',
            borderRadius: 28,
            padding: '20px 22px',
            color: '#fff',
            boxShadow: '0 12px 24px rgba(255,107,87,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#fff',
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 13,
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Tracking · {timerCat.name}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 40,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmtTimer(now - timer.start, settings.showSeconds)}
            </div>
          </div>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#FF6B57' }} />
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: 18,
            background: '#FBEBD9',
            border: '2px dashed #E8D3BC',
            borderRadius: 28,
            padding: 22,
            textAlign: 'center',
            color: '#B09A85',
            fontWeight: 700,
            fontSize: 15,
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
        <div onClick={onManage} style={linkAction}>
          Edit
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        {data.categories.map((c) => (
          <div
            key={c.id}
            onClick={() => onStart(c.id)}
            style={{
              background: c.tint,
              border: `3px solid ${timer?.catId === c.id ? '#2D2438' : 'transparent'}`,
              borderRadius: 22,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 12, background: c.color }} />
            <div style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</div>
          </div>
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
        <div onClick={onAdd} style={linkAction}>
          + Add manually
        </div>
      </div>
      {today.length > 0 ? (
        <div style={{ marginTop: 10, background: '#fff', borderRadius: 20, padding: '4px 16px' }}>
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
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            textAlign: 'center',
            color: '#B09A85',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          No entries yet today
        </div>
      )}
    </div>
  );
}
