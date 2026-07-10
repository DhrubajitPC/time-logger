import type { Category } from '../types';
import { COLOR_PALETTE } from '../lib/store';
import BottomSheet from './BottomSheet';

interface Props {
  categories: Category[];
  onRename: (id: string, name: string) => void;
  onRecolor: (id: string, pair: [string, string]) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

export default function ManageCategories({
  categories,
  onRename,
  onRecolor,
  onDelete,
  onAdd,
  onClose,
}: Props) {
  return (
    <BottomSheet onClose={onClose} label="Manage categories" scrollable>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Categories</div>
        <button onClick={onClose} className="btn-ghost" style={{ fontSize: 13 }}>
          Done
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {categories.map((c) => (
          <div
            key={c.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                defaultValue={c.name}
                aria-label={`Rename ${c.name}`}
                onBlur={(e) => {
                  if (e.target.value !== c.name) onRename(c.id, e.target.value.trim() || c.name);
                }}
                className="field"
                style={{ flex: 1, minWidth: 0, width: 'auto', fontWeight: 700 }}
              />
              <button
                onClick={() => onDelete(c.id)}
                className="btn-ghost btn-ghost--danger"
                style={{ fontSize: 13, flexShrink: 0 }}
              >
                Delete
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: 6,
                marginLeft: -8,
              }}
            >
              {COLOR_PALETTE.map((pair) => {
                const selected = c.color === pair[0];
                return (
                  <button
                    key={pair[0]}
                    onClick={() => onRecolor(c.id, pair)}
                    className={selected ? 'swatch swatch--selected' : 'swatch'}
                    aria-label={`Use color ${pair[0]}`}
                    aria-pressed={selected}
                    style={{ '--swatch-color': pair[0] } as React.CSSProperties}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="btn-secondary"
        style={{ marginTop: 14, color: 'var(--clay)' }}
      >
        + Add category
      </button>
    </BottomSheet>
  );
}
