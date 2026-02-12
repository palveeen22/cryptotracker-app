import type { NewsArticle } from '@/src/entities/news';
import { NewsCard, useNewsData } from '@/src/entities/news';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { ErrorView } from '@/src/shared/ui/ErrorView';
import { LoadingSpinner } from '@/src/shared/ui/LoadingSpinner';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export function NewsFeed() {
  const { data, isLoading, error, refetch } = useNewsData();

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => <NewsCard article={item} />,
    []
  );

  const keyExtractor = useCallback((item: NewsArticle) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorView message="Failed to load news" onRetry={refetch} />;
  if (!data?.length) {
    return (
      <EmptyState
        icon="📰"
        title="No News Available"
        description="Check back later for the latest crypto news"
      />
    );
  }

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // estimatedItemSize={104}
      ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#2C2C2E',
    marginLeft: 108,
  },
});
