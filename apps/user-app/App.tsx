import React from 'react';
import { AppProvider } from './src/providers/AppProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
