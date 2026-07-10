import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { Entry, ModalState, RangeKey, Tab } from '../types';
import { useTracker } from '../lib/store';
import { useSettings } from '../lib/useSettings';
import { useSwipe } from '../lib/useSwipe';
import { toDateStr, toTimeStr } from '../lib/format';
import TrackTab from './TrackTab';
import StatsTab from './StatsTab';
import TabBar from './TabBar';
import EntryModal from './EntryModal';
import ManageCategories from './ManageCategories';
import AccountMenu from './AccountMenu';
import Avatar from './Avatar';
import Spinner from './Spinner';

interface Props {
  user: User;
  onSignOut: () => void;
}

export default function Tracker({ user, onSignOut }: Props) {
  const tracker = useTracker(user.uid);
  const { settings, update: updateSettings } = useSettings();

  const [tab, setTab] = useState<Tab>('track');
  const [range, setRange] = useState<RangeKey>('today');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [manage, setManage] = useState(false);
  const [menu, setMenu] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { data, ready, error } = tracker;

  // Swipe left → Stats, swipe right → Track.
  const swipe = useSwipe({
    onSwipeLeft: () => setTab('stats'),
    onSwipeRight: () => setTab('track'),
  });

  function openAdd() {
    const t = Date.now();
    setModal({
      mode: 'add',
      id: null,
      catId: data?.categories[0]?.id ?? null,
      date: toDateStr(t),
      start: toTimeStr(t - 30 * 60000),
      end: toTimeStr(t),
      comment: '',
    });
  }

  function openEdit(e: Entry) {
    setModal({
      mode: 'edit',
      id: e.id,
      catId: e.catId,
      date: toDateStr(e.start),
      start: toTimeStr(e.start),
      end: toTimeStr(e.end),
      comment: e.comment ?? '',
    });
  }

  async function saveForm() {
    if (!modal || !modal.catId || !modal.date || !modal.start || !modal.end) return;
    const start = new Date(`${modal.date}T${modal.start}`).getTime();
    let end = new Date(`${modal.date}T${modal.end}`).getTime();
    if (isNaN(start) || isNaN(end)) return;
    if (end <= start) end += 24 * 3600000; // crosses midnight
    if (modal.mode === 'edit' && modal.id) {
      await tracker.updateEntry(modal.id, modal.catId, start, end, modal.comment);
    } else {
      await tracker.addEntry(modal.catId, start, end, modal.comment);
    }
    setModal(null);
  }

  async function deleteEntry() {
    if (modal?.id) await tracker.deleteEntry(modal.id);
    setModal(null);
  }

  async function deleteCategory(id: string) {
    if (!data) return;
    const n = data.entries.filter((e) => e.catId === id).length;
    if (
      n &&
      !window.confirm(
        `Delete this category and its ${n} logged entr${n === 1 ? 'y' : 'ies'}?`,
      )
    )
      return;
    await tracker.deleteCategory(id);
  }

  const todayLabel = new Date(now).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      style={{
        minHeight: '100dvh',
        maxWidth: 520,
        margin: '0 auto',
        background: 'var(--bg-warm)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        {...swipe}
        style={{ flex: 1, padding: 'calc(20px + env(safe-area-inset-top)) 22px 110px 22px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)' }}>
              {todayLabel}
            </div>
            <h1 style={{ fontWeight: 700, fontSize: 22, lineHeight: 1.25, margin: '2px 0 0' }}>
              {tab === 'track' ? "Where's your time going?" : 'Your time, divided'}
            </h1>
          </div>
          <button
            onClick={() => setMenu(true)}
            aria-label="Account"
            className="icon-btn"
            style={{ marginTop: 2 }}
          >
            <Avatar user={user} size={38} />
          </button>
        </div>

        {error ? (
          <div
            role="alert"
            style={{
              marginTop: 30,
              background: 'var(--danger-wash)',
              border: '1px solid #ECCFC9',
              borderRadius: 'var(--r-lg)',
              padding: '20px 22px',
              color: 'var(--danger)',
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {error}
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
              style={{ marginTop: 14, color: 'var(--danger)' }}
            >
              Retry
            </button>
          </div>
        ) : !ready || !data ? (
          <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center' }}>
            <Spinner />
          </div>
        ) : tab === 'track' ? (
          <TrackTab
            data={data}
            now={now}
            settings={settings}
            onStart={tracker.startTimer}
            onStop={tracker.stopTimer}
            onManage={() => setManage(true)}
            onAdd={openAdd}
            onEdit={openEdit}
          />
        ) : (
          <StatsTab
            data={data}
            now={now}
            range={range}
            settings={settings}
            onRange={setRange}
            onEdit={openEdit}
          />
        )}
      </div>

      <TabBar tab={tab} onChange={setTab} />

      {modal && data && (
        <EntryModal
          modal={modal}
          categories={data.categories}
          onChange={(patch) => setModal((m) => (m ? { ...m, ...patch } : m))}
          onSave={saveForm}
          onDelete={deleteEntry}
          onClose={() => setModal(null)}
        />
      )}

      {manage && data && (
        <ManageCategories
          categories={data.categories}
          onRename={tracker.renameCategory}
          onRecolor={tracker.recolorCategory}
          onDelete={deleteCategory}
          onAdd={tracker.addCategory}
          onClose={() => setManage(false)}
        />
      )}

      {menu && (
        <AccountMenu
          user={user}
          settings={settings}
          onUpdateSettings={updateSettings}
          onSignOut={onSignOut}
          onClose={() => setMenu(false)}
        />
      )}
    </div>
  );
}
