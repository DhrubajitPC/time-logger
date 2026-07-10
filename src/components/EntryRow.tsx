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
    <button
      onClick={() => onEdit(entry)}
      className="row-btn"
      aria-label={`Edit ${cat?.name ?? 'deleted category'} entry`}
      style={{ borderBottom: last ? 'none' : '1px solid var(--line)' }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 4,
          background: cat?.color ?? 'var(--line)',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {cat?.name ?? 'Deleted'}
        </div>
        {entry.comment && (
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--text-muted)',
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
      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>
        {fmtClock(entry.start, settings)} – {fmtClock(entry.end, settings)}
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          minWidth: 42,
          textAlign: 'right',
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {fmtDur(entry.end - entry.start)}
      </div>
    </button>
  );
}
