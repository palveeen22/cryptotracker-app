import { STORAGE_KEYS } from '@/src/shared/config/constants';
import { zustandStorage } from '@/src/shared/lib/storage';
import type { Currency } from '@/src/shared/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  currency: Currency;
  theme: 'dark' | 'light' | 'system';
  notificationsEnabled: boolean;
  hapticEnabled: boolean;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: SettingsState['theme']) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'usd',
      theme: 'dark',
      notificationsEnabled: true,
      hapticEnabled: true,

      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setHapticEnabled: (hapticEnabled) => set({ hapticEnabled }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
