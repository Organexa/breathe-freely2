import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { AppState as RNAppState } from 'react-native';
import { rescheduleAll } from '../notifications/notifications';
import { clearAll, loadAll, saveCravings, saveSettings } from '../storage/storage';
import { Action, AppState, initialState, reducer, sortCravings } from './reducer';
import { BackupData, Craving, Settings, Trigger } from './types';

interface AppActions {
  completeOnboarding: (settings: Partial<Settings>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setQuitAt: (quitAt: number) => void;
  logCraving: (trigger: Trigger, resisted: boolean) => void;
  resetAfterSlip: () => void;
  deleteCraving: (id: string) => void;
  restore: (data: BackupData) => void;
  resetAll: () => Promise<void>;
  retryLoad: () => void;
}

interface ContextValue extends AppActions {
  state: AppState;
}

const AppContext = createContext<ContextValue | null>(null);

const newId = (): string => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function AppProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastSaved = useRef<{ settings?: Settings; cravings?: Craving[] }>({});

  const load = useCallback(() => {
    loadAll().then((r) => {
      const cravings = sortCravings(r.cravings);
      lastSaved.current = { settings: r.settings, cravings };
      dispatch({ type: 'loaded', settings: r.settings, cravings, failed: r.failed });
    });
  }, []);

  useEffect(load, [load]);

  // Write-through persistence. Skipped when the initial read failed, so stored data is never
  // overwritten by defaults.
  useEffect(() => {
    if (!state.loaded || state.loadFailed) return;
    if (lastSaved.current.settings !== state.settings) {
      lastSaved.current.settings = state.settings;
      saveSettings(state.settings);
    }
    if (lastSaved.current.cravings !== state.cravings) {
      lastSaved.current.cravings = state.cravings;
      saveCravings(state.cravings);
    }
  }, [state.loaded, state.loadFailed, state.settings, state.cravings]);

  // Keep reminders in line with settings.
  const s = state.settings;
  useEffect(() => {
    if (!state.loaded) return;
    rescheduleAll(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.loaded,
    s.onboarded,
    s.notificationsEnabled,
    s.morningEnabled,
    s.eveningEnabled,
    s.weeklyEnabled,
    s.morningTime.hour,
    s.morningTime.minute,
    s.eveningTime.hour,
    s.eveningTime.minute,
    s.quitAt,
  ]);

  // Re-read storage when returning to the app if the first read failed.
  useEffect(() => {
    const sub = RNAppState.addEventListener('change', (next) => {
      if (next === 'active' && state.loadFailed) load();
    });
    return () => sub.remove();
  }, [state.loadFailed, load]);

  const actions = useMemo<AppActions>(() => {
    const d = (a: Action): void => dispatch(a);
    return {
      completeOnboarding: (settings) => d({ type: 'completeOnboarding', settings, now: Date.now() }),
      updateSettings: (patch) => d({ type: 'updateSettings', patch }),
      setQuitAt: (quitAt) => d({ type: 'setQuitAt', quitAt: Math.min(quitAt, Date.now()) }),
      logCraving: (trigger, resisted) =>
        d({ type: 'logCraving', craving: { id: newId(), at: Date.now(), trigger, resisted } }),
      resetAfterSlip: () => d({ type: 'resetAfterSlip', now: Date.now() }),
      deleteCraving: (id) => d({ type: 'deleteCraving', id }),
      restore: (data) => d({ type: 'restore', data }),
      resetAll: async () => {
        await clearAll();
        d({ type: 'resetAll' });
      },
      retryLoad: load,
    };
  }, [load]);

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): ContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
