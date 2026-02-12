import { STORAGE_KEYS } from '@/src/shared/config/constants';
import { zustandStorage } from '@/src/shared/lib/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Holding } from './types';

interface PortfolioState {
  holdings: Holding[];
  addHolding: (holding: Omit<Holding, 'id' | 'addedAt'>) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, updates: Partial<Pick<Holding, 'amount' | 'buyPrice'>>) => void;
  clearPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],

      addHolding: (holding) => {
        const newHolding: Holding = {
          ...holding,
          id: `${holding.coinId}-${Date.now()}`,
          addedAt: Date.now(),
        };
        set((state) => ({
          holdings: [...state.holdings, newHolding],
        }));
      },

      removeHolding: (id) => {
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        }));
      },

      updateHolding: (id, updates) => {
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }));
      },

      clearPortfolio: () => set({ holdings: [] }),
    }),
    {
      name: STORAGE_KEYS.PORTFOLIO,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const selectHoldings = (state: PortfolioState) => state.holdings;
export const selectHoldingByCoin = (coinId: string) => (state: PortfolioState) =>
  state.holdings.filter((h) => h.coinId === coinId);
