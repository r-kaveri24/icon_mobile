import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AgentProvider } from './src/providers/AgentProvider';
import { AgentNavigator } from './src/navigation/AgentNavigator';

export default function App() {
  return (
    <AgentProvider>
      <NavigationContainer>
        <AgentNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AgentProvider>
  );
}
