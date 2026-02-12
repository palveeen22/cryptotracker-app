import { usePortfolioStore, selectHoldings, selectHoldingByCoin } from '@/src/entities/portfolio/model/store';

const initialState = usePortfolioStore.getState();
let dateNowCounter = 1000000;

beforeEach(() => {
  usePortfolioStore.setState(initialState, true);
  jest.spyOn(Date, 'now').mockImplementation(() => ++dateNowCounter);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const mockHolding = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'btc',
  coinImage: 'https://example.com/btc.png',
  amount: 0.5,
  buyPrice: 45000,
};

describe('usePortfolioStore', () => {
  describe('addHolding', () => {
    it('should add a holding with generated id and addedAt', () => {
      usePortfolioStore.getState().addHolding(mockHolding);

      const holdings = usePortfolioStore.getState().holdings;
      expect(holdings).toHaveLength(1);
      expect(holdings[0]).toMatchObject({
        coinId: 'bitcoin',
        coinName: 'Bitcoin',
        coinSymbol: 'btc',
        amount: 0.5,
        buyPrice: 45000,
      });
      expect(holdings[0].id).toContain('bitcoin-');
      expect(holdings[0].addedAt).toBeGreaterThan(0);
    });

    it('should allow multiple holdings for the same coin', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      usePortfolioStore.getState().addHolding({ ...mockHolding, amount: 1.0, buyPrice: 50000 });

      const holdings = usePortfolioStore.getState().holdings;
      expect(holdings).toHaveLength(2);
      expect(holdings[0].id).not.toBe(holdings[1].id);
    });
  });

  describe('removeHolding', () => {
    it('should remove a holding by id', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      const id = usePortfolioStore.getState().holdings[0].id;

      usePortfolioStore.getState().removeHolding(id);

      expect(usePortfolioStore.getState().holdings).toHaveLength(0);
    });

    it('should not affect other holdings', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      usePortfolioStore.getState().addHolding({ ...mockHolding, coinId: 'ethereum', coinName: 'Ethereum' });

      const holdings = usePortfolioStore.getState().holdings;
      usePortfolioStore.getState().removeHolding(holdings[0].id);

      expect(usePortfolioStore.getState().holdings).toHaveLength(1);
      expect(usePortfolioStore.getState().holdings[0].coinId).toBe('ethereum');
    });
  });

  describe('updateHolding', () => {
    it('should update amount', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      const id = usePortfolioStore.getState().holdings[0].id;

      usePortfolioStore.getState().updateHolding(id, { amount: 2.0 });

      expect(usePortfolioStore.getState().holdings[0].amount).toBe(2.0);
      expect(usePortfolioStore.getState().holdings[0].buyPrice).toBe(45000);
    });

    it('should update buyPrice', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      const id = usePortfolioStore.getState().holdings[0].id;

      usePortfolioStore.getState().updateHolding(id, { buyPrice: 48000 });

      expect(usePortfolioStore.getState().holdings[0].buyPrice).toBe(48000);
      expect(usePortfolioStore.getState().holdings[0].amount).toBe(0.5);
    });

    it('should update both amount and buyPrice', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      const id = usePortfolioStore.getState().holdings[0].id;

      usePortfolioStore.getState().updateHolding(id, { amount: 3.0, buyPrice: 55000 });

      expect(usePortfolioStore.getState().holdings[0].amount).toBe(3.0);
      expect(usePortfolioStore.getState().holdings[0].buyPrice).toBe(55000);
    });

    it('should not affect other holdings', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      usePortfolioStore.getState().addHolding({ ...mockHolding, coinId: 'ethereum', amount: 10 });

      const btcId = usePortfolioStore.getState().holdings[0].id;
      usePortfolioStore.getState().updateHolding(btcId, { amount: 1.0 });

      expect(usePortfolioStore.getState().holdings[1].amount).toBe(10);
    });
  });

  describe('clearPortfolio', () => {
    it('should remove all holdings', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      usePortfolioStore.getState().addHolding({ ...mockHolding, coinId: 'ethereum' });

      usePortfolioStore.getState().clearPortfolio();

      expect(usePortfolioStore.getState().holdings).toHaveLength(0);
    });
  });

  describe('selectors', () => {
    it('selectHoldings should return all holdings', () => {
      usePortfolioStore.getState().addHolding(mockHolding);

      const holdings = selectHoldings(usePortfolioStore.getState());
      expect(holdings).toHaveLength(1);
    });

    it('selectHoldingByCoin should filter by coinId', () => {
      usePortfolioStore.getState().addHolding(mockHolding);
      usePortfolioStore.getState().addHolding({ ...mockHolding, coinId: 'ethereum' });

      const btcHoldings = selectHoldingByCoin('bitcoin')(usePortfolioStore.getState());
      expect(btcHoldings).toHaveLength(1);
      expect(btcHoldings[0].coinId).toBe('bitcoin');
    });

    it('selectHoldingByCoin should return empty array for unknown coin', () => {
      const holdings = selectHoldingByCoin('unknown')(usePortfolioStore.getState());
      expect(holdings).toHaveLength(0);
    });
  });
});
