import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, RefreshControl, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AgentStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { healthService, agentService } from '@icon/api';
import { useAgent } from '../providers/AgentProvider';

type DashboardScreenNavigationProp = StackNavigationProp<AgentStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { config, isLoading, setLoading, healthStatus, setHealthStatus, agent, setAgent } = useAgent();
  const [refreshing, setRefreshing] = useState(false);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);

  useEffect(() => {
    performInitialChecks();
  }, []);

  const performInitialChecks = async () => {
    await Promise.all([
      checkSystemHealth(),
      loadAgentInfo()
    ]);
  };

  const checkSystemHealth = async () => {
    try {
      setHealthStatus('checking');
      const response = await healthService.checkHealth();
      
      if (response.success && response.data) {
        setHealthStatus(response.data.status === 'healthy' ? 'healthy' : 'unhealthy');
        setLastHealthCheck(new Date());
      } else {
        setHealthStatus('unhealthy');
      }
    } catch (error) {
      console.error('Health Check Error:', error);
      setHealthStatus('unhealthy');
    }
  };

  const loadAgentInfo = async () => {
    try {
      setLoading(true);
      const response = await agentService.getCurrentAgent();
      
      if (response.success && response.data) {
        setAgent(response.data);
      }
    } catch (error) {
      console.error('Load Agent Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await performInitialChecks();
    setRefreshing(false);
  };

  const handleHealthCheckPress = () => {
    navigation.navigate('HealthCheck');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleQuickHealthCheck = async () => {
    await checkSystemHealth();
    Alert.alert(
      'Health Check Complete',
      `System status: ${healthStatus === 'healthy' ? 'All systems operational' : 'Issues detected'}`
    );
  };

  const getHealthStatusColor = () => {
    switch (healthStatus) {
      case 'healthy': return '#4CAF50';
      case 'unhealthy': return '#F44336';
      case 'checking': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getHealthStatusText = () => {
    switch (healthStatus) {
      case 'healthy': return 'System Healthy';
      case 'unhealthy': return 'Issues Detected';
      case 'checking': return 'Checking...';
      default: return 'Status Unknown';
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            Agent Dashboard
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Icon Computer System Monitor
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text variant="h3">System Status</Text>
            <View style={[styles.statusIndicator, { backgroundColor: getHealthStatusColor() }]}>
              <Text variant="caption" style={styles.statusText}>
                {getHealthStatusText()}
              </Text>
            </View>
          </View>
          
          {lastHealthCheck && (
            <Text variant="caption" style={styles.lastCheck}>
              Last checked: {lastHealthCheck.toLocaleTimeString()}
            </Text>
          )}
          
          <Button
            title="Quick Health Check"
            onPress={handleQuickHealthCheck}
            variant="outline"
            size="medium"
            style={styles.quickCheckButton}
          />
        </View>

        {agent && (
          <View style={styles.agentCard}>
            <Text variant="h3" style={styles.cardTitle}>
              Agent Information
            </Text>
            <View style={styles.agentInfo}>
              <Text variant="body" style={styles.agentName}>
                {agent.name}
              </Text>
              <Text variant="caption" style={styles.agentId}>
                ID: {agent.id}
              </Text>
              <Text variant="caption" style={styles.agentStatus}>
                Status: {agent.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionsSection}>
          <Button
            title="Detailed Health Check"
            onPress={handleHealthCheckPress}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          
          <Button
            title="Settings"
            onPress={handleSettingsPress}
            variant="secondary"
            size="large"
            style={styles.actionButton}
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
    textAlign: 'center',
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lastCheck: {
    color: '#666',
    marginBottom: 15,
  },
  quickCheckButton: {
    marginTop: 10,
  },
  agentCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    marginBottom: 15,
  },
  agentInfo: {
    gap: 5,
  },
  agentName: {
    fontWeight: '600',
  },
  agentId: {
    color: '#666',
  },
  agentStatus: {
    color: '#666',
  },
  actionsSection: {
    margin: 15,
    gap: 10,
  },
  actionButton: {
    marginVertical: 5,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
});

export default DashboardScreen;