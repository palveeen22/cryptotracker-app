import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PriceChange } from '@/src/shared/ui/PriceChange';
import { formatPrice, formatLargeNumber } from '@/src/shared/lib/formatters';
import { useCoinStore, selectRealtimePrice } from '@/src/entities/coin/model/store';
import type { CoinMarket } from '@/src/entities/coin/model/types';
import { MiniChart } from './MiniChart';

interface CoinRowProps {
  coin: CoinMarket;
  currency?: string;
}

export const CoinRow = React.memo(function CoinRow({ coin, currency = 'usd' }: CoinRowProps) {
  const router = useRouter();
  const realtimePrice = useCoinStore(selectRealtimePrice(coin.id));

  const displayPrice = realtimePrice?.price ?? coin.current_price;
  const displayChange = realtimePrice?.changePercent ?? coin.price_change_percentage_24h;

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/coin/${coin.id}`)}
    >
      <View style={styles.left}>
        <Text style={styles.rank}>{coin.market_cap_rank}</Text>
        <Image source={{ uri: coin.image }} style={styles.icon} />
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {coin.name}
          </Text>
          <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {coin.sparkline_in_7d?.price && (
          <MiniChart
            data={coin.sparkline_in_7d.price}
            isPositive={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0}
          />
        )}
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{formatPrice(displayPrice, currency)}</Text>
        <PriceChange value={displayChange ?? 0} fontSize={12} />
      </View>
    </Pressable>
  );
}, (prev, next) => {
  return prev.coin.id === next.coin.id
    && prev.coin.current_price === next.coin.current_price
    && prev.coin.price_change_percentage_24h === next.coin.price_change_percentage_24h;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    width: 28,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  symbol: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  chartContainer: {
    width: 60,
    height: 30,
    marginHorizontal: 8,
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
});
