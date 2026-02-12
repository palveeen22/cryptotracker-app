import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const VARIANT_COLORS = {
  default: { bg: '#2C2C2E', text: '#FFFFFF' },
  success: { bg: '#1B3A2D', text: '#34C759' },
  danger: { bg: '#3A1B1B', text: '#FF3B30' },
  warning: { bg: '#3A351B', text: '#FFCC00' },
} as const;

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
