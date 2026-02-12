import { useSettingsStore } from '@/src/features/settings/model/store';

const initialState = useSettingsStore.getState();

beforeEach(() => {
  useSettingsStore.setState(initialState, true);
});

describe('useSettingsStore', () => {
  describe('default values', () => {
    it('should have usd as default currency', () => {
      expect(useSettingsStore.getState().currency).toBe('usd');
    });

    it('should have dark as default theme', () => {
      expect(useSettingsStore.getState().theme).toBe('dark');
    });

    it('should have notifications enabled by default', () => {
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
    });

    it('should have haptic enabled by default', () => {
      expect(useSettingsStore.getState().hapticEnabled).toBe(true);
    });
  });

  describe('setCurrency', () => {
    it('should update currency', () => {
      useSettingsStore.getState().setCurrency('eur');
      expect(useSettingsStore.getState().currency).toBe('eur');
    });

    it('should support all currency options', () => {
      const currencies = ['usd', 'eur', 'gbp', 'jpy', 'idr'] as const;

      for (const currency of currencies) {
        useSettingsStore.getState().setCurrency(currency);
        expect(useSettingsStore.getState().currency).toBe(currency);
      }
    });
  });

  describe('setTheme', () => {
    it('should update theme', () => {
      useSettingsStore.getState().setTheme('light');
      expect(useSettingsStore.getState().theme).toBe('light');
    });

    it('should support system theme', () => {
      useSettingsStore.getState().setTheme('system');
      expect(useSettingsStore.getState().theme).toBe('system');
    });
  });

  describe('setNotificationsEnabled', () => {
    it('should disable notifications', () => {
      useSettingsStore.getState().setNotificationsEnabled(false);
      expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
    });

    it('should re-enable notifications', () => {
      useSettingsStore.getState().setNotificationsEnabled(false);
      useSettingsStore.getState().setNotificationsEnabled(true);
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
    });
  });

  describe('setHapticEnabled', () => {
    it('should disable haptic', () => {
      useSettingsStore.getState().setHapticEnabled(false);
      expect(useSettingsStore.getState().hapticEnabled).toBe(false);
    });

    it('should re-enable haptic', () => {
      useSettingsStore.getState().setHapticEnabled(false);
      useSettingsStore.getState().setHapticEnabled(true);
      expect(useSettingsStore.getState().hapticEnabled).toBe(true);
    });
  });

  describe('independence', () => {
    it('should not affect other settings when one is changed', () => {
      useSettingsStore.getState().setCurrency('jpy');

      expect(useSettingsStore.getState().theme).toBe('dark');
      expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
      expect(useSettingsStore.getState().hapticEnabled).toBe(true);
    });
  });
});
