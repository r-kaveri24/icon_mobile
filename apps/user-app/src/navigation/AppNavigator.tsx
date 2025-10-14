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

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
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
                <RNText style={{ color: '#fff', fontWeight: '600' }}>Home</RNText>
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
                <RNText style={{ color: '#fff', fontWeight: '600' }}>Home</RNText>
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
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};