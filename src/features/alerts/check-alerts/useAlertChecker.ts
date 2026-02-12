import type { PriceAlert } from '@/src/entities/alert';
import { useAlertStore } from '@/src/entities/alert';
import { useCoinStore } from '@/src/entities/coin';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useCallback } from 'react';

async function sendAlertNotification(alert: PriceAlert, currentPrice: number) {
  try {
    const direction = alert.condition === 'above' ? 'above' : 'below';
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${alert.coinName} Price Alert`,
        body: `${alert.coinName} is now ${direction} $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
        data: { coinId: alert.coinId },
      },
      trigger: null,
    });
  } catch {
    // Notification permissions may not be granted
  }
}

export function useAlertChecker() {
  const checkedRef = useRef(new Set<string>());

  const checkAlerts = useCallback(() => {
    const { alerts } = useAlertStore.getState();
    const { realtimePrices } = useCoinStore.getState();
    const triggerAlert = useAlertStore.getState().triggerAlert;

    const activeAlerts = alerts.filter((a) => a.isActive && !a.isTriggered);

    for (const alert of activeAlerts) {
      if (checkedRef.current.has(alert.id)) continue;

      const price = realtimePrices[alert.coinId]?.price;
      if (!price) continue;

      const shouldTrigger =
        (alert.condition === 'above' && price >= alert.targetPrice) ||
        (alert.condition === 'below' && price <= alert.targetPrice);

      if (shouldTrigger) {
        checkedRef.current.add(alert.id);
        triggerAlert(alert.id);
        sendAlertNotification(alert, price);
      }
    }
  }, []);

  // Subscribe to any store change and check alerts
  useEffect(() => {
    const unsubscribe = useCoinStore.subscribe(() => checkAlerts());
    return unsubscribe;
  }, [checkAlerts]);
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}
