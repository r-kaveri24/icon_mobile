import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AgentStackParamList } from '@icon/config';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import HealthCheckScreen from '../screens/HealthCheckScreen';

import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<AgentStackParamList>();

export const AgentNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Agent Dashboard' }}
      />
      <Stack.Screen 
        name="HealthCheck" 
        component={HealthCheckScreen} 
        options={{ title: 'Health Check' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};