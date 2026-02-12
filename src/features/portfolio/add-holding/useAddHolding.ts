import { useState } from 'react';
import { usePortfolioStore } from '@/src/entities/portfolio';
import type { CoinMarket } from '@/src/entities/coin';

export function useAddHolding() {
  const addHolding = usePortfolioStore((s) => s.addHolding);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const handleAdd = (coin: CoinMarket) => {
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(buyPrice) || coin.current_price;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return false;
    }

    addHolding({
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      amount: parsedAmount,
      buyPrice: parsedPrice,
    });

    setAmount('');
    setBuyPrice('');
    return true;
  };

  const reset = () => {
    setAmount('');
    setBuyPrice('');
  };

  return {
    amount,
    setAmount,
    buyPrice,
    setBuyPrice,
    handleAdd,
    reset,
  };
}
