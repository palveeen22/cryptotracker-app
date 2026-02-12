import { APP_CONFIG, STORAGE_KEYS } from '@/src/shared/config/constants';
import { zustandStorage } from '@/src/shared/lib/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PriceAlert } from './types';

interface AlertState {
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, 'id' | 'isTriggered' | 'createdAt'>) => boolean;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  clearTriggered: () => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],

      addAlert: (alertData) => {
        if (get().alerts.length >= APP_CONFIG.MAX_ALERTS) {
          return false;
        }

        const alert: PriceAlert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          isTriggered: false,
          createdAt: Date.now(),
        };

        set((state) => ({
          alerts: [...state.alerts, alert],
        }));
        return true;
      },

      removeAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        }));
      },

      toggleAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, isActive: !a.isActive } : a
          ),
        }));
      },

      triggerAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id
              ? { ...a, isTriggered: true, isActive: false, triggeredAt: Date.now() }
              : a
          ),
        }));
      },

      clearTriggered: () => {
        set((state) => ({
          alerts: state.alerts.filter((a) => !a.isTriggered),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.ALERTS,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const selectActiveAlerts = (state: AlertState) =>
  state.alerts.filter((a) => a.isActive && !a.isTriggered);

export const selectTriggeredAlerts = (state: AlertState) =>
  state.alerts.filter((a) => a.isTriggered);

export const selectAlertsByCoin = (coinId: string) => (state: AlertState) =>
  state.alerts.filter((a) => a.coinId === coinId);
