import { StyleSheet, Text } from 'react-native';
import { formatPercentage } from '@/src/shared/lib/formatters';

interface PriceChangeProps {
  value: number;
  fontSize?: number;
}

export function PriceChange({ value, fontSize = 14 }: PriceChangeProps) {
  const isPositive = value >= 0;
  const color = isPositive ? '#34C759' : '#FF3B30';

  return (
    <Text style={[styles.text, { color, fontSize }]}>
      {formatPercentage(value)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
