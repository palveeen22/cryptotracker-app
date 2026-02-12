import { WebSocketManager } from '@/src/shared/api/websocket-manager';
import { API_CONFIG } from '@/src/shared/config/constants';
import type { RealtimePrice } from '@/src/entities/coin/model/types';

const SUPPORTED_ASSETS = [
  'bitcoin',
  'ethereum',
  'binance-coin',
  'ripple',
  'cardano',
  'solana',
  'dogecoin',
  'polkadot',
  'shiba-inu',
  'litecoin',
  'avalanche',
  'chainlink',
  'uniswap',
  'polygon',
  'stellar',
  'near-protocol',
  'aptos',
  'sui',
  'internet-computer',
  'tron',
];

// CoinCap uses slightly different IDs than CoinGecko for some coins
const COINCAP_TO_COINGECKO: Record<string, string> = {
  'binance-coin': 'binancecoin',
  'near-protocol': 'near',
  'avalanche': 'avalanche-2',
  'polygon': 'matic-network',
};

type PriceUpdateHandler = (prices: Map<string, RealtimePrice>) => void;
type StatusUpdateHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

let wsManager: WebSocketManager | null = null;
let priceHandler: PriceUpdateHandler | null = null;
let statusHandler: StatusUpdateHandler | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function toCoinGeckoId(coincapId: string): string {
  return COINCAP_TO_COINGECKO[coincapId] ?? coincapId;
}

function connectCoinCapWS(): void {
  const assetsParam = SUPPORTED_ASSETS.join(',');

  wsManager = new WebSocketManager({
    url: `${API_CONFIG.COINCAP_WS_URL}${assetsParam}`,
    onMessage: (data) => {
      if (!data || typeof data !== 'object') return;

      const prices = new Map<string, RealtimePrice>();
      const entries = Object.entries(data as Record<string, string>);

      for (const [assetId, priceStr] of entries) {
        const coinId = toCoinGeckoId(assetId);
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
          prices.set(coinId, {
            price,
            changePercent: 0,
            volume: 0,
          });
        }
      }

      if (prices.size > 0) {
        priceHandler?.(prices);
      }
    },
    onStatusChange: (status) => {
      console.log(`[CoinCap WS] Status: ${status}`);
      statusHandler?.(status);

      if (status === 'error' || status === 'disconnected') {
        startPollingFallback();
      }
      if (status === 'connected') {
        stopPollingFallback();
      }
    },
  });

  wsManager.connect();
}

async function pollPrices(): Promise<void> {
  try {
    const res = await fetch(
      `${API_CONFIG.COINGECKO_BASE_URL}/simple/price?ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin,polkadot,litecoin,chainlink,uniswap,stellar,tron&vs_currencies=usd&include_24hr_change=true`
    );
    if (!res.ok) return;

    const data = (await res.json()) as Record<string, { usd: number; usd_24h_change?: number }>;
    const prices = new Map<string, RealtimePrice>();

    for (const [coinId, info] of Object.entries(data)) {
      prices.set(coinId, {
        price: info.usd,
        changePercent: info.usd_24h_change ?? 0,
        volume: 0,
      });
    }

    if (prices.size > 0) {
      priceHandler?.(prices);
    }
  } catch {
    // silent fail, will retry next interval
  }
}

function startPollingFallback(): void {
  if (pollTimer) return;
  console.log('[Fallback] Starting price polling (10s interval)');
  statusHandler?.('connecting');
  pollPrices().then(() => statusHandler?.('connected'));
  pollTimer = setInterval(pollPrices, 10_000);
}

function stopPollingFallback(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

export function connectBinanceWS(
  onPriceUpdate: PriceUpdateHandler,
  onStatusChange?: StatusUpdateHandler,
): void {
  if (wsManager) {
    wsManager.disconnect();
  }
  stopPollingFallback();

  priceHandler = onPriceUpdate;
  statusHandler = onStatusChange ?? null;

  connectCoinCapWS();
}

export function disconnectBinanceWS(): void {
  wsManager?.disconnect();
  wsManager = null;
  priceHandler = null;
  statusHandler = null;
  stopPollingFallback();
}

export function getBinanceSymbol(coingeckoId: string): string | undefined {
  return SUPPORTED_ASSETS.find((a) => toCoinGeckoId(a) === coingeckoId);
}
