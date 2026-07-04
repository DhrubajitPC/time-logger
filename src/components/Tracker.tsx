import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { Entry, ModalState, RangeKey, Tab } from '../types';
import { useTracker } from '../lib/store';
import { useSettings } from '../lib/useSettings';
import { toDateStr, toTimeStr } from '../lib/format';
import TrackTab from './TrackTab';
import StatsTab from './StatsTab';
import TabBar from './TabBar';
import EntryModal from './EntryModal';
import ManageCategories from './ManageCategories';
import AccountMenu from './AccountMenu';
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

  const { data, ready } = tracker;

  function openAdd() {
    const t = Date.now();
    setModal({
      mode: 'add',
      id: null,
      catId: data?.categories[0]?.id ?? null,
      date: toDateStr(t),
      start: toTimeStr(t - 30 * 60000),
      end: toTimeStr(t),
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
    });
  }

  async function saveForm() {
    if (!modal || !modal.catId || !modal.date || !modal.start || !modal.end) return;
    const start = new Date(`${modal.date}T${modal.start}`).getTime();
    let end = new Date(`${modal.date}T${modal.end}`).getTime();
    if (isNaN(start) || isNaN(end)) return;
    if (end <= start) end += 24 * 3600000; // crosses midnight
    if (modal.mode === 'edit' && modal.id) {
      await tracker.updateEntry(modal.id, modal.catId, start, end);
    } else {
      await tracker.addEntry(modal.catId, start, end);
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
        background: '#FFF6EC',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style={{ flex: 1, padding: 'calc(20px + env(safe-area-inset-top)) 22px 120px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: '#B09A85',
              }}
            >
              {todayLabel}
            </div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: '-0.5px',
              }}
            >
              {tab === 'track' ? "Where's your time going?" : 'Your time, divided'}
            </div>
          </div>
          <button
            onClick={() => setMenu(true)}
            aria-label="Account"
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                referrerPolicy="no-referrer"
                style={{ width: 38, height: 38, borderRadius: '50%' }}
              />
            ) : (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#FF6B57',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>

        {!ready || !data ? (
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
