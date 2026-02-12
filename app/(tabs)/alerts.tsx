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
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AlertsScreen() {
  const activeAlerts = useAlertStore(useShallow(selectActiveAlerts));
  const triggeredAlerts = useAlertStore(useShallow(selectTriggeredAlerts));
  const toggleAlert = useAlertStore((s) => s.toggleAlert);
  const removeAlert = useAlertStore((s) => s.removeAlert);
  const clearTriggered = useAlertStore((s) => s.clearTriggered);
  const allAlerts = [...activeAlerts, ...triggeredAlerts];

  const [showCreate, setShowCreate] = useState(false);
  const [showCoinPicker, setShowCoinPicker] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const { data: marketData } = useMarketData();
  const [searchQuery, setSearchQuery] = useState<string>('');


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

    const filteredCoins = marketData?.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Bottom Sheet Modal - Drawer Style */}
<Modal
        visible={showCoinPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCoinPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.backdrop} 
            onPress={() => setShowCoinPicker(false)}
          />
          
          <View style={styles.drawerContainer}>
            <View style={styles.dragHandle} />
            
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Select Coin</Text>
              <Pressable 
                onPress={() => setShowCoinPicker(false)}
                hitSlop={8}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search coins..."
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#8E8E93" />
                </Pressable>
              )}
            </View>

            {filteredCoins && (
              <Text style={styles.coinCount}>
                {filteredCoins.length} coins
              </Text>
            )}

            <FlatList
              data={filteredCoins || []}
              keyExtractor={(coin) => coin.id}
              renderItem={({ item: coin }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.coinItem,
                    pressed && styles.coinItemPressed,
                  ]}
                  onPress={() => {
                    setSelectedCoin(coin);
                    setShowCoinPicker(false);
                    setShowCreate(true);
                    setSearchQuery(''); // Clear search
                  }}
                >
                  <View style={styles.coinInfo}>
                    <Text style={styles.coinName}>{coin.name}</Text>
                    <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.coinSeparator} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.coinListContent}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>

      {/* Create Alert Sheet */}
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

   searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },

  // Bottom Sheet Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    height: SCREEN_HEIGHT * 0.7, // 70% of screen height
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coinCount: {
    fontSize: 13,
    color: '#8E8E93',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  coinListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  coinItemPressed: {
    backgroundColor: '#6C63FF',
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  coinSymbol: {
    fontSize: 13,
    color: '#8E8E93',
  },
  coinSeparator: {
    height: 8,
  },
});