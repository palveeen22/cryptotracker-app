import React from 'react';
import { Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { formatPrice } from '@/src/shared/lib/formatters';
import type { PriceAlert } from '@/src/entities/alert/model/types';

interface AlertRowProps {
  alert: PriceAlert;
  onToggle: () => void;
  onDelete: () => void;
}

export const AlertRow = React.memo(function AlertRow({
  alert,
  onToggle,
  onDelete,
}: AlertRowProps) {
  const conditionLabel = alert.condition === 'above' ? 'Above' : 'Below';
  const conditionColor = alert.condition === 'above' ? '#34C759' : '#FF3B30';

  return (
    <Pressable style={styles.container} onLongPress={onDelete}>
      <Image source={{ uri: alert.coinImage }} style={styles.icon} />

      <View style={styles.info}>
        <Text style={styles.coinName}>{alert.coinName}</Text>
        <View style={styles.conditionRow}>
          <Text style={[styles.condition, { color: conditionColor }]}>
            {conditionLabel}
          </Text>
          <Text style={styles.targetPrice}>
            {formatPrice(alert.targetPrice)}
          </Text>
        </View>
        {alert.isTriggered && (
          <Text style={styles.triggered}>Triggered!</Text>
        )}
      </View>

      {!alert.isTriggered && (
        <Switch
          value={alert.isActive}
          onValueChange={onToggle}
          trackColor={{ false: '#3A3A3C', true: '#6C63FF' }}
          thumbColor="#FFFFFF"
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1C1C1E',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  coinName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  condition: {
    fontSize: 13,
    fontWeight: '600',
  },
  targetPrice: {
    fontSize: 13,
    color: '#8E8E93',
    fontVariant: ['tabular-nums'],
  },
  triggered: {
    fontSize: 12,
    color: '#FFD60A',
    fontWeight: '600',
    marginTop: 2,
  },
});
