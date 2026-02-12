import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PriceChange } from '@/src/shared/ui/PriceChange';
import { formatPrice } from '@/src/shared/lib/formatters';
import type { CoinMarket } from '@/src/entities/coin/model/types';

interface CoinCardProps {
  coin: CoinMarket;
  currency?: string;
}

export const CoinCard = React.memo(function CoinCard({ coin, currency = 'usd' }: CoinCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/coin/${coin.id}`)}
    >
      <View style={styles.header}>
        <Image source={{ uri: coin.image }} style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
          <Text style={styles.name} numberOfLines={1}>{coin.name}</Text>
        </View>
      </View>
      <Text style={styles.price}>{formatPrice(coin.current_price, currency)}</Text>
      <PriceChange value={coin.price_change_percentage_24h ?? 0} fontSize={13} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 14,
    width: 140,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  info: {
    flex: 1,
  },
  symbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 11,
    color: '#8E8E93',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
});
