import { coingeckoClient } from '@/src/shared/api/http-client';
import type {
  CoinMarket,
  CoinDetail,
  CoinChartData,
  SearchCoin,
  TrendingCoin,
} from '@/src/entities/coin/model/types';

export async function fetchMarketData(
  currency = 'usd',
  page = 1,
  perPage = 50,
  sparkline = true
): Promise<CoinMarket[]> {
  const { data } = await coingeckoClient.get<CoinMarket[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline,
      price_change_percentage: '7d',
    },
  });
  return data;
}

export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
  const { data } = await coingeckoClient.get<CoinDetail>(`/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
    },
  });
  return data;
}

export async function fetchCoinChart(
  coinId: string,
  currency = 'usd',
  days: number = 7
): Promise<CoinChartData> {
  const { data } = await coingeckoClient.get<CoinChartData>(
    `/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: currency,
        days,
      },
    }
  );
  return data;
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  const { data } = await coingeckoClient.get<{ coins: SearchCoin[] }>(
    '/search',
    {
      params: { query },
    }
  );
  return data.coins;
}

export async function fetchTrendingCoins(): Promise<TrendingCoin[]> {
  const { data } = await coingeckoClient.get<{ coins: TrendingCoin[] }>(
    '/search/trending'
  );
  return data.coins;
}
