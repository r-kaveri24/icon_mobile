import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useApp } from '../providers/AppProvider';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, setUser, config } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            setUser(null);
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleViewOrders = () => {
    Alert.alert('Order History', 'Order history feature coming soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  if (!user) {
    return (
      <Screen style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Text variant="h2" style={styles.title}>
            Not Logged In
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Please login to view your profile
          </Text>
          <Button
            title="Go to Login"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            size="large"
            style={styles.loginButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text variant="h1" style={styles.avatarText}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text variant="h2" style={styles.userName}>
          {user.name || 'User'}
        </Text>
        <Text variant="body" style={styles.userEmail}>
          {user.email}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text variant="body" style={styles.infoLabel}>
            Member Since
          </Text>
          <Text variant="body" style={styles.infoValue}>
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text variant="body" style={styles.infoLabel}>
            Account Status
          </Text>
          <Text variant="body" style={[
            styles.infoValue,
            { color: user.isActive ? '#4CAF50' : '#F44336' }
          ] as any}>
            {user.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          variant="outline"
          size="large"
          style={styles.actionButton}
        />
        
        <Button
          title="Order History"
          onPress={handleViewOrders}
          variant="outline"
          size="large"
          style={styles.actionButton}
        />
        
        <Button
          title="Settings"
          onPress={handleSettings}
          variant="outline"
          size="large"
          style={styles.actionButton}
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          size="large"
          style={styles.logoutButton}
        />
      </View>

      <View style={styles.footer}>
        <Text variant="caption" color="#666">
          {config.mockMode ? 'Running in Mock Mode' : 'Connected to Live API'}
        </Text>
        <Text variant="caption" color="#666">
          Environment: {config.environment}
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  loginButton: {
    width: '100%',
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    textAlign: 'center',
    marginBottom: 5,
  },
  userEmail: {
    textAlign: 'center',
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontWeight: '600',
  },
  infoValue: {
    color: '#666',
  },
  actionsSection: {
    margin: 15,
    gap: 10,
  },
  actionButton: {
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 'auto',
  },
});

export default ProfileScreen;