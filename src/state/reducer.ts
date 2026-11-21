import { BackupData, Craving, DEFAULT_SETTINGS, Settings } from './types';

export interface AppState {
  loaded: boolean;
  loadFailed: boolean;
  settings: Settings;
  cravings: Craving[];
}

export type Action =
  | { type: 'loaded'; settings: Settings; cravings: Craving[]; failed: boolean }
  | { type: 'completeOnboarding'; settings: Partial<Settings>; now: number }
  | { type: 'updateSettings'; patch: Partial<Settings> }
  | { type: 'setQuitAt'; quitAt: number }
  | { type: 'logCraving'; craving: Craving }
  | { type: 'resetAfterSlip'; now: number }
  | { type: 'deleteCraving'; id: string }
  | { type: 'restore'; data: BackupData }
  | { type: 'resetAll' };

export const initialState: AppState = {
  loaded: false,
  loadFailed: false,
  settings: DEFAULT_SETTINGS,
  cravings: [],
};

export const sortCravings = (list: Craving[]): Craving[] => [...list].sort((a, b) => b.at - a.at);

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'loaded':
      return {
        loaded: true,
        loadFailed: action.failed,
        settings: action.settings,
        cravings: action.cravings,
      };
    case 'completeOnboarding': {
      const quitAt = Math.min(action.settings.quitAt ?? action.now, action.now);
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
          quitAt,
          firstQuitAt: quitAt,
          onboarded: true,
        },
      };
    }
    case 'updateSettings':
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case 'setQuitAt':
      return {
        ...state,
        settings: {
          ...state.settings,
          quitAt: action.quitAt,
          firstQuitAt: Math.min(state.settings.firstQuitAt || action.quitAt, action.quitAt),
        },
      };
    case 'logCraving':
      return { ...state, cravings: sortCravings([action.craving, ...state.cravings]) };
    case 'resetAfterSlip':
      return { ...state, settings: { ...state.settings, quitAt: action.now } };
    case 'deleteCraving':
      return { ...state, cravings: state.cravings.filter((c) => c.id !== action.id) };
    case 'restore':
      return {
        ...state,
        loadFailed: false,
        settings: action.data.settings,
        cravings: sortCravings(action.data.cravings),
      };
    case 'resetAll':
      return { ...initialState, loaded: true };
    default:
      return state;
  }
}
