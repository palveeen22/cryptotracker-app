import { AppProviders } from '@/src/shared/providers/AppProviders';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

const CryptoDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#6C63FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#2C2C2E',
    notification: '#FF3B30',
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <ThemeProvider value={CryptoDarkTheme}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#000000' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '600' },
              contentStyle: { backgroundColor: '#000000' },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="coin/[id]"
              options={{
                headerShown: true,
                headerBackTitle: 'Back',
                title: '',
              }}
            />
            <Stack.Screen
              name="search"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings',
                headerShown: true,
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </AppProviders>
    </GestureHandlerRootView>
  );
}
