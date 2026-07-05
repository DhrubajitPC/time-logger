import type { Category, Entry } from '../types';
import { fmtClock, fmtDur, type TimeSettings } from '../lib/format';

interface Props {
  entry: Entry;
  cat: Category | undefined;
  last: boolean;
  settings: TimeSettings;
  onEdit: (e: Entry) => void;
}

export default function EntryRow({ entry, cat, last, settings, onEdit }: Props) {
  return (
    <div
      onClick={() => onEdit(entry)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: last ? 'none' : '1px solid #F3EADF',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 4,
          background: cat?.color ?? '#ccc',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{cat?.name ?? 'Deleted'}</div>
        {entry.comment && (
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: '#B09A85',
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {entry.comment}
          </div>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#B09A85' }}>
        {fmtClock(entry.start, settings)} – {fmtClock(entry.end, settings)}
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, minWidth: 42, textAlign: 'right' }}>
        {fmtDur(entry.end - entry.start)}
      </div>
    </div>
  );
}
