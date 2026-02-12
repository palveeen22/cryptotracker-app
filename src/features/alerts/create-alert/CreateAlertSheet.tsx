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
import { useAlertStore } from '@/src/entities/alert';
import { formatPrice } from '@/src/shared/lib/formatters';
import type { CoinMarket } from '@/src/entities/coin';
import type { PriceAlertCondition } from '@/src/shared/types';

interface CreateAlertSheetProps {
  visible: boolean;
  coin: CoinMarket | null;
  onClose: () => void;
}

export function CreateAlertSheet({ visible, coin, onClose }: CreateAlertSheetProps) {
  const addAlert = useAlertStore((s) => s.addAlert);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<PriceAlertCondition>('above');
  const [error, setError] = useState('');

  if (!coin) return null;

  const handleSubmit = () => {
    setError('');
    const price = parseFloat(targetPrice);

    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const success = addAlert({
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      targetPrice: price,
      condition,
      isActive: true,
    });

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTargetPrice('');
      onClose();
    } else {
      setError('Maximum alerts reached');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Price Alert</Text>
          <Pressable onPress={handleSubmit}>
            <Text style={styles.addText}>Create</Text>
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
          <View style={styles.conditionToggle}>
            <Pressable
              style={[
                styles.conditionButton,
                condition === 'above' && styles.conditionActive,
              ]}
              onPress={() => setCondition('above')}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === 'above' && styles.conditionTextActive,
                ]}
              >
                Price Above
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.conditionButton,
                condition === 'below' && styles.conditionActiveBelow,
              ]}
              onPress={() => setCondition('below')}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === 'below' && styles.conditionTextActive,
                ]}
              >
                Price Below
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Price (USD)</Text>
            <TextInput
              style={styles.input}
              value={targetPrice}
              onChangeText={setTargetPrice}
              placeholder="0.00"
              placeholderTextColor="#636366"
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
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
  conditionToggle: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 4,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  conditionActive: {
    backgroundColor: '#1B3A2D',
  },
  conditionActiveBelow: {
    backgroundColor: '#3A1B1B',
  },
  conditionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  conditionTextActive: {
    color: '#FFFFFF',
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
  error: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
