import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AgentStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useAgent } from '../providers/AgentProvider';

interface Props {
  navigation: StackNavigationProp<AgentStackParamList, 'Settings'>;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { config, toggleMockMode } = useAgent();

  return (
    <Screen backgroundColor="#FAF8F2" style={styles.container}>
      <View style={styles.card}>
        <Text variant="h2" style={styles.title}>Settings</Text>
        <Text variant="body" style={styles.subtitle}>Configure agent preferences</Text>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Environment</Text>
          <View style={styles.row}>
            <Text variant="body">Mock Mode</Text>
            <Button
              title={config.mockMode ? 'Disable' : 'Enable'}
              onPress={toggleMockMode}
              variant={config.mockMode ? 'secondary' : 'primary'}
              size="medium"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>About</Text>
          <Text variant="body">App Version: {config.version || '1.0.0'}</Text>
          <Text variant="caption">Environment: {config.environment}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="View Health Check"
            onPress={() => navigation.navigate('HealthCheck')}
            variant="outline"
            size="large"
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    color: '#666',
    marginBottom: 12,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    marginTop: 16,
  },
});

export default SettingsScreen;