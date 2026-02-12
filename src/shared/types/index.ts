export type Currency = 'usd' | 'eur' | 'gbp' | 'jpy' | 'idr';

export type ChartInterval = 1 | 7 | 30 | 90 | 365;

export type PriceAlertCondition = 'above' | 'below';

export type SortBy = 'market_cap' | 'volume' | 'price_change';

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
