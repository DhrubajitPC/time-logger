import type { Category, ModalState } from '../types';
import BottomSheet from './BottomSheet';

interface Props {
  modal: ModalState;
  categories: Category[];
  onChange: (patch: Partial<ModalState>) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const label: React.CSSProperties = {
  display: 'block',
  fontWeight: 700,
  fontSize: 13,
  color: 'var(--text-muted)',
};

export default function EntryModal({
  modal,
  categories,
  onChange,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const isEdit = modal.mode === 'edit';
  const title = isEdit ? 'Edit entry' : 'Add entry';
  const canSave = Boolean(modal.catId && modal.date && modal.start && modal.end);

  return (
    <BottomSheet onClose={onClose} label={title}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
        <button onClick={onClose} className="btn-ghost" style={{ fontSize: 13 }}>
          Cancel
        </button>
      </div>

      <div style={{ ...label, marginTop: 18 }}>Category</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {categories.map((c) => {
          const active = modal.catId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange({ catId: c.id })}
              className={active ? 'chip chip--selected' : 'chip'}
              aria-pressed={active}
              style={active ? { background: c.tint } : undefined}
            >
              {active && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: c.color,
                    flexShrink: 0,
                  }}
                />
              )}
              {c.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
        <div>
          <label htmlFor="entry-date" style={label}>
            Date
          </label>
          <input
            id="entry-date"
            type="date"
            value={modal.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="field"
            style={{ marginTop: 6, fontWeight: 700, fontSize: 14, padding: '12px 10px' }}
          />
        </div>
        <div>
          <label htmlFor="entry-start" style={label}>
            Start
          </label>
          <input
            id="entry-start"
            type="time"
            value={modal.start}
            onChange={(e) => onChange({ start: e.target.value })}
            className="field"
            style={{ marginTop: 6, fontWeight: 700, fontSize: 14, padding: '12px 10px' }}
          />
        </div>
        <div>
          <label htmlFor="entry-stop" style={label}>
            Stop
          </label>
          <input
            id="entry-stop"
            type="time"
            value={modal.end}
            onChange={(e) => onChange({ end: e.target.value })}
            className="field"
            style={{ marginTop: 6, fontWeight: 700, fontSize: 14, padding: '12px 10px' }}
          />
        </div>
      </div>

      <label htmlFor="entry-note" style={{ ...label, marginTop: 18 }}>
        Note (optional)
      </label>
      <textarea
        id="entry-note"
        value={modal.comment}
        onChange={(e) => onChange({ comment: e.target.value })}
        placeholder="What were you working on?"
        rows={2}
        className="field"
        style={{ marginTop: 6, resize: 'none', lineHeight: 1.4 }}
      />

      <button onClick={onSave} disabled={!canSave} className="btn-primary" style={{ marginTop: 22 }}>
        {isEdit ? 'Save changes' : 'Add entry'}
      </button>
      {isEdit && (
        <button
          onClick={onDelete}
          className="btn-ghost btn-ghost--danger"
          style={{ marginTop: 8, width: '100%' }}
        >
          Delete entry
        </button>
      )}
    </BottomSheet>
  );
}
