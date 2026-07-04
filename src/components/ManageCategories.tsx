import type { Category } from '../types';
import { COLOR_PALETTE } from '../lib/store';

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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(45,36,56,0.45)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#FFF6EC',
          borderRadius: '28px 28px 0 0',
          padding: '24px 22px calc(24px + env(safe-area-inset-bottom)) 22px',
          maxHeight: '80dvh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22 }}>
            Categories
          </div>
          <div
            onClick={onClose}
            style={{ fontWeight: 800, fontSize: 14, color: '#FF6B57', cursor: 'pointer', padding: '6px 10px' }}
          >
            Done
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {categories.map((c) => (
            <div key={c.id} style={{ background: '#fff', borderRadius: 20, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  defaultValue={c.name}
                  onBlur={(e) => {
                    if (e.target.value !== c.name) onRename(c.id, e.target.value.trim() || c.name);
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: '#FFF6EC',
                    border: '2px solid #F3EADF',
                    borderRadius: 12,
                    padding: '10px 12px',
                    fontWeight: 800,
                    fontSize: 15,
                    color: '#2D2438',
                  }}
                />
                <div
                  onClick={() => onDelete(c.id)}
                  style={{ color: '#E14B4B', fontWeight: 800, fontSize: 13, cursor: 'pointer', padding: 8 }}
                >
                  Delete
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {COLOR_PALETTE.map((pair) => (
                  <div
                    key={pair[0]}
                    onClick={() => onRecolor(c.id, pair)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: pair[0],
                      border: c.color === pair[0] ? '3px solid #2D2438' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          onClick={onAdd}
          style={{
            marginTop: 14,
            background: '#FBEBD9',
            border: '2px dashed #E8D3BC',
            borderRadius: 20,
            padding: '14px 0',
            textAlign: 'center',
            color: '#B09A85',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          + Add category
        </div>
      </div>
    </div>
  );
}
