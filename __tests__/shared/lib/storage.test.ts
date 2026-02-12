import AsyncStorage from '@react-native-async-storage/async-storage';
import { zustandStorage } from '@/src/shared/lib/storage';

beforeEach(() => {
  (AsyncStorage.getItem as jest.Mock).mockClear();
  (AsyncStorage.setItem as jest.Mock).mockClear();
  (AsyncStorage.removeItem as jest.Mock).mockClear();
});

describe('zustandStorage', () => {
  describe('getItem', () => {
    it('should call AsyncStorage.getItem with the key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"foo":"bar"}');

      const result = await zustandStorage.getItem('test-key');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('{"foo":"bar"}');
    });

    it('should return null when key does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await zustandStorage.getItem('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await zustandStorage.getItem('test-key');

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should call AsyncStorage.setItem with key and value', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await zustandStorage.setItem('test-key', '{"foo":"bar"}');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', '{"foo":"bar"}');
    });

    it('should not throw on error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(zustandStorage.setItem('test-key', 'value')).resolves.toBeUndefined();
    });
  });

  describe('removeItem', () => {
    it('should call AsyncStorage.removeItem with the key', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await zustandStorage.removeItem('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should not throw on error', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(zustandStorage.removeItem('test-key')).resolves.toBeUndefined();
    });
  });
});
