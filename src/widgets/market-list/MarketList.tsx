import type { CoinMarket } from '@/src/entities/coin';
import {
  CoinRow,
  connectBinanceWS,
  disconnectBinanceWS,
  useCoinStore,
  useMarketData,
} from '@/src/entities/coin';
import { selectWsStatus } from '@/src/entities/coin/model/store';
import { useSettingsStore } from '@/src/features/settings/model/store';
import { ErrorView } from '@/src/shared/ui/ErrorView';
import { LoadingSpinner } from '@/src/shared/ui/LoadingSpinner';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MarketListProps {
  onCoinLongPress?: (coin: CoinMarket) => void;
}

const WS_STATUS_COLORS: Record<string, string> = {
  connected: '#34C759',
  connecting: '#FF9500',
  disconnected: '#636366',
  error: '#FF3B30',
};

const WS_STATUS_LABELS: Record<string, string> = {
  connected: 'LIVE',
  connecting: 'Connecting...',
  disconnected: 'Offline',
  error: 'Error',
};

export function MarketList({ onCoinLongPress }: MarketListProps) {
  const currency = useSettingsStore((s) => s.currency);
  const { data, isLoading, error, refetch } = useMarketData(currency);
  const setRealtimePrices = useCoinStore((s) => s.setRealtimePrices);
  const setWsStatus = useCoinStore((s) => s.setWsStatus);
  const wsStatus = useCoinStore(selectWsStatus);

  useEffect(() => {
    connectBinanceWS(
      (prices) => {
        setRealtimePrices(prices);
      },
      (status) => {
        setWsStatus(status);
      },
    );

    return () => {
      disconnectBinanceWS();
      setWsStatus('disconnected');
    };
  }, [setRealtimePrices, setWsStatus]);

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
        <View style={styles.wsIndicator}>
          <View style={[styles.wsDot, { backgroundColor: WS_STATUS_COLORS[wsStatus] }]} />
          <Text style={[styles.wsLabel, { color: WS_STATUS_COLORS[wsStatus] }]}>
            {WS_STATUS_LABELS[wsStatus]}
          </Text>
        </View>
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
  wsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 8,
  },
  wsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  wsLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
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
