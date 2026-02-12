import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MarketList } from '@/src/widgets/market-list/MarketList';
import { useAlertChecker } from '@/src/features/alerts/check-alerts/useAlertChecker';
import { AddHoldingSheet } from '@/src/features/portfolio/add-holding/AddHoldingSheet';
import type { CoinMarket } from '@/src/entities/coin';

export default function MarketScreen() {
  const router = useRouter();
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const [showAddHolding, setShowAddHolding] = useState(false);

  // Check price alerts against realtime data
  useAlertChecker();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Market</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <MarketList
        onCoinLongPress={(coin) => {
          setSelectedCoin(coin);
          setShowAddHolding(true);
        }}
      />

      <AddHoldingSheet
        visible={showAddHolding}
        coin={selectedCoin}
        onClose={() => {
          setShowAddHolding(false);
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
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
