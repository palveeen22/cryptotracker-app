import { WebSocketManager } from '@/src/shared/api/websocket-manager';
import { API_CONFIG } from '@/src/shared/config/constants';
import type { BinanceTickerData, RealtimePrice } from '@/src/entities/coin/model/types';

const COINGECKO_TO_BINANCE: Record<string, string> = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  binancecoin: 'BNBUSDT',
  ripple: 'XRPUSDT',
  cardano: 'ADAUSDT',
  solana: 'SOLUSDT',
  dogecoin: 'DOGEUSDT',
  polkadot: 'DOTUSDT',
  'shiba-inu': 'SHIBUSDT',
  litecoin: 'LTCUSDT',
  avalanche: 'AVAXUSDT',
  chainlink: 'LINKUSDT',
  uniswap: 'UNIUSDT',
  polygon: 'MATICUSDT',
  stellar: 'XLMUSDT',
  'near-protocol': 'NEARUSDT',
  aptos: 'APTUSDT',
  sui: 'SUIUSDT',
  'internet-computer': 'ICPUSDT',
  tron: 'TRXUSDT',
};

type PriceUpdateHandler = (prices: Map<string, RealtimePrice>) => void;

let wsManager: WebSocketManager | null = null;
let priceHandler: PriceUpdateHandler | null = null;

const BINANCE_TO_COINGECKO = new Map(
  Object.entries(COINGECKO_TO_BINANCE).map(([cg, bn]) => [bn.toLowerCase(), cg])
);

export function connectBinanceWS(onPriceUpdate: PriceUpdateHandler): void {
  if (wsManager) {
    wsManager.disconnect();
  }

  priceHandler = onPriceUpdate;

  wsManager = new WebSocketManager({
    url: `${API_CONFIG.BINANCE_WS_URL}/!miniTicker@arr`,
    onMessage: (data) => {
      if (!Array.isArray(data)) return;

      const prices = new Map<string, RealtimePrice>();

      for (const ticker of data as BinanceTickerData[]) {
        const coinId = BINANCE_TO_COINGECKO.get(ticker.s.toLowerCase());
        if (coinId) {
          prices.set(coinId, {
            price: parseFloat(ticker.c),
            changePercent: parseFloat(ticker.P),
            volume: parseFloat(ticker.q),
          });
        }
      }

      if (prices.size > 0) {
        priceHandler?.(prices);
      }
    },
    onStatusChange: (status) => {
      console.log(`[Binance WS] Status: ${status}`);
    },
  });

  wsManager.connect();
}

export function disconnectBinanceWS(): void {
  wsManager?.disconnect();
  wsManager = null;
  priceHandler = null;
}

export function getBinanceSymbol(coingeckoId: string): string | undefined {
  return COINGECKO_TO_BINANCE[coingeckoId];
}
