import AsyncStorage from '@react-native-async-storage/async-storage';
import {produce} from 'immer';
// eslint-disable-next-line
import ReactNativeBlobUtil from 'react-native-blob-util';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import createVanilla from 'zustand/vanilla';
import {AdhanEntry, INITIAL_ADHAN_AUDIO_ENTRIES} from '@/assets/adhan_entries';
import {CountryInfo, SearchResult} from '@/utils/geonames';
import {PREFERRED_LOCALE} from '@/utils/locale';

const SETTINGS_STORAGE_KEY = 'SETTINGS_STORAGE';

type SettingsStore = {
  // other
  SELECTED_LOCALE: string;
  APP_INITIAL_CONFIG_DONE: boolean;
  APP_INTRO_DONE: boolean;
  SAVED_ADHAN_AUDIO_ENTRIES: AdhanEntry[];
  SELECTED_ADHAN_ENTRY: AdhanEntry;
  LOCATION_COUNTRY: CountryInfo | undefined;
  LOCATION_CITY: SearchResult | undefined;
  SCHEDULED_ALARM_TIMESTAMP?: number;
  LAST_APP_FOCUS_TIMESTAMP?: number;

  // helper functions
  saveAdhanEntry: (entry: AdhanEntry) => void;
  deleteAdhanEntry: (entry: AdhanEntry) => void;
  setSetting: <T extends keyof SettingsStore>(
    key: T,
    val: SettingsStore[T],
  ) => void;
  setSettingCurry: <T extends keyof SettingsStore>(
    key: T,
  ) => (val: SettingsStore[T]) => void;
  removeSetting: (key: keyof SettingsStore) => () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

const invalidKeys = ['setSetting', 'setSettingCurry', 'removeSetting'];

export const settings = createVanilla<SettingsStore>()(
  persist(
    set => ({
      SELECTED_LOCALE: PREFERRED_LOCALE,
      APP_INITIAL_CONFIG_DONE: false,
      APP_INTRO_DONE: false,
      SAVED_ADHAN_AUDIO_ENTRIES: INITIAL_ADHAN_AUDIO_ENTRIES,
      SELECTED_ADHAN_ENTRY: INITIAL_ADHAN_AUDIO_ENTRIES[0],
      LOCATION_COUNTRY: undefined,
      LOCATION_CITY: undefined,

      // adhan entry helper
      saveAdhanEntry: entry =>
        set(
          produce<SettingsStore>(draft => {
            let fIndex = draft.SAVED_ADHAN_AUDIO_ENTRIES.findIndex(
              e => e.id === entry.id,
            );
            if (fIndex !== -1) {
              draft.SAVED_ADHAN_AUDIO_ENTRIES.splice(fIndex, 1, entry);
            } else {
              draft.SAVED_ADHAN_AUDIO_ENTRIES.push(entry);
            }
          }),
        ),

      deleteAdhanEntry: entry =>
        set(
          produce<SettingsStore>(draft => {
            let fIndex = draft.SAVED_ADHAN_AUDIO_ENTRIES.findIndex(
              e => e.id === entry.id,
            );
            if (fIndex !== -1) {
              draft.SAVED_ADHAN_AUDIO_ENTRIES.splice(fIndex, 1);
              if (typeof entry.filepath === 'string') {
                ReactNativeBlobUtil.fs.unlink(entry.filepath).catch(err => {
                  console.error(err);
                });
              }
            }
            if (
              draft.SELECTED_ADHAN_ENTRY &&
              draft.SELECTED_ADHAN_ENTRY.id === entry.id
            ) {
              draft.SELECTED_ADHAN_ENTRY = draft.SAVED_ADHAN_AUDIO_ENTRIES[0];
            }
          }),
        ),

      // general
      setSetting: <T extends keyof SettingsStore>(
        key: T,
        val: SettingsStore[T],
      ) =>
        set(
          produce<SettingsStore>(draft => {
            if (invalidKeys.includes(key)) return;
            draft[key] = val;
          }),
        ),
      setSettingCurry:
        <T extends keyof SettingsStore>(key: T) =>
        (val: SettingsStore[T]) =>
          set(
            produce<SettingsStore>(draft => {
              if (invalidKeys.includes(key)) return;
              draft[key] = val;
            }),
          ),
      removeSetting: key => () =>
        set(
          produce<SettingsStore>(draft => {
            if (invalidKeys.includes(key)) return;
            delete draft[key];
          }),
        ),
      _hasHydrated: false,
      setHasHydrated: state => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      getStorage: () => AsyncStorage,
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !invalidKeys.includes(key)),
        ),
      onRehydrateStorage: () => (state, err) => {
        if (state && !err) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);

export function waitTillHydration() {
  if (settings.getState()._hasHydrated) {
    return Promise.resolve();
  }

  return new Promise<void>(resolve => {
    const unsubFinishHydration = settings.persist.onFinishHydration(() => {
      resolve();
      unsubFinishHydration();
    });
  });
}

export const useSettings = create(settings);

export function useSettingsHelper<T extends keyof SettingsStore>(key: T) {
  return useSettings(state => [state[key], state.setSettingCurry(key)]) as [
    SettingsStore[T],
    (val: SettingsStore[T]) => void,
  ];
}
