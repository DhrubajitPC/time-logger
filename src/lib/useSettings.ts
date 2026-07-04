import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type TimeSettings } from './format';

const KEY = 'timepop_settings_v1';

function load(): TimeSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

/** Display preferences (clock format, seconds). Local to the device by design. */
export function useSettings() {
  const [settings, setSettings] = useState<TimeSettings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const update = useCallback((patch: Partial<TimeSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  return { settings, update };
}
