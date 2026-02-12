import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/src/features/search/ui/SearchBar';
import { useSearch } from '@/src/features/search/model/useSearch';
import { LoadingSpinner } from '@/src/shared/ui/LoadingSpinner';

export default function SearchScreen() {
  const router = useRouter();
  const { query, setQuery, results, trending, isLoading, showTrending } = useSearch();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar value={query} onChangeText={setQuery} autoFocus />
          </View>
          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {isLoading && <LoadingSpinner />}

        {showTrending && !isLoading && (
          <View>
            <Text style={styles.sectionTitle}>Trending</Text>
            {trending.map((item) => (
              <Pressable
                key={item.item.id}
                style={styles.resultRow}
                onPress={() => router.replace(`/coin/${item.item.id}`)}
              >
                <Image source={{ uri: item.item.thumb }} style={styles.thumb} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.item.name}</Text>
                  <Text style={styles.resultSymbol}>
                    {item.item.symbol.toUpperCase()}
                  </Text>
                </View>
                {item.item.market_cap_rank && (
                  <Text style={styles.rank}>#{item.item.market_cap_rank}</Text>
                )}
              </Pressable>
            ))}
          </View>
        )}

        {!showTrending && !isLoading && (
          <View>
            <Text style={styles.sectionTitle}>
              {results.length > 0 ? 'Results' : query.length >= 2 ? 'No results' : ''}
            </Text>
            {results.slice(0, 30).map((coin) => (
              <Pressable
                key={coin.id}
                style={styles.resultRow}
                onPress={() => router.replace(`/coin/${coin.id}`)}
              >
                <Image source={{ uri: coin.thumb }} style={styles.thumb} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{coin.name}</Text>
                  <Text style={styles.resultSymbol}>
                    {coin.symbol.toUpperCase()}
                  </Text>
                </View>
                {coin.market_cap_rank && (
                  <Text style={styles.rank}>#{coin.market_cap_rank}</Text>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    paddingRight: 16,
    paddingLeft: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#6C63FF',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  thumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultSymbol: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  rank: {
    fontSize: 13,
    color: '#636366',
  },
});
