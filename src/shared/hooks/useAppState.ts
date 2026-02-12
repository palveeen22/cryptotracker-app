import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useAppState(
  onChange: (status: AppStateStatus) => void
): void {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      onChangeRef.current(status);
    });
    return () => subscription.remove();
  }, []);
}

export function useOnAppForeground(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        callbackRef.current();
      }
    });
    return () => subscription.remove();
  }, []);
}
