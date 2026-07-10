import type { User } from 'firebase/auth';
import type { TimeSettings } from '../lib/format';
import BottomSheet from './BottomSheet';
import Avatar from './Avatar';

interface Props {
  user: User;
  settings: TimeSettings;
  onUpdateSettings: (patch: Partial<TimeSettings>) => void;
  onSignOut: () => void;
  onClose: () => void;
}

const toggleRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid var(--line)',
};

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="seg">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={active ? 'seg-item seg-item--active' : 'seg-item'}
            aria-pressed={active}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AccountMenu({
  user,
  settings,
  onUpdateSettings,
  onSignOut,
  onClose,
}: Props) {
  return (
    <BottomSheet onClose={onClose} label="Account">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar user={user} size={52} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user.displayName || 'Signed in'}</div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.email}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={toggleRow}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Clock format</div>
          <Segmented
            value={settings.timeFormat}
            options={[
              { key: '12h', label: '12h' },
              { key: '24h', label: '24h' },
            ]}
            onChange={(v) => onUpdateSettings({ timeFormat: v })}
          />
        </div>
        <div style={{ ...toggleRow, borderBottom: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Show seconds on timer</div>
          <Segmented
            value={settings.showSeconds ? 'on' : 'off'}
            options={[
              { key: 'on', label: 'On' },
              { key: 'off', label: 'Off' },
            ]}
            onChange={(v) => onUpdateSettings({ showSeconds: v === 'on' })}
          />
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="btn-secondary"
        style={{ marginTop: 18, color: 'var(--danger)' }}
      >
        Sign out
      </button>
    </BottomSheet>
  );
}
