import type { Tab } from '../types';

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

export default function TabBar({ tab, onChange }: Props) {
  const item = (key: Tab, label: string) => {
    const active = tab === key;
    return (
      <div
        onClick={() => onChange(key)}
        style={{
          flex: 1,
          background: active ? '#FF6B57' : 'transparent',
          borderRadius: 999,
          padding: '12px 0',
          textAlign: 'center',
          color: active ? '#fff' : '#B7AECB',
          fontWeight: 800,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 60px calc(14px + env(safe-area-inset-bottom)) 60px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          background: '#2D2438',
          borderRadius: 999,
          padding: 8,
          display: 'flex',
          gap: 6,
          pointerEvents: 'auto',
          boxShadow: '0 10px 26px rgba(45,36,56,0.3)',
        }}
      >
        {item('track', 'Track')}
        {item('stats', 'Stats')}
      </div>
    </div>
  );
}
