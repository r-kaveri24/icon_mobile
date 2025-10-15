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
import AddMobileScreen from '../screens/AddMobileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import AgentHubScreen from '../screens/AgentHubScreen';
import AgentStatusScreen from '../screens/AgentStatusScreen';
import AgentRequestScreen from '../screens/AgentRequestScreen';
import AgentHistoryScreen from '../screens/AgentHistoryScreen';
import ServicesScreen from '../screens/ServicesScreen';

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
          name="AddMobile" 
          component={AddMobileScreen} 
          options={{ title: 'Add Mobile' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ title: 'Edit Profile' }}
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen} 
          options={{ title: 'Change Password' }}
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
        <Stack.Screen 
          name="AgentRequest" 
          component={AgentRequestScreen} 
          options={{ title: 'Book Agent' }}
        />
        <Stack.Screen 
          name="AgentHistory" 
          component={AgentHistoryScreen} 
          options={{ title: 'History' }}
        />
        <Stack.Screen 
          name="Services" 
          component={ServicesScreen} 
          options={{ title: 'Services' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};