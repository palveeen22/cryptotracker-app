import { useState, useMemo } from 'react';
import { useSearchCoins, useTrendingCoins } from '@/src/entities/coin';

export function useSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const searchResults = useSearchCoins(debouncedQuery);
  const trending = useTrendingCoins();

  const showTrending = query.length < 2;

  return {
    query,
    setQuery,
    results: searchResults.data ?? [],
    trending: trending.data ?? [],
    isLoading: searchResults.isLoading || trending.isLoading,
    showTrending,
  };
}

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
