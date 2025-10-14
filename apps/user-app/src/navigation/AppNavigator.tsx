import React from 'react';
import { TouchableOpacity, Text as RNText } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterSuccessScreen from '../screens/RegisterSuccessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AgentHubScreen from '../screens/AgentHubScreen';
import AgentStatusScreen from '../screens/AgentStatusScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FAF8F2',
          },
          headerTintColor: '#2E2E2E',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={({ navigation }) => ({ 
            title: 'Login',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginRight: 12 }}>
                <RNText style={{ color: '#2E2E2E', fontWeight: '600' }}>Home</RNText>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={({ navigation }) => ({ 
            title: 'Register',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginRight: 12 }}>
                <RNText style={{ color: '#2E2E2E', fontWeight: '600' }}>Home</RNText>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="RegisterSuccess" 
          component={RegisterSuccessScreen} 
          options={{ title: 'Success', headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="AgentHub" 
          component={AgentHubScreen} 
          options={{ title: 'Agent Hub' }}
        />
        <Stack.Screen 
          name="AgentStatus" 
          component={AgentStatusScreen} 
          options={{ title: 'Agent Status' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};