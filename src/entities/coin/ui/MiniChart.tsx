import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
}

export const MiniChart = React.memo(function MiniChart({
  data,
  width = 60,
  height = 30,
  isPositive = true,
}: MiniChartProps) {
  const points = useMemo(() => {
    if (data.length < 2) return '';

    const sampled = data.length > 30
      ? data.filter((_, i) => i % Math.ceil(data.length / 30) === 0)
      : data;

    const min = Math.min(...sampled);
    const max = Math.max(...sampled);
    const range = max - min || 1;

    return sampled
      .map((value, index) => {
        const x = (index / (sampled.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, width, height]);

  if (!points) return null;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#34C759' : '#FF3B30'}
          strokeWidth={1.5}
        />
      </Svg>
    </View>
  );
});
