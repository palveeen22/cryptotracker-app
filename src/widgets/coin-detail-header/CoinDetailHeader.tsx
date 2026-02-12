import { Image, StyleSheet, Text, View } from 'react-native';
import { PriceChange } from '@/src/shared/ui/PriceChange';
import { formatPrice, formatLargeNumber } from '@/src/shared/lib/formatters';
import type { CoinDetail } from '@/src/entities/coin';
import { useCoinStore, selectRealtimePrice } from '@/src/entities/coin';

interface CoinDetailHeaderProps {
  coin: CoinDetail;
  currency?: string;
}

export function CoinDetailHeader({ coin, currency = 'usd' }: CoinDetailHeaderProps) {
  const realtimePrice = useCoinStore(selectRealtimePrice(coin.id));
  const marketData = coin.market_data;

  const displayPrice = realtimePrice?.price ?? marketData.current_price[currency] ?? 0;
  const displayChange = realtimePrice?.changePercent ?? marketData.price_change_percentage_24h;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: coin.image.large }} style={styles.icon} />
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{coin.name}</Text>
          <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{coin.market_cap_rank}</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatPrice(displayPrice, currency)}</Text>
        <PriceChange value={displayChange} fontSize={18} />
      </View>

      <View style={styles.statsGrid}>
        <StatItem
          label="Market Cap"
          value={formatLargeNumber(marketData.market_cap[currency] ?? 0)}
        />
        <StatItem
          label="24h Volume"
          value={formatLargeNumber(marketData.total_volume[currency] ?? 0)}
        />
        <StatItem
          label="24h High"
          value={formatPrice(marketData.high_24h[currency] ?? 0, currency)}
        />
        <StatItem
          label="24h Low"
          value={formatPrice(marketData.low_24h[currency] ?? 0, currency)}
        />
        <StatItem
          label="Circulating"
          value={formatLargeNumber(marketData.circulating_supply)}
        />
        <StatItem
          label="ATH"
          value={formatPrice(marketData.ath[currency] ?? 0, currency)}
        />
      </View>

      <View style={styles.timeframes}>
        <TimeframeItem label="7D" value={marketData.price_change_percentage_7d} />
        <TimeframeItem label="30D" value={marketData.price_change_percentage_30d} />
        <TimeframeItem label="1Y" value={marketData.price_change_percentage_1y} />
      </View>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function TimeframeItem({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.timeframeItem}>
      <Text style={styles.timeframeLabel}>{label}</Text>
      <PriceChange value={value ?? 0} fontSize={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  symbol: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  rankBadge: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    width: '47%',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  timeframes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingVertical: 12,
  },
  timeframeItem: {
    alignItems: 'center',
    gap: 4,
  },
  timeframeLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
});
