import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatPrice } from '@/src/shared/lib/formatters';

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface PortfolioDonutProps {
  segments: DonutSegment[];
  totalValue: number;
  size?: number;
}

const COLORS = [
  '#6C63FF', '#FF6B6B', '#4ECDC4', '#FFE66D',
  '#A8E6CF', '#FF8A80', '#82B1FF', '#B388FF',
];

export const PortfolioDonut = React.memo(function PortfolioDonut({
  segments,
  totalValue,
  size = 180,
}: PortfolioDonutProps) {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const arcs = useMemo(() => {
    let offset = 0;
    return segments.map((segment, index) => {
      const percentage = totalValue > 0 ? segment.value / totalValue : 0;
      const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
      const strokeDashoffset = -offset;
      offset += circumference * percentage;

      return {
        ...segment,
        color: segment.color || COLORS[index % COLORS.length],
        strokeDasharray,
        strokeDashoffset,
        percentage,
      };
    });
  }, [segments, totalValue, circumference]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#2C2C2E"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, index) => (
          <Circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={arc.strokeDasharray}
            strokeDashoffset={arc.strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${center}, ${center}`}
          />
        ))}
      </Svg>
      <View style={[styles.centerText, { width: size, height: size }]}>
        <Text style={styles.totalLabel}>Total Value</Text>
        <Text style={styles.totalValue}>{formatPrice(totalValue)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
});
