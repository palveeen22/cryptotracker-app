import type { CoinMarket } from '@/src/entities/coin';
import {
  CoinRow,
  connectBinanceWS,
  disconnectBinanceWS,
  useCoinStore,
  useMarketData,
} from '@/src/entities/coin';
import { useSettingsStore } from '@/src/features/settings/model/store';
import { ErrorView } from '@/src/shared/ui/ErrorView';
import { LoadingSpinner } from '@/src/shared/ui/LoadingSpinner';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MarketListProps {
  onCoinLongPress?: (coin: CoinMarket) => void;
}

export function MarketList({ onCoinLongPress }: MarketListProps) {
  const currency = useSettingsStore((s) => s.currency);
  const { data, isLoading, error, refetch } = useMarketData(currency);
  const setRealtimePrices = useCoinStore((s) => s.setRealtimePrices);

  useEffect(() => {
    connectBinanceWS((prices) => {
      setRealtimePrices(prices);
    });

    return () => {
      disconnectBinanceWS();
    };
  }, [setRealtimePrices]);

  const renderItem = useCallback(
    ({ item }: { item: CoinMarket }) => (
      <CoinRow coin={item} currency={currency} />
    ),
    [currency]
  );

  const keyExtractor = useCallback((item: CoinMarket) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorView message="Failed to load market data" onRetry={refetch} />;
  if (!data?.length) return <ErrorView message="No data available" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerRank}>#</Text>
        <Text style={styles.headerName}>Coin</Text>
        <Text style={styles.headerChart}>7D</Text>
        <Text style={styles.headerPrice}>Price</Text>
      </View>
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // estimatedItemSize={64}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  headerRank: {
    width: 28,
    fontSize: 12,
    color: '#636366',
    textAlign: 'center',
  },
  headerName: {
    flex: 1,
    fontSize: 12,
    color: '#636366',
    marginLeft: 42,
  },
  headerChart: {
    width: 60,
    fontSize: 12,
    color: '#636366',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerPrice: {
    width: 90,
    fontSize: 12,
    color: '#636366',
    textAlign: 'right',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#2C2C2E',
    marginLeft: 86,
  },
});
