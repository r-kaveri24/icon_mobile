import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CMSResponse } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { cmsService } from '@icon/api';
import { useApp } from '../providers/AppProvider';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { config, isLoading, setLoading } = useApp();
  const [cmsData, setCmsData] = useState<CMSResponse | null>(null);

  useEffect(() => {
    loadCMSData();
  }, []);

  const loadCMSData = async () => {
    try {
      setLoading(true);
      const response = await cmsService.getHomeContent();
      setCmsData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load content');
      console.error('CMS Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopPress = () => {
    navigation.navigate('ShopList');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Welcome to Icon Computer
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Your trusted computer shop network
        </Text>
      </View>

      {cmsData && (
        <View style={styles.cmsContent}>
          <Text variant="h3">{cmsData.title}</Text>
          <Text variant="body" style={styles.description}>
            {cmsData.content}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Browse Shops"
          onPress={handleShopPress}
          variant="primary"
          size="large"
          style={styles.button}
        />
        
        <Button
          title="Login"
          onPress={handleLoginPress}
          variant="outline"
          size="medium"
          style={styles.button}
        />
        
        <Button
          title="Register"
          onPress={handleRegisterPress}
          variant="secondary"
          size="medium"
          style={styles.button}
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  cmsContent: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  description: {
    marginTop: 10,
    lineHeight: 20,
  },
  actions: {
    flex: 1,
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    marginVertical: 5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default HomeScreen;