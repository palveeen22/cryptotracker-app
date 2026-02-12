import { useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { useCoinChart } from '@/src/entities/coin';
import { formatPrice, formatDate } from '@/src/shared/lib/formatters';
import { LoadingSpinner } from '@/src/shared/ui/LoadingSpinner';
import type { ChartInterval } from '@/src/shared/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_HEIGHT = 240;

const INTERVALS: { label: string; days: ChartInterval }[] = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
];

interface PriceChartProps {
  coinId: string;
  currency?: string;
}

export function PriceChart({ coinId, currency = 'usd' }: PriceChartProps) {
  const [selectedDays, setSelectedDays] = useState<ChartInterval>(7);
  const { data: chartData, isLoading } = useCoinChart(coinId, currency, selectedDays);

  const formattedData = useMemo(() => {
    if (!chartData) return [];
    return chartData.map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
    }));
  }, [chartData]);

  const priceChange = useMemo(() => {
    if (!formattedData.length) return 0;
    const first = formattedData[0].value;
    const last = formattedData[formattedData.length - 1].value;
    return ((last - first) / first) * 100;
  }, [formattedData]);

  const isPositive = priceChange >= 0;
  const chartColor = isPositive ? '#34C759' : '#FF3B30';

  if (isLoading) {
    return (
      <View style={[styles.container, { height: CHART_HEIGHT + 60 }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!formattedData.length) {
    return (
      <View style={[styles.container, { height: CHART_HEIGHT + 60 }]}>
        <Text style={styles.noData}>No chart data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart.Provider data={formattedData}>
        <LineChart width={SCREEN_WIDTH} height={CHART_HEIGHT}>
          <LineChart.Path color={chartColor} width={2}>
            <LineChart.Gradient color={chartColor} />
          </LineChart.Path>
          <LineChart.CursorCrosshair color={chartColor}>
            <LineChart.Tooltip
              style={styles.tooltip}
              textStyle={styles.tooltipText}
            />
            <LineChart.Tooltip position="bottom">
              <LineChart.DatetimeText
                style={styles.tooltipDate}
                options={{
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }}
              />
            </LineChart.Tooltip>
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Provider>

      <View style={styles.intervals}>
        {INTERVALS.map((interval) => (
          <Pressable
            key={interval.days}
            style={[
              styles.intervalButton,
              selectedDays === interval.days && styles.intervalActive,
            ]}
            onPress={() => setSelectedDays(interval.days)}
          >
            <Text
              style={[
                styles.intervalText,
                selectedDays === interval.days && styles.intervalTextActive,
              ]}
            >
              {interval.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
  },
  tooltip: {
    backgroundColor: '#2C2C2E',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tooltipDate: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  intervals: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  intervalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  intervalActive: {
    backgroundColor: '#6C63FF',
  },
  intervalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  intervalTextActive: {
    color: '#FFFFFF',
  },
  noData: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
  },
});
