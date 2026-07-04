import { useEffect, useRef, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  type Firestore,
  type FirestoreError,
} from 'firebase/firestore';
import { getDbOrThrow } from './firebase';
import { nextTopOrder, sortCategories } from './derive';
import type { ActiveTimer, Category, Entry, TrackerData } from '../types';

const LEGACY_KEY = 'candypop_tracker_v1';

const PALETTE: [string, string][] = [
  ['#F5A623', '#FFE3A3'],
  ['#34B76F', '#C9F0D8'],
  ['#5B6CFF', '#D7DCFF'],
  ['#F25CA2', '#FFD6E8'],
  ['#FF6B57', '#FFD9CF'],
  ['#8B5CF6', '#E4D9FF'],
  ['#0EA5B7', '#C7EEF3'],
];

export const COLOR_PALETTE = PALETTE;

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#F5A623', tint: '#FFE3A3' },
  { id: 'exercise', name: 'Exercise', color: '#34B76F', tint: '#C9F0D8' },
  { id: 'reading', name: 'Reading', color: '#5B6CFF', tint: '#D7DCFF' },
  { id: 'chores', name: 'Chores', color: '#F25CA2', tint: '#FFD6E8' },
];

// ---- Firestore path helpers (data is namespaced per user) ----
const userDoc = (db: Firestore, uid: string) => doc(db, 'users', uid);
const catsCol = (db: Firestore, uid: string) => collection(db, 'users', uid, 'categories');
const entriesCol = (db: Firestore, uid: string) => collection(db, 'users', uid, 'entries');

function newId(prefix: string): string {
  // Firestore auto-ids need a collection ref; a time+random id is fine here and
  // keeps ids readable. Collisions are effectively impossible at human scale.
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Reads legacy localStorage data written by the original single-file app. */
function readLegacyData(): TrackerData | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (d && Array.isArray(d.categories)) {
      return {
        categories: d.categories,
        entries: Array.isArray(d.entries) ? d.entries : [],
        activeTimer: d.activeTimer ?? null,
      };
    }
  } catch {
    /* ignore malformed legacy data */
  }
  return null;
}

/**
 * One-time seed/migration. Runs when a user's cloud store is empty.
 * If legacy localStorage data exists it's uploaded; otherwise default
 * categories are created. Marked complete via a flag on the user doc so
 * it never runs twice.
 */
async function seedOrMigrate(db: Firestore, uid: string): Promise<void> {
  const legacy = readLegacyData();
  const batch = writeBatch(db);

  const categories = legacy?.categories?.length ? legacy.categories : DEFAULT_CATEGORIES;
  categories.forEach((c, i) => {
    batch.set(doc(catsCol(db, uid), c.id), {
      name: c.name,
      color: c.color,
      tint: c.tint,
      // Preserve original top-to-bottom order for seeded/migrated categories.
      order: i,
    });
  });
  for (const e of legacy?.entries ?? []) {
    batch.set(doc(entriesCol(db, uid), e.id), {
      catId: e.catId,
      start: e.start,
      end: e.end,
    });
  }
  batch.set(userDoc(db, uid), {
    activeTimer: legacy?.activeTimer ?? null,
    seeded: true,
    migratedFromLegacy: Boolean(legacy),
  });

  await batch.commit();

  // Clear legacy data so a later device doesn't re-import it into the cloud.
  if (legacy) {
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Turns a Firestore listener error into a user-facing message. */
function describeError(err: FirestoreError): string {
  switch (err.code) {
    case 'permission-denied':
      return "Can't access your data. Deploy the Firestore security rules (firebase deploy --only firestore:rules) and make sure a Firestore database exists.";
    case 'unavailable':
      return "Can't reach the database. Check your connection and try again.";
    case 'failed-precondition':
      return 'A Firestore database has not been created for this project yet. Create one in the Firebase console.';
    default:
      return `Something went wrong loading your data (${err.code}).`;
  }
}

interface UseTrackerResult {
  data: TrackerData | null;
  ready: boolean;
  error: string | null;
  startTimer: (catId: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  addEntry: (catId: string, start: number, end: number) => Promise<void>;
  updateEntry: (id: string, catId: string, start: number, end: number) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  addCategory: () => Promise<void>;
  renameCategory: (id: string, name: string) => Promise<void>;
  recolorCategory: (id: string, pair: [string, string]) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

/**
 * Subscribes to a user's tracker data in Firestore (offline-first) and exposes
 * mutation helpers. All writes go straight to Firestore, which queues them
 * while offline and syncs on reconnect; the onSnapshot listeners then push
 * updates back into React state.
 */
export function useTracker(uid: string): UseTrackerResult {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seedingRef = useRef(false);

  const db = getDbOrThrow();

  useEffect(() => {
    setCategories(null);
    setEntries(null);
    setUserLoaded(false);
    setError(null);
    seedingRef.current = false;

    // Any listener failing (e.g. rules not deployed) surfaces an error instead
    // of leaving the app spinning forever.
    const onErr = (err: FirestoreError) => {
      console.error('Firestore listener error', err);
      setError(describeError(err));
    };

    const unsubUser = onSnapshot(
      userDoc(db, uid),
      (snap) => {
        const d = snap.data();
        setActiveTimer((d?.activeTimer as ActiveTimer | null) ?? null);
        setUserLoaded(true);

        // Seed/migrate once if this user's store has never been initialized.
        if (!snap.exists() || !d?.seeded) {
          if (!seedingRef.current) {
            seedingRef.current = true;
            void seedOrMigrate(db, uid).catch((err) => {
              console.error('Seed/migrate failed', err);
              seedingRef.current = false;
              setError(describeError(err as FirestoreError));
            });
          }
        }
      },
      onErr,
    );

    const unsubCats = onSnapshot(
      catsCol(db, uid),
      (snap) => {
        const cats = sortCategories(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) })),
        );
        setCategories(cats);
      },
      onErr,
    );

    const unsubEntries = onSnapshot(
      entriesCol(db, uid),
      (snap) => {
        setEntries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Entry, 'id'>) })));
      },
      onErr,
    );

    return () => {
      unsubUser();
      unsubCats();
      unsubEntries();
    };
  }, [db, uid]);

  const ready = categories !== null && entries !== null && userLoaded;
  const data: TrackerData | null = ready
    ? { categories: categories!, entries: entries!, activeTimer }
    : null;

  // ---- mutations ----
  const setActive = (t: ActiveTimer | null) =>
    setDoc(userDoc(db, uid), { activeTimer: t }, { merge: true });

  async function startTimer(catId: string): Promise<void> {
    if (!data) return;
    const cur = data.activeTimer;
    if (cur) {
      if (cur.catId === catId) return stopTimer();
      // Close the running timer into an entry before starting a new one.
      await setDoc(doc(entriesCol(db, uid), newId('e')), {
        catId: cur.catId,
        start: cur.start,
        end: Date.now(),
      });
    }
    await setActive({ catId, start: Date.now() });
  }

  async function stopTimer(): Promise<void> {
    if (!data?.activeTimer) return;
    const cur = data.activeTimer;
    await setDoc(doc(entriesCol(db, uid), newId('e')), {
      catId: cur.catId,
      start: cur.start,
      end: Date.now(),
    });
    await setActive(null);
  }

  async function addEntry(catId: string, start: number, end: number): Promise<void> {
    await setDoc(doc(entriesCol(db, uid), newId('e')), { catId, start, end });
  }

  async function updateEntry(id: string, catId: string, start: number, end: number): Promise<void> {
    await updateDoc(doc(entriesCol(db, uid), id), { catId, start, end });
  }

  async function deleteEntry(id: string): Promise<void> {
    await deleteDoc(doc(entriesCol(db, uid), id));
  }

  async function addCategory(): Promise<void> {
    if (!data) return;
    const pair = PALETTE[data.categories.length % PALETTE.length];
    await setDoc(doc(catsCol(db, uid), newId('c')), {
      name: 'New category',
      color: pair[0],
      tint: pair[1],
      // One below the current minimum so the new category sorts to the top,
      // even when existing (legacy) categories have no order and fall back to 0.
      order: nextTopOrder(data.categories),
    });
  }

  async function renameCategory(id: string, name: string): Promise<void> {
    await updateDoc(doc(catsCol(db, uid), id), { name });
  }

  async function recolorCategory(id: string, pair: [string, string]): Promise<void> {
    await updateDoc(doc(catsCol(db, uid), id), { color: pair[0], tint: pair[1] });
  }

  async function deleteCategory(id: string): Promise<void> {
    if (!data) return;
    // Remove the category and all of its entries in one batch.
    const batch = writeBatch(db);
    batch.delete(doc(catsCol(db, uid), id));
    const owned = await getDocs(entriesCol(db, uid));
    owned.forEach((d) => {
      if ((d.data() as Entry).catId === id) batch.delete(d.ref);
    });
    if (data.activeTimer?.catId === id) {
      batch.set(userDoc(db, uid), { activeTimer: null }, { merge: true });
    }
    await batch.commit();
  }

  return {
    data,
    ready,
    error,
    startTimer,
    stopTimer,
    addEntry,
    updateEntry,
    deleteEntry,
    addCategory,
    renameCategory,
    recolorCategory,
    deleteCategory,
  };
}
