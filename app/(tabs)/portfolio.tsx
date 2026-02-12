import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PortfolioSummary } from '@/src/widgets/portfolio-summary/PortfolioSummary';
import { AddHoldingSheet } from '@/src/features/portfolio/add-holding/AddHoldingSheet';
import { usePortfolioStore } from '@/src/entities/portfolio';
import { useMarketData } from '@/src/entities/coin';
import type { CoinMarket } from '@/src/entities/coin';

export default function PortfolioScreen() {
  const [showCoinPicker, setShowCoinPicker] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const holdings = usePortfolioStore((s) => s.holdings);
  const { data: marketData } = useMarketData();

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
        <Text style={styles.title}>Portfolio</Text>
        <Pressable style={styles.addButton} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <PortfolioSummary />

      {/* Coin picker modal */}
      {showCoinPicker && marketData && (
        <CoinPickerModal
          coins={marketData}
          onSelect={(coin) => {
            setSelectedCoin(coin);
            setShowCoinPicker(false);
            setShowAddSheet(true);
          }}
          onClose={() => setShowCoinPicker(false)}
        />
      )}

      <AddHoldingSheet
        visible={showAddSheet}
        coin={selectedCoin}
        onClose={() => {
          setShowAddSheet(false);
          setSelectedCoin(null);
        }}
      />
    </SafeAreaView>
  );
}

function CoinPickerModal({
  coins,
  onSelect,
  onClose,
}: {
  coins: CoinMarket[];
  onSelect: (coin: CoinMarket) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={pickerStyles.overlay}>
      <View style={pickerStyles.container}>
        <View style={pickerStyles.header}>
          <Text style={pickerStyles.title}>Select Coin</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={pickerStyles.searchContainer}>
          <Ionicons name="search" size={16} color="#8E8E93" />
          <Text style={pickerStyles.searchPlaceholder}>
            {search || 'Search...'}
          </Text>
        </View>
        <View style={pickerStyles.list}>
          {filtered.slice(0, 20).map((coin) => (
            <Pressable
              key={coin.id}
              style={pickerStyles.item}
              onPress={() => onSelect(coin)}
            >
              <Text style={pickerStyles.coinName}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </Text>
              <Text style={pickerStyles.rank}>#{coin.market_cap_rank}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const pickerStyles = StyleSheet.create({
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
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  searchPlaceholder: {
    color: '#8E8E93',
    fontSize: 15,
  },
  list: {
    gap: 2,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  coinName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rank: {
    fontSize: 13,
    color: '#8E8E93',
  },
});
