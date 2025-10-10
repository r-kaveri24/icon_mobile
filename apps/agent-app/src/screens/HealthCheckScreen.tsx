import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AgentStackParamList, HealthCheckResponse } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { healthService } from '@icon/api';
import { useAgent } from '../providers/AgentProvider';

type HealthCheckScreenNavigationProp = StackNavigationProp<AgentStackParamList, 'HealthCheck'>;

interface Props {
  navigation: HealthCheckScreenNavigationProp;
}

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value?: string;
  description?: string;
}

const HealthCheckScreen: React.FC<Props> = ({ navigation }) => {
  const { config, setLoading, healthStatus, setHealthStatus } = useAgent();
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    performDetailedHealthCheck();
  }, []);

  const performDetailedHealthCheck = async () => {
    try {
      setLoading(true);
      setHealthStatus('checking');
      
      const response = await healthService.checkHealth();
      
      if (response.success && response.data) {
        setHealthData(response.data);
        setHealthStatus(response.data.status === 'healthy' ? 'healthy' : 'unhealthy');
        generateMetrics(response.data);
        setLastUpdate(new Date());
      } else {
        setHealthStatus('unhealthy');
        Alert.alert('Error', 'Failed to perform health check');
      }
    } catch (error) {
      console.error('Health Check Error:', error);
      setHealthStatus('unhealthy');
      Alert.alert('Error', 'Network error during health check');
    } finally {
      setLoading(false);
    }
  };

  const generateMetrics = (data: HealthCheckResponse) => {
    const newMetrics: HealthMetric[] = [
      {
        name: 'API Status',
        status: data.status === 'healthy' ? 'healthy' : 'error',
        value: data.status,
        description: 'Overall API health status'
      },
      {
        name: 'Response Time',
        status: data.responseTime && data.responseTime < 1000 ? 'healthy' : 'warning',
        value: data.responseTime ? `${data.responseTime}ms` : 'N/A',
        description: 'API response time'
      },
      {
        name: 'Database',
        status: 'healthy', // Mock data - in real app this would come from API
        value: 'Connected',
        description: 'Database connection status'
      },
      {
        name: 'Memory Usage',
        status: 'healthy', // Mock data
        value: '45%',
        description: 'System memory utilization'
      },
      {
        name: 'Disk Space',
        status: 'warning', // Mock data
        value: '78%',
        description: 'Available disk space'
      },
      {
        name: 'Network',
        status: 'healthy', // Mock data
        value: 'Online',
        description: 'Network connectivity'
      }
    ];

    setMetrics(newMetrics);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const handleRefresh = () => {
    performDetailedHealthCheck();
  };

  const handleExportReport = () => {
    Alert.alert(
      'Export Report',
      'Health check report export feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            System Health Check
          </Text>
          {lastUpdate && (
            <Text variant="caption" style={styles.lastUpdate}>
              Last updated: {lastUpdate.toLocaleString()}
            </Text>
          )}
        </View>

        {healthData && (
          <View style={styles.overallStatus}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(healthData.status) }]}>
              <Text variant="h3" style={styles.statusText}>
                {getStatusIcon(healthData.status)} {healthData.status.toUpperCase()}
              </Text>
            </View>
            {healthData.message && (
              <Text variant="body" style={styles.statusMessage}>
                {healthData.message}
              </Text>
            )}
          </View>
        )}

        <View style={styles.metricsSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            System Metrics
          </Text>
          
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text variant="body" style={styles.metricName}>
                  {getStatusIcon(metric.status)} {metric.name}
                </Text>
                <Text variant="body" style={[
                  styles.metricValue,
                  { color: getStatusColor(metric.status) }
                ]}>
                  {metric.value}
                </Text>
              </View>
              {metric.description && (
                <Text variant="caption" style={styles.metricDescription}>
                  {metric.description}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Refresh Health Check"
            onPress={handleRefresh}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          
          <Button
            title="Export Report"
            onPress={handleExportReport}
            variant="outline"
            size="large"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.footer}>
          <Text variant="caption" color="#666">
            {config.mockMode ? 'Mock Mode - Simulated Data' : 'Live Data'}
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
  lastUpdate: {
    color: '#666',
  },
  overallStatus: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusMessage: {
    textAlign: 'center',
    color: '#666',
  },
  metricsSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  metricItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricName: {
    flex: 1,
    fontWeight: '600',
  },
  metricValue: {
    fontWeight: 'bold',
  },
  metricDescription: {
    color: '#666',
    marginTop: 2,
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
  },
});

export default HealthCheckScreen;