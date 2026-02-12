import type { PriceAlert } from '@/src/entities/alert';
import {
  AlertRow,
  selectActiveAlerts,
  selectTriggeredAlerts,
  useAlertStore,
} from '@/src/entities/alert';
import type { CoinMarket } from '@/src/entities/coin';
import { useMarketData } from '@/src/entities/coin';
import { CreateAlertSheet } from '@/src/features/alerts/create-alert/CreateAlertSheet';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlertsScreen() {
  const activeAlerts = useAlertStore(selectActiveAlerts);
  const triggeredAlerts = useAlertStore(selectTriggeredAlerts);
  const toggleAlert = useAlertStore((s) => s.toggleAlert);
  const removeAlert = useAlertStore((s) => s.removeAlert);
  const clearTriggered = useAlertStore((s) => s.clearTriggered);
  const allAlerts = [...activeAlerts, ...triggeredAlerts];

  const [showCreate, setShowCreate] = useState(false);
  const [showCoinPicker, setShowCoinPicker] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const { data: marketData } = useMarketData();

  const handleDelete = (alert: PriceAlert) => {
    Alert.alert('Delete Alert', `Remove alert for ${alert.coinName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeAlert(alert.id) },
    ]);
  };

  const handleAddPress = () => {
    if (!marketData?.length) {
      Alert.alert('Loading', 'Please wait for market data to load');
      return;
    }
    setShowCoinPicker(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <View style={styles.headerActions}>
          {triggeredAlerts.length > 0 && (
            <Pressable style={styles.clearButton} onPress={clearTriggered}>
              <Text style={styles.clearText}>Clear Triggered</Text>
            </Pressable>
          )}
          <Pressable style={styles.addButton} onPress={handleAddPress}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {allAlerts.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No Price Alerts"
          description="Create alerts to get notified when prices reach your target"
        />
      ) : (
        <FlashList
          data={allAlerts}
          renderItem={({ item }) => (
            <AlertRow
              alert={item}
              onToggle={() => toggleAlert(item.id)}
              onDelete={() => handleDelete(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          // estimatedItemSize={68}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Coin picker for alert creation */}
      {showCoinPicker && marketData && (
        <View style={styles.overlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Coin</Text>
              <Pressable onPress={() => setShowCoinPicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
            {marketData.slice(0, 20).map((coin) => (
              <Pressable
                key={coin.id}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedCoin(coin);
                  setShowCoinPicker(false);
                  setShowCreate(true);
                }}
              >
                <Text style={styles.pickerCoinName}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <CreateAlertSheet
        visible={showCreate}
        coin={selectedCoin}
        onClose={() => {
          setShowCreate(false);
          setSelectedCoin(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  clearText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#2C2C2E',
    marginLeft: 64,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  pickerCoinName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
