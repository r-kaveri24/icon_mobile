import React from 'react';
import { AppProvider } from './src/providers/AppProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const tokenCache = {
  async getToken(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
};

export default function App() {
  const pk =
    (process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string) ||
    (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string) ||
    ((Constants?.expoConfig?.extra as any)?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string) ||
    '';
  return (
    <ClerkProvider publishableKey={pk} tokenCache={tokenCache} telemetry={{ disabled: true }}>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </ClerkProvider>
  );
}
