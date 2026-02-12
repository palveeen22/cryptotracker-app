import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  usePortfolioStore,
  selectHoldings,
  HoldingRow,
  PortfolioDonut,
} from '@/src/entities/portfolio';
import type { HoldingWithValue, PortfolioStats } from '@/src/entities/portfolio';
import { useCoinStore } from '@/src/entities/coin';
import { useMarketData } from '@/src/entities/coin';
import { formatPrice, formatPercentage } from '@/src/shared/lib/formatters';
import { EmptyState } from '@/src/shared/ui/EmptyState';

const DONUT_COLORS = [
  '#6C63FF', '#FF6B6B', '#4ECDC4', '#FFE66D',
  '#A8E6CF', '#FF8A80', '#82B1FF', '#B388FF',
];

export function PortfolioSummary() {
  const holdings = usePortfolioStore(selectHoldings);
  const realtimePrices = useCoinStore((s) => s.realtimePrices);
  const { data: marketData } = useMarketData();

  const { holdingsWithValue, stats, donutSegments } = useMemo(() => {
    const priceMap = new Map<string, number>();

    // First check realtime prices, then market data
    marketData?.forEach((coin) => {
      priceMap.set(coin.id, coin.current_price);
    });
    Object.entries(realtimePrices).forEach(([id, data]) => {
      priceMap.set(id, data.price);
    });

    let totalValue = 0;
    let totalCost = 0;

    const holdingsWithValue: HoldingWithValue[] = holdings.map((h) => {
      const currentPrice = priceMap.get(h.coinId) ?? h.buyPrice;
      const currentValue = h.amount * currentPrice;
      const cost = h.amount * h.buyPrice;
      const pnl = currentValue - cost;
      const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;

      totalValue += currentValue;
      totalCost += cost;

      return {
        ...h,
        currentPrice,
        currentValue,
        pnl,
        pnlPercent,
        allocation: 0,
      };
    });

    // Calculate allocations
    holdingsWithValue.forEach((h) => {
      h.allocation = totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0;
    });

    // Sort by value descending
    holdingsWithValue.sort((a, b) => b.currentValue - a.currentValue);

    const stats: PortfolioStats = {
      totalValue,
      totalCost,
      totalPnL: totalValue - totalCost,
      totalPnLPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
    };

    const donutSegments = holdingsWithValue.map((h, i) => ({
      label: h.coinSymbol.toUpperCase(),
      value: h.currentValue,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));

    return { holdingsWithValue, stats, donutSegments };
  }, [holdings, realtimePrices, marketData]);

  if (holdings.length === 0) {
    return (
      <EmptyState
        icon="💼"
        title="No Holdings Yet"
        description="Add your first crypto holding to start tracking your portfolio"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <PortfolioDonut segments={donutSegments} totalValue={stats.totalValue} />
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Cost</Text>
            <Text style={styles.statValue}>{formatPrice(stats.totalCost)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>P&L</Text>
            <Text
              style={[
                styles.statValue,
                { color: stats.totalPnL >= 0 ? '#34C759' : '#FF3B30' },
              ]}
            >
              {stats.totalPnL >= 0 ? '+' : ''}
              {formatPrice(stats.totalPnL)} ({formatPercentage(stats.totalPnLPercent)})
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Holdings</Text>

      <FlashList
        data={holdingsWithValue}
        renderItem={({ item }) => <HoldingRow holding={item} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={68}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#2C2C2E',
    marginLeft: 64,
  },
});
