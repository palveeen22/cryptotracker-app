import axios from 'axios';
import { API_CONFIG } from '@/src/shared/config/constants';

export const coingeckoClient = axios.create({
  baseURL: API_CONFIG.COINGECKO_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

coingeckoClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('[CoinGecko] Rate limit hit, backing off...');
    }
    return Promise.reject({
      message: error.response?.data?.error || error.message || 'Network error',
      status: error.response?.status,
    });
  }
);
