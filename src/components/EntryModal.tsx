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
  fontWeight: 800,
  fontSize: 13,
  color: '#B09A85',
  textTransform: 'uppercase',
  letterSpacing: 1,
};

const field: React.CSSProperties = {
  width: '100%',
  marginTop: 6,
  background: '#fff',
  border: '2px solid #F3EADF',
  borderRadius: 14,
  padding: '12px 10px',
  fontWeight: 700,
  fontSize: 14,
  color: '#2D2438',
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
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22 }}>
            {isEdit ? 'Edit entry' : 'Add entry'}
          </div>
          <div
            onClick={onClose}
            style={{ fontWeight: 800, fontSize: 14, color: '#B09A85', cursor: 'pointer', padding: '6px 10px' }}
          >
            Cancel
          </div>
        </div>

        <div style={{ ...label, marginTop: 18 }}>Category</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {categories.map((c) => {
            const active = modal.catId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onChange({ catId: c.id })}
                style={{
                  background: active ? c.color : '#fff',
                  color: active ? '#fff' : '#2D2438',
                  border: `2px solid ${active ? c.color : '#F3EADF'}`,
                  borderRadius: 999,
                  padding: '9px 16px',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {c.name}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
          <div>
            <div style={label}>Date</div>
            <input
              type="date"
              value={modal.date}
              onChange={(e) => onChange({ date: e.target.value })}
              style={field}
            />
          </div>
          <div>
            <div style={label}>Start</div>
            <input
              type="time"
              value={modal.start}
              onChange={(e) => onChange({ start: e.target.value })}
              style={field}
            />
          </div>
          <div>
            <div style={label}>Stop</div>
            <input
              type="time"
              value={modal.end}
              onChange={(e) => onChange({ end: e.target.value })}
              style={field}
            />
          </div>
        </div>

        <div style={{ ...label, marginTop: 18 }}>Note (optional)</div>
        <textarea
          value={modal.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
          placeholder="What were you working on?"
          rows={2}
          style={{
            ...field,
            marginTop: 6,
            resize: 'none',
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        />

        <div
          onClick={onSave}
          style={{
            marginTop: 22,
            background: '#FF6B57',
            borderRadius: 999,
            padding: '16px 0',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(255,107,87,0.3)',
          }}
        >
          {isEdit ? 'Save changes' : 'Add entry'}
        </div>
        {isEdit && (
          <div
            onClick={onDelete}
            style={{
              marginTop: 12,
              textAlign: 'center',
              color: '#E14B4B',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            Delete entry
          </div>
        )}
    </BottomSheet>
  );
}
