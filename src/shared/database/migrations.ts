import type { SQLiteDatabase } from 'expo-sqlite';

export async function cacheCoinData(
  db: SQLiteDatabase,
  coinId: string,
  data: string
): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO cached_coins (id, data, updated_at) VALUES (?, ?, ?)',
    [coinId, data, Date.now()]
  );
}

export async function getCachedCoinData(
  db: SQLiteDatabase,
  coinId: string
): Promise<string | null> {
  const result = await db.getFirstAsync<{ data: string }>(
    'SELECT data FROM cached_coins WHERE id = ?',
    [coinId]
  );
  return result?.data ?? null;
}

export async function getCachedMarketData(
  db: SQLiteDatabase
): Promise<string | null> {
  const result = await db.getFirstAsync<{ data: string }>(
    'SELECT data FROM cached_coins WHERE id = ? ORDER BY updated_at DESC LIMIT 1',
    ['market_data']
  );
  return result?.data ?? null;
}

export async function cacheMarketData(
  db: SQLiteDatabase,
  data: string
): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO cached_coins (id, data, updated_at) VALUES (?, ?, ?)',
    ['market_data', data, Date.now()]
  );
}

export async function cacheNewsData(
  db: SQLiteDatabase,
  newsId: string,
  data: string
): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO cached_news (id, data, cached_at) VALUES (?, ?, ?)',
    [newsId, data, Date.now()]
  );
}

export async function getCachedNews(
  db: SQLiteDatabase
): Promise<string | null> {
  const result = await db.getFirstAsync<{ data: string }>(
    'SELECT data FROM cached_news WHERE id = ? ORDER BY cached_at DESC LIMIT 1',
    ['latest_news']
  );
  return result?.data ?? null;
}

export async function clearOldCache(
  db: SQLiteDatabase,
  maxAgeMs: number = 24 * 60 * 60 * 1000
): Promise<void> {
  const cutoff = Date.now() - maxAgeMs;
  await db.runAsync('DELETE FROM cached_coins WHERE updated_at < ?', [cutoff]);
  await db.runAsync('DELETE FROM cached_news WHERE cached_at < ?', [cutoff]);
}
