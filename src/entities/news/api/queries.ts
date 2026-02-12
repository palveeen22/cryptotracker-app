import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIG } from '@/src/shared/config/constants';
import { fetchCryptoNews } from './news-api';

export function useNewsData() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchCryptoNews,
    staleTime: QUERY_CONFIG.NEWS_STALE_TIME,
  });
}
