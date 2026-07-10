import type { Tab } from '../types';

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

export default function TabBar({ tab, onChange }: Props) {
  const item = (key: Tab, label: string) => {
    const active = tab === key;
    return (
      <button
        onClick={() => onChange(key)}
        className={active ? 'tab-item tab-item--active' : 'tab-item'}
        aria-current={active ? 'page' : undefined}
      >
        {label}
      </button>
    );
  };

  return (
    <nav
      aria-label="Tabs"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-nav)' as React.CSSProperties['zIndex'],
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--surface)',
        borderTop: '1px solid var(--line)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 520, display: 'flex' }}>
        {item('track', 'Track')}
        {item('stats', 'Stats')}
      </div>
    </nav>
  );
}
