import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AgentStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useAgent } from '../providers/AgentProvider';

type SettingsScreenNavigationProp = StackNavigationProp<AgentStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'button' | 'info';
  value?: boolean;
  action?: () => void;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { config, agent, setLoading } = useAgent();
  const [notifications, setNotifications] = useState(true);
  const [autoHealthCheck, setAutoHealthCheck] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            // Simulate cache clearing
            setTimeout(() => {
              setLoading(false);
              Alert.alert('Success', 'Cache cleared successfully');
            }, 1500);
          }
        }
      ]
    );
  };

  const handleExportLogs = () => {
    Alert.alert(
      'Export Logs',
      'System logs will be exported to your device storage.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Success', 'Logs exported successfully');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setAutoHealthCheck(true);
            setDebugMode(false);
            setDataCollection(true);
            Alert.alert('Success', 'Settings reset to defaults');
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Agent App',
      `Version: 1.0.0\nBuild: ${config.mockMode ? 'Mock' : 'Production'}\nAgent ID: ${agent?.id || 'N/A'}\n\nThis is the ICON Computer Agent application for system monitoring and health checks.`,
      [{ text: 'OK' }]
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive alerts for system issues and updates',
      type: 'toggle',
      value: notifications,
      action: () => setNotifications(!notifications)
    },
    {
      id: 'autoHealthCheck',
      title: 'Auto Health Check',
      description: 'Automatically perform health checks every 5 minutes',
      type: 'toggle',
      value: autoHealthCheck,
      action: () => setAutoHealthCheck(!autoHealthCheck)
    },
    {
      id: 'debugMode',
      title: 'Debug Mode',
      description: 'Enable detailed logging and debug information',
      type: 'toggle',
      value: debugMode,
      action: () => setDebugMode(!debugMode)
    },
    {
      id: 'dataCollection',
      title: 'Data Collection',
      description: 'Allow anonymous usage data collection for improvements',
      type: 'toggle',
      value: dataCollection,
      action: () => setDataCollection(!dataCollection)
    }
  ];

  const actions: SettingItem[] = [
    {
      id: 'clearCache',
      title: 'Clear Cache',
      description: 'Remove all cached data and temporary files',
      type: 'button',
      action: handleClearCache
    },
    {
      id: 'exportLogs',
      title: 'Export Logs',
      description: 'Export system logs for troubleshooting',
      type: 'button',
      action: handleExportLogs
    },
    {
      id: 'resetSettings',
      title: 'Reset Settings',
      description: 'Reset all settings to default values',
      type: 'button',
      action: handleResetSettings
    },
    {
      id: 'about',
      title: 'About',
      description: 'App version and information',
      type: 'button',
      action: handleAbout
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <View key={item.id} style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text variant="body" style={styles.settingTitle}>
            {item.title}
          </Text>
          <Text variant="caption" style={styles.settingDescription}>
            {item.description}
          </Text>
        </View>
        
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.action}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.value ? '#f5dd4b' : '#f4f3f4'}
          />
        )}
        
        {item.type === 'button' && (
          <Button
            title="Action"
            onPress={item.action || (() => {})}
            variant="outline"
            size="small"
          />
        )}
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            Agent Settings
          </Text>
          <Text variant="caption" style={styles.subtitle}>
            Configure your agent application preferences
          </Text>
        </View>

        {/* Agent Info Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Agent Information
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text variant="body" style={styles.infoLabel}>Agent ID:</Text>
              <Text variant="body" style={styles.infoValue}>
                {agent?.id || 'Not Available'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="body" style={styles.infoLabel}>Status:</Text>
              <Text variant="body" style={StyleSheet.flatten([
                styles.infoValue,
                { color: agent?.status === 'active' ? '#4CAF50' : '#F44336' }
              ])}>
                {agent?.status || 'Unknown'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="body" style={styles.infoLabel}>Environment:</Text>
              <Text variant="body" style={styles.infoValue}>
                {config.environment} {config.mockMode ? '(Mock)' : ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="body" style={styles.infoLabel}>API URL:</Text>
              <Text variant="caption" style={styles.infoValue}>
                {config.apiUrl}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Preferences
          </Text>
          <View style={styles.settingsCard}>
            {settings.map(renderSettingItem)}
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            Actions
          </Text>
          <View style={styles.settingsCard}>
            {actions.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.footer}>
          <Text variant="caption" color="#666">
            ICON Computer Agent v1.0.0
          </Text>
          <Text variant="caption" color="#666">
            {config.mockMode ? 'Running in Mock Mode' : 'Connected to Live Services'}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    gap: 5,
  },
});

export default SettingsScreen;