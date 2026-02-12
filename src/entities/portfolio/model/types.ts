export interface Holding {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  buyPrice: number;
  addedAt: number;
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
}

export interface HoldingWithValue extends Holding {
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
}
