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
  padding: '14px 0',
  borderBottom: '1px solid #F3EADF',
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
    <div style={{ display: 'flex', gap: 4, background: '#FBEBD9', borderRadius: 999, padding: 4 }}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <div
            key={o.key}
            onClick={() => onChange(o.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              background: active ? '#2D2438' : 'transparent',
              color: active ? '#fff' : '#B09A85',
            }}
          >
            {o.label}
          </div>
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
    <BottomSheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar user={user} size={52} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18 }}>
            {user.displayName || 'Signed in'}
          </div>
          <div
            style={{
              color: '#B09A85',
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
          <div style={{ fontWeight: 800, fontSize: 15 }}>Clock format</div>
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
          <div style={{ fontWeight: 800, fontSize: 15 }}>Show seconds on timer</div>
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

      <div
        onClick={onSignOut}
        style={{
          marginTop: 18,
          background: '#fff',
          border: '2px solid #F3EADF',
          borderRadius: 999,
          padding: '14px 0',
          textAlign: 'center',
          color: '#E14B4B',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
        }}
      >
        Sign out
      </div>
    </BottomSheet>
  );
}
