import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useApp } from '../providers/AppProvider';

type ChangePasswordNavProp = StackNavigationProp<RootStackParamList, 'ChangePassword'>;

interface Props {
  navigation: ChangePasswordNavProp;
}

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useApp();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  const onChange = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    if (!form.currentPassword.trim()) {
      Alert.alert('Validation', 'Please enter your current password');
      return;
    }
    if (form.newPassword.length < 6) {
      Alert.alert('Validation', 'New password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      Alert.alert('Validation', 'New password and confirmation do not match');
      return;
    }

    // Placeholder success; integrate API later
    Alert.alert('Success', 'Password changed successfully', [
      { text: 'OK', onPress: () => navigation.navigate('Profile') }
    ]);
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text variant="h2" style={styles.title}>Change Password</Text>
            <Text variant="caption" color="#666">Update your account password</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text variant="body" style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={form.currentPassword}
              onChangeText={(v) => onChange('currentPassword', v)}
              placeholder="Enter current password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="body" style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={form.newPassword}
              onChangeText={(v) => onChange('newPassword', v)}
              placeholder="Enter new password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="body" style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(v) => onChange('confirmPassword', v)}
              placeholder="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.actions}>
            <Button title="Change Password" onPress={onSubmit} variant="primary" size="large" />
            <View style={{ height: 8 }} />
            <Button title="Cancel" onPress={() => navigation.goBack()} variant="secondary" size="large" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  actions: {
    marginTop: 8,
  },
});

export default ChangePasswordScreen;