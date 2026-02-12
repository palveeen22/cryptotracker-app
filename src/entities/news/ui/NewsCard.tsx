import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatTimeAgo } from '@/src/shared/lib/formatters';
import type { NewsArticle } from '@/src/entities/news/model/types';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = React.memo(function NewsCard({ article }: NewsCardProps) {
  const handlePress = () => {
    Linking.openURL(article.url);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {article.thumb_2x ? (
        <Image source={{ uri: article.thumb_2x }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderThumb]}>
          <Text style={styles.placeholderText}>News</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {article.description}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.source}>{article.news_site}</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.time}>{formatTimeAgo(article.created_at)}</Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderThumb: {
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  source: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '500',
  },
  dot: {
    color: '#8E8E93',
    fontSize: 12,
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
