import { create } from 'zustand';
import type { RealtimePrice } from './types';

interface CoinStoreState {
  realtimePrices: Record<string, RealtimePrice>;
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  setRealtimePrices: (prices: Map<string, RealtimePrice>) => void;
  setWsStatus: (status: CoinStoreState['wsStatus']) => void;
  getRealtimePrice: (coinId: string) => RealtimePrice | undefined;
}

export const useCoinStore = create<CoinStoreState>((set, get) => ({
  realtimePrices: {},
  wsStatus: 'disconnected',

  setRealtimePrices: (prices) => {
    set((state) => {
      const updated = { ...state.realtimePrices };
      prices.forEach((value, key) => {
        updated[key] = value;
      });
      return { realtimePrices: updated };
    });
  },

  setWsStatus: (wsStatus) => set({ wsStatus }),

  getRealtimePrice: (coinId) => get().realtimePrices[coinId],
}));

export const selectRealtimePrice = (coinId: string) => (state: CoinStoreState) =>
  state.realtimePrices[coinId];

export const selectWsStatus = (state: CoinStoreState) => state.wsStatus;
