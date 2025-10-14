import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';
import { Screen, Text } from '@icon/ui';

type RegisterSuccessNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterSuccess'>;

interface Props {
  navigation: RegisterSuccessNavigationProp;
}

const NUM_PARTICLES = 24;
const { width, height } = Dimensions.get('window');

const RegisterSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-50 - Math.random() * 100),
      size: 6 + Math.random() * 10,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      duration: 1200 + Math.random() * 1000,
    }))
  ).current;

  useEffect(() => {
    particles.forEach(p => {
      Animated.timing(p.y, {
        toValue: height + 50,
        duration: p.duration,
        useNativeDriver: true,
      }).start();
    });

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation, particles]);

  return (
    <Screen style={styles.container}>
      <View style={styles.center}> 
        <Text variant="h2" style={styles.title}>Registered Successfully!</Text>
        <Text variant="body" style={styles.subtitle}>Redirecting to login…</Text>
      </View>

      {particles.map((p, idx) => (
        <Animated.View
          key={idx}
          style={{
            position: 'absolute',
            transform: [{ translateX: p.x }, { translateY: p.y }],
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: p.color,
            opacity: 0.9,
          }}
        />
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
});

export default RegisterSuccessScreen;