import { useCoinStore, selectRealtimePrice, selectWsStatus } from '@/src/entities/coin/model/store';
import type { RealtimePrice } from '@/src/entities/coin/model/types';

const initialState = useCoinStore.getState();

beforeEach(() => {
  useCoinStore.setState(initialState, true);
});

describe('useCoinStore', () => {
  describe('setRealtimePrices', () => {
    it('should merge prices into state', () => {
      const prices = new Map<string, RealtimePrice>([
        ['bitcoin', { price: 50000, changePercent: 2.5, volume: 1000000 }],
        ['ethereum', { price: 3000, changePercent: -1.2, volume: 500000 }],
      ]);

      useCoinStore.getState().setRealtimePrices(prices);

      const state = useCoinStore.getState();
      expect(state.realtimePrices['bitcoin']).toEqual({
        price: 50000,
        changePercent: 2.5,
        volume: 1000000,
      });
      expect(state.realtimePrices['ethereum']).toEqual({
        price: 3000,
        changePercent: -1.2,
        volume: 500000,
      });
    });

    it('should merge with existing prices without overwriting others', () => {
      const first = new Map<string, RealtimePrice>([
        ['bitcoin', { price: 50000, changePercent: 2.5, volume: 1000000 }],
      ]);
      const second = new Map<string, RealtimePrice>([
        ['ethereum', { price: 3000, changePercent: -1.2, volume: 500000 }],
      ]);

      useCoinStore.getState().setRealtimePrices(first);
      useCoinStore.getState().setRealtimePrices(second);

      const state = useCoinStore.getState();
      expect(state.realtimePrices['bitcoin']).toBeDefined();
      expect(state.realtimePrices['ethereum']).toBeDefined();
    });

    it('should update existing price for the same coin', () => {
      const initial = new Map<string, RealtimePrice>([
        ['bitcoin', { price: 50000, changePercent: 2.5, volume: 1000000 }],
      ]);
      const updated = new Map<string, RealtimePrice>([
        ['bitcoin', { price: 51000, changePercent: 3.0, volume: 1100000 }],
      ]);

      useCoinStore.getState().setRealtimePrices(initial);
      useCoinStore.getState().setRealtimePrices(updated);

      expect(useCoinStore.getState().realtimePrices['bitcoin'].price).toBe(51000);
    });
  });

  describe('setWsStatus', () => {
    it('should update WebSocket status', () => {
      useCoinStore.getState().setWsStatus('connecting');
      expect(useCoinStore.getState().wsStatus).toBe('connecting');

      useCoinStore.getState().setWsStatus('connected');
      expect(useCoinStore.getState().wsStatus).toBe('connected');

      useCoinStore.getState().setWsStatus('error');
      expect(useCoinStore.getState().wsStatus).toBe('error');
    });

    it('should default to disconnected', () => {
      expect(useCoinStore.getState().wsStatus).toBe('disconnected');
    });
  });

  describe('getRealtimePrice', () => {
    it('should return price for a known coin', () => {
      const prices = new Map<string, RealtimePrice>([
        ['bitcoin', { price: 50000, changePercent: 2.5, volume: 1000000 }],
      ]);
      useCoinStore.getState().setRealtimePrices(prices);

      expect(useCoinStore.getState().getRealtimePrice('bitcoin')).toEqual({
        price: 50000,
        changePercent: 2.5,
        volume: 1000000,
      });
    });

    it('should return undefined for an unknown coin', () => {
      expect(useCoinStore.getState().getRealtimePrice('unknown')).toBeUndefined();
    });
  });

  describe('selectors', () => {
    it('selectRealtimePrice should return price for given coinId', () => {
      const prices = new Map<string, RealtimePrice>([
        ['bitcoin', { price: 50000, changePercent: 2.5, volume: 1000000 }],
      ]);
      useCoinStore.getState().setRealtimePrices(prices);

      const selector = selectRealtimePrice('bitcoin');
      expect(selector(useCoinStore.getState())).toEqual({
        price: 50000,
        changePercent: 2.5,
        volume: 1000000,
      });
    });

    it('selectWsStatus should return current status', () => {
      useCoinStore.getState().setWsStatus('connected');
      expect(selectWsStatus(useCoinStore.getState())).toBe('connected');
    });
  });
});
