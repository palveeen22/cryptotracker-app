import type { CoinMarket } from '@/src/entities/coin';
import { useCoinDetail, useMarketData } from '@/src/entities/coin';
import { CreateAlertSheet } from '@/src/features/alerts/create-alert/CreateAlertSheet';
import { AddHoldingSheet } from '@/src/features/portfolio/add-holding/AddHoldingSheet';
import { ErrorView } from '@/src/shared/ui/ErrorView';
import { LoadingSpinner } from '@/src/shared/ui/LoadingSpinner';
import { CoinDetailHeader } from '@/src/widgets/coin-detail-header/CoinDetailHeader';
import { PriceChart } from '@/src/widgets/price-chart/PriceChart';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CoinDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data: coin, isLoading, error, refetch } = useCoinDetail(id);
  const { data: marketData } = useMarketData();

  const [showAddHolding, setShowAddHolding] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);

  // Find matching CoinMarket for sheets
  const coinMarket: CoinMarket | null = marketData?.find((c) => c.id === id) ?? null;

  useEffect(() => {
    if (coin?.name) {
      navigation.setOptions({ title: coin.name });
    }
  }, [coin?.name, navigation]);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !coin) return <ErrorView message="Failed to load coin data" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CoinDetailHeader coin={coin} />

        <PriceChart coinId={id} />

        {/* Description */}
        {coin.description?.en && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {coin.name}</Text>
            <Text style={styles.description} numberOfLines={6}>
              {coin.description.en.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        )}

        {/* Links */}
        {coin.links?.homepage?.[0] && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            <Text style={styles.link}>{coin.links.homepage[0]}</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionBar}>
        <Pressable
          style={[styles.actionButton, styles.portfolioButton]}
          onPress={() => setShowAddHolding(true)}
        >
          <Ionicons name="wallet" size={18} color="#FFFFFF" />
          <Text style={styles.actionText}>Add to Portfolio</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.alertButton]}
          onPress={() => setShowCreateAlert(true)}
        >
          <Ionicons name="notifications" size={18} color="#FFFFFF" />
          <Text style={styles.actionText}>Set Alert</Text>
        </Pressable>
      </View>

      <AddHoldingSheet
        visible={showAddHolding}
        coin={coinMarket}
        onClose={() => setShowAddHolding(false)}
      />
      <CreateAlertSheet
        visible={showCreateAlert}
        coin={coinMarket}
        onClose={() => setShowCreateAlert(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  section: { padding: 16, backgroundColor: '#1C1C1E', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 10 },
  description: { fontSize: 14, color: '#8E8E93', lineHeight: 20 },
  link: { fontSize: 14, color: '#6C63FF' },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#000000',
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  portfolioButton: { backgroundColor: '#6C63FF' },
  alertButton: { backgroundColor: '#2C2C2E' },
  actionText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});
