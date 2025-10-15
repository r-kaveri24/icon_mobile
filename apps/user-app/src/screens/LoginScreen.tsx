import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, LoginForm } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { authService } from '@icon/api';
import { useApp } from '../providers/AppProvider';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { setLoading, setUser, setSessionPassword } = useApp();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(form);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setSessionPassword(form.password);
        const hasMobile = !!(response.data.user as any)?.mobile;
        if (!hasMobile) {
          Alert.alert('Add Mobile Number', 'Please add your mobile number to continue.', [
            { text: 'OK', onPress: () => navigation.navigate('AddMobile') }
          ]);
        } else {
          Alert.alert('Success', 'Login successful!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        }
      } else {
        Alert.alert('Error', response.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Login to Your Account
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Access your Icon Computer account
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text variant="body" style={styles.label}>
            Email
          </Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text variant="body" style={styles.label}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Button
          title="Login"
          onPress={handleLogin}
          variant="primary"
          size="large"
          style={styles.loginButton}
        />

        <View style={styles.registerSection}>
          <Text variant="body" style={styles.registerText}>
            Don't have an account?
          </Text>
          <Button
            title="Register Here"
            onPress={handleRegisterPress}
            variant="ghost"
            size="medium"
          />
        </View>
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
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  registerSection: {
    alignItems: 'center',
  },
  registerText: {
    marginBottom: 10,
    color: '#666',
  },
});

export default LoginScreen;