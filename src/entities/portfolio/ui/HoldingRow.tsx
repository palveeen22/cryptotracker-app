import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PriceChange } from '@/src/shared/ui/PriceChange';
import { formatPrice } from '@/src/shared/lib/formatters';
import type { HoldingWithValue } from '@/src/entities/portfolio/model/types';

interface HoldingRowProps {
  holding: HoldingWithValue;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const HoldingRow = React.memo(function HoldingRow({
  holding,
  onPress,
  onLongPress,
}: HoldingRowProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.left}>
        <Image source={{ uri: holding.coinImage }} style={styles.icon} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{holding.coinName}</Text>
          <Text style={styles.amount}>
            {holding.amount} {holding.coinSymbol.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.value}>{formatPrice(holding.currentValue)}</Text>
        <View style={styles.pnlRow}>
          <PriceChange value={holding.pnlPercent} fontSize={12} />
          <Text style={[
            styles.pnlAmount,
            { color: holding.pnl >= 0 ? '#34C759' : '#FF3B30' },
          ]}>
            {' '}{holding.pnl >= 0 ? '+' : ''}{formatPrice(holding.pnl)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1C1C1E',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pnlAmount: {
    fontSize: 12,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
