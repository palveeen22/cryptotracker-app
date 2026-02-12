import {
  useAlertStore,
  selectActiveAlerts,
  selectTriggeredAlerts,
  selectAlertsByCoin,
} from '@/src/entities/alert/model/store';
import { APP_CONFIG } from '@/src/shared/config/constants';

const initialState = useAlertStore.getState();
let dateNowCounter = 2000000;

beforeEach(() => {
  useAlertStore.setState(initialState, true);
  jest.spyOn(Date, 'now').mockImplementation(() => ++dateNowCounter);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const mockAlert = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'btc',
  coinImage: 'https://example.com/btc.png',
  targetPrice: 60000,
  condition: 'above' as const,
  isActive: true,
};

describe('useAlertStore', () => {
  describe('addAlert', () => {
    it('should add an alert with generated id and isTriggered=false', () => {
      const result = useAlertStore.getState().addAlert(mockAlert);

      expect(result).toBe(true);

      const alerts = useAlertStore.getState().alerts;
      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toMatchObject({
        coinId: 'bitcoin',
        targetPrice: 60000,
        condition: 'above',
        isActive: true,
        isTriggered: false,
      });
      expect(alerts[0].id).toContain('alert-');
      expect(alerts[0].createdAt).toBeGreaterThan(0);
    });

    it('should return false when at MAX_ALERTS limit', () => {
      for (let i = 0; i < APP_CONFIG.MAX_ALERTS; i++) {
        useAlertStore.getState().addAlert({ ...mockAlert, targetPrice: 50000 + i });
      }

      expect(useAlertStore.getState().alerts).toHaveLength(APP_CONFIG.MAX_ALERTS);

      const result = useAlertStore.getState().addAlert(mockAlert);
      expect(result).toBe(false);
      expect(useAlertStore.getState().alerts).toHaveLength(APP_CONFIG.MAX_ALERTS);
    });
  });

  describe('removeAlert', () => {
    it('should remove an alert by id', () => {
      useAlertStore.getState().addAlert(mockAlert);
      const id = useAlertStore.getState().alerts[0].id;

      useAlertStore.getState().removeAlert(id);

      expect(useAlertStore.getState().alerts).toHaveLength(0);
    });

    it('should not affect other alerts', () => {
      useAlertStore.getState().addAlert(mockAlert);
      useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum', condition: 'below' });

      const id = useAlertStore.getState().alerts[0].id;
      useAlertStore.getState().removeAlert(id);

      expect(useAlertStore.getState().alerts).toHaveLength(1);
      expect(useAlertStore.getState().alerts[0].coinId).toBe('ethereum');
    });
  });

  describe('toggleAlert', () => {
    it('should toggle isActive from true to false', () => {
      useAlertStore.getState().addAlert(mockAlert);
      const id = useAlertStore.getState().alerts[0].id;

      useAlertStore.getState().toggleAlert(id);

      expect(useAlertStore.getState().alerts[0].isActive).toBe(false);
    });

    it('should toggle isActive from false to true', () => {
      useAlertStore.getState().addAlert(mockAlert);
      const id = useAlertStore.getState().alerts[0].id;

      useAlertStore.getState().toggleAlert(id);
      useAlertStore.getState().toggleAlert(id);

      expect(useAlertStore.getState().alerts[0].isActive).toBe(true);
    });
  });

  describe('triggerAlert', () => {
    it('should set isTriggered=true, isActive=false, and triggeredAt', () => {
      useAlertStore.getState().addAlert(mockAlert);
      const id = useAlertStore.getState().alerts[0].id;

      useAlertStore.getState().triggerAlert(id);

      const alert = useAlertStore.getState().alerts[0];
      expect(alert.isTriggered).toBe(true);
      expect(alert.isActive).toBe(false);
      expect(alert.triggeredAt).toBeGreaterThan(0);
    });

    it('should not affect other alerts', () => {
      useAlertStore.getState().addAlert(mockAlert);
      useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum' });

      const id = useAlertStore.getState().alerts[0].id;
      useAlertStore.getState().triggerAlert(id);

      expect(useAlertStore.getState().alerts[1].isTriggered).toBe(false);
      expect(useAlertStore.getState().alerts[1].isActive).toBe(true);
    });
  });

  describe('clearTriggered', () => {
    it('should remove only triggered alerts', () => {
      useAlertStore.getState().addAlert(mockAlert);
      useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum' });

      const id = useAlertStore.getState().alerts[0].id;
      useAlertStore.getState().triggerAlert(id);

      useAlertStore.getState().clearTriggered();

      const alerts = useAlertStore.getState().alerts;
      expect(alerts).toHaveLength(1);
      expect(alerts[0].coinId).toBe('ethereum');
    });

    it('should do nothing if no alerts are triggered', () => {
      useAlertStore.getState().addAlert(mockAlert);

      useAlertStore.getState().clearTriggered();

      expect(useAlertStore.getState().alerts).toHaveLength(1);
    });
  });

  describe('selectors', () => {
    it('selectActiveAlerts should return only active non-triggered alerts', () => {
      useAlertStore.getState().addAlert(mockAlert);
      useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum' });

      const id = useAlertStore.getState().alerts[0].id;
      useAlertStore.getState().triggerAlert(id);

      const active = selectActiveAlerts(useAlertStore.getState());
      expect(active).toHaveLength(1);
      expect(active[0].coinId).toBe('ethereum');
    });

    it('selectTriggeredAlerts should return only triggered alerts', () => {
      useAlertStore.getState().addAlert(mockAlert);
      useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum' });

      const id = useAlertStore.getState().alerts[0].id;
      useAlertStore.getState().triggerAlert(id);

      const triggered = selectTriggeredAlerts(useAlertStore.getState());
      expect(triggered).toHaveLength(1);
      expect(triggered[0].coinId).toBe('bitcoin');
    });

    it('selectAlertsByCoin should filter by coinId', () => {
      useAlertStore.getState().addAlert(mockAlert);
      useAlertStore.getState().addAlert({ ...mockAlert, coinId: 'ethereum' });
      useAlertStore.getState().addAlert({ ...mockAlert, targetPrice: 70000 });

      const btcAlerts = selectAlertsByCoin('bitcoin')(useAlertStore.getState());
      expect(btcAlerts).toHaveLength(2);
    });

    it('selectAlertsByCoin should return empty for unknown coin', () => {
      const alerts = selectAlertsByCoin('unknown')(useAlertStore.getState());
      expect(alerts).toHaveLength(0);
    });
  });
});
