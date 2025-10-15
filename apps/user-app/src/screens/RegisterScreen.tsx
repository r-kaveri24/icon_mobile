import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, RegisterForm } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { authService } from '@icon/api';
import { useApp } from '../providers/AppProvider';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { setLoading } = useApp();
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(form);
      
      if (response.success) {
        // Ensure loading is cleared before navigating to animation screen
        setLoading(false);
        // Navigate to success screen (avoid replace to prevent web issues)
        navigation.navigate('RegisterSuccess');
      } else {
        Alert.alert('Error', response.error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error('Register Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text variant="h2" style={styles.title}>
              Create Your Account
            </Text>
            <Text variant="body" style={styles.subtitle}>
              Join Icon Computer today
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text variant="body" style={styles.label}>
                Full Name
              </Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

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
                returnKeyType="next"
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
                returnKeyType="next"
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="body" style={styles.label}>
                Confirm Password
              </Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>

            <Button
              title="Register"
              onPress={handleRegister}
              variant="primary"
              size="large"
              style={styles.registerButton}
            />

            <View style={styles.loginSection}>
              <Text variant="body" style={styles.loginText}>
                Already have an account?
              </Text>
              <Button
                title="Login Here"
                onPress={handleLoginPress}
                variant="ghost"
                size="medium"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
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
  registerButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  loginSection: {
    alignItems: 'center',
  },
  loginText: {
    marginBottom: 10,
    color: '#666',
  },
});

export default RegisterScreen;