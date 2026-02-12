import { coingeckoClient } from '@/src/shared/api/http-client';
import type { NewsArticle } from '@/src/entities/news/model/types';

interface CoinGeckoNewsResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      title: string;
      description: string;
      thumb_2x: string;
      url: string;
      created_at: number;
      updated_at: number;
      author: {
        name: string;
      };
      news_site: string;
    };
  }>;
}

export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    const { data } = await coingeckoClient.get<CoinGeckoNewsResponse>('/news');
    return data.data.map((item) => ({
      id: item.id,
      title: item.attributes.title,
      description: item.attributes.description,
      url: item.attributes.url,
      thumb_2x: item.attributes.thumb_2x,
      author: item.attributes.author?.name ?? 'Unknown',
      news_site: item.attributes.news_site,
      created_at: item.attributes.created_at,
      updated_at: item.attributes.updated_at,
    }));
  } catch {
    // Fallback: generate placeholder news from trending data
    return getFallbackNews();
  }
}

async function getFallbackNews(): Promise<NewsArticle[]> {
  try {
    const { data } = await coingeckoClient.get('/search/trending');
    return data.coins.slice(0, 10).map((coin: { item: { id: string; name: string; symbol: string; thumb: string; score: number } }, index: number) => ({
      id: `trending-${coin.item.id}`,
      title: `${coin.item.name} (${coin.item.symbol.toUpperCase()}) is trending #${index + 1}`,
      description: `${coin.item.name} is currently trending on CoinGecko with a score of ${coin.item.score}.`,
      url: `https://www.coingecko.com/en/coins/${coin.item.id}`,
      thumb_2x: coin.item.thumb,
      author: 'CoinGecko Trends',
      news_site: 'CoinGecko',
      created_at: Date.now(),
      updated_at: Date.now(),
    }));
  } catch {
    return [];
  }
}
