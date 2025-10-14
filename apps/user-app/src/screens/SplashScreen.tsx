import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';
import { Screen, Text } from '@icon/ui';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Go directly to Login (not Home)
      navigation.replace('Login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen style={styles.container}>
      <View style={styles.center}>
        <Image source={require('../../assets/splash-icon.png')} style={styles.logo} />
        <Text variant="h2" style={styles.title}>Icon Computer</Text>
        <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        <Text variant="caption" color="#666">Loading...</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 128,
    height: 128,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    marginBottom: 12,
  },
  spinner: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default SplashScreen;