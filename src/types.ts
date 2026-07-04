export interface Category {
  id: string;
  name: string;
  color: string;
  tint: string;
}

export interface Entry {
  id: string;
  catId: string;
  /** epoch ms */
  start: number;
  /** epoch ms */
  end: number;
}

export interface ActiveTimer {
  catId: string;
  /** epoch ms */
  start: number;
}

/** The complete tracker state for a single user. */
export interface TrackerData {
  categories: Category[];
  entries: Entry[];
  activeTimer: ActiveTimer | null;
}

export type Tab = 'track' | 'stats';
export type RangeKey = 'today' | 'week' | 'month';

export interface ModalState {
  mode: 'add' | 'edit';
  id: string | null;
  catId: string | null;
  date: string;
  start: string;
  end: string;
}
