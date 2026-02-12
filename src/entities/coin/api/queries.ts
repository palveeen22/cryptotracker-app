import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIG } from '@/src/shared/config/constants';
import {
  fetchMarketData,
  fetchCoinDetail,
  fetchCoinChart,
  searchCoins,
  fetchTrendingCoins,
} from './coingecko';
import type { ChartDataPoint } from '@/src/entities/coin/model/types';

export function useMarketData(currency = 'usd', page = 1) {
  return useQuery({
    queryKey: ['market', currency, page],
    queryFn: () => fetchMarketData(currency, page),
    staleTime: QUERY_CONFIG.MARKET_STALE_TIME,
  });
}

export function useCoinDetail(coinId: string) {
  return useQuery({
    queryKey: ['coin-detail', coinId],
    queryFn: () => fetchCoinDetail(coinId),
    staleTime: QUERY_CONFIG.DETAIL_STALE_TIME,
    enabled: !!coinId,
  });
}

export function useCoinChart(coinId: string, currency = 'usd', days = 7) {
  return useQuery({
    queryKey: ['coin-chart', coinId, currency, days],
    queryFn: () => fetchCoinChart(coinId, currency, days),
    staleTime: QUERY_CONFIG.CHART_STALE_TIME,
    enabled: !!coinId,
    select: (data): ChartDataPoint[] =>
      data.prices.map(([timestamp, value]) => ({ timestamp, value })),
  });
}

export function useSearchCoins(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 2,
    staleTime: QUERY_CONFIG.DETAIL_STALE_TIME,
  });
}

export function useTrendingCoins() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingCoins,
    staleTime: QUERY_CONFIG.DETAIL_STALE_TIME,
  });
}
