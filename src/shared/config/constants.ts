export const API_CONFIG = {
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  BINANCE_WS_URL: 'wss://stream.binance.com:9443/ws',
  NEWS_BASE_URL: 'https://api.coingecko.com/api/v3',
} as const;

export const QUERY_CONFIG = {
  MARKET_STALE_TIME: 30 * 1000,
  DETAIL_STALE_TIME: 5 * 60 * 1000,
  NEWS_STALE_TIME: 5 * 60 * 1000,
  CHART_STALE_TIME: 60 * 1000,
} as const;

export const WS_CONFIG = {
  RECONNECT_INTERVAL: 3000,
  MAX_RECONNECT_ATTEMPTS: 10,
  PING_INTERVAL: 30000,
} as const;

export const APP_CONFIG = {
  DEFAULT_CURRENCY: 'usd',
  DEFAULT_PER_PAGE: 50,
  CHART_DAYS_OPTIONS: [1, 7, 30, 90, 365] as const,
  MAX_ALERTS: 20,
  BACKGROUND_FETCH_INTERVAL: 15 * 60,
} as const;

export const STORAGE_KEYS = {
  PORTFOLIO: 'portfolio-storage',
  ALERTS: 'alerts-storage',
  SETTINGS: 'settings-storage',
  ONBOARDED: 'onboarded',
} as const;
