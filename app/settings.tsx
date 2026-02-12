import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSettingsStore } from '@/src/features/settings/model/store';
import { requestNotificationPermissions } from '@/src/features/alerts/check-alerts/useAlertChecker';
import type { Currency } from '@/src/shared/types';

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'jpy', label: 'JPY (¥)' },
  { value: 'idr', label: 'IDR (Rp)' },
];

export default function SettingsScreen() {
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const setHapticEnabled = useSettingsStore((s) => s.setHapticEnabled);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Currency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency</Text>
        {CURRENCIES.map((c) => (
          <Pressable
            key={c.value}
            style={styles.row}
            onPress={() => setCurrency(c.value)}
          >
            <Text style={styles.rowLabel}>{c.label}</Text>
            {currency === c.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#3A3A3C', true: '#6C63FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Haptic Feedback</Text>
          <Switch
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
            trackColor={{ false: '#3A3A3C', true: '#6C63FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Data Source</Text>
          <Text style={styles.rowValue}>CoinGecko API</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Real-time Prices</Text>
          <Text style={styles.rowValue}>Binance WebSocket</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  rowLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  rowValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  checkmark: {
    fontSize: 18,
    color: '#6C63FF',
    fontWeight: '700',
  },
});
