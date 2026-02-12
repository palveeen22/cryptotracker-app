import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { formatPrice } from '@/src/shared/lib/formatters';
import type { CoinMarket } from '@/src/entities/coin';
import { useAddHolding } from './useAddHolding';

interface AddHoldingSheetProps {
  visible: boolean;
  coin: CoinMarket | null;
  onClose: () => void;
}

export function AddHoldingSheet({ visible, coin, onClose }: AddHoldingSheetProps) {
  const { amount, setAmount, buyPrice, setBuyPrice, handleAdd, reset } = useAddHolding();
  const [error, setError] = useState('');

  if (!coin) return null;

  const handleSubmit = () => {
    setError('');
    const success = handleAdd(coin);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
      reset();
    } else {
      setError('Please enter a valid amount');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleCancel = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Add Holding</Text>
          <Pressable onPress={handleSubmit}>
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.coinInfo}>
          <Image source={{ uri: coin.image }} style={styles.coinIcon} />
          <Text style={styles.coinName}>{coin.name}</Text>
          <Text style={styles.coinPrice}>
            Current: {formatPrice(coin.current_price)}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount ({coin.symbol.toUpperCase()})</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#636366"
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Buy Price (USD)</Text>
            <TextInput
              style={styles.input}
              value={buyPrice}
              onChangeText={setBuyPrice}
              placeholder={formatPrice(coin.current_price)}
              placeholderTextColor="#636366"
              keyboardType="decimal-pad"
            />
            <Text style={styles.hint}>
              Leave empty to use current price
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {amount && parseFloat(amount) > 0 && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Total Value</Text>
              <Text style={styles.previewValue}>
                {formatPrice(
                  parseFloat(amount) *
                    (parseFloat(buyPrice) || coin.current_price)
                )}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  coinInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  coinIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
  },
  coinName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coinPrice: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 12,
    color: '#636366',
  },
  error: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
  },
  preview: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
});
