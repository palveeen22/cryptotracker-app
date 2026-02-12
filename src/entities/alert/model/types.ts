import type { PriceAlertCondition } from '@/src/shared/types';

export interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  targetPrice: number;
  condition: PriceAlertCondition;
  isActive: boolean;
  isTriggered: boolean;
  createdAt: number;
  triggeredAt?: number;
}
