import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useApp } from '../providers/AppProvider';

type EditProfileNavProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileNavProp;
}

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, setUser } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  const onChange = (field: 'name' | 'email', value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert('Validation', 'Enter a valid email address');
      return;
    }

    const updated: User = {
      ...(user as User),
      name: form.name.trim(),
      email: form.email.trim(),
      updatedAt: new Date().toISOString(),
    };
    setUser(updated);
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => navigation.navigate('Profile') }
    ]);
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text variant="h2" style={styles.title}>Edit Profile</Text>
            <Text variant="caption" color="#666">Update your account details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text variant="body" style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(v) => onChange('name', v)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="body" style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(v) => onChange('email', v)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.actions}>
            <Button title="Save Changes" onPress={onSave} variant="primary" size="large" />
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

export default EditProfileScreen;