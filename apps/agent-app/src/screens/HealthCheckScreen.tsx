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
      setHealthStatus('checking');
      const response = await healthService.checkHealth();
      
      if (response && (response as any).status) {
        setHealthData(response);
        setMetrics(buildMetrics(response));
        setLastUpdate(new Date());
        setHealthStatus(response.status === 'ok' ? 'healthy' : 'unhealthy');
      } else {
        setHealthStatus('unhealthy');
      }
    } catch (error) {
      console.error('Detailed Health Check Error:', error);
      setHealthStatus('unhealthy');
    }
  };

  const buildMetrics = (data: HealthCheckResponse): HealthMetric[] => {
    return [
      {
        name: 'API Status',
        status: data.status === 'ok' ? 'healthy' : 'error',
        value: data.status.toUpperCase(),
        description: 'Overall API health status',
      },
      {
        name: 'Database',
        status: data.database === 'connected' ? 'healthy' : 'error',
        value: data.database.toUpperCase(),
        description: 'Database connectivity state',
      },
      {
        name: 'Version',
        status: 'healthy',
        value: data.version,
        description: 'Backend service version',
      },
      {
        name: 'Timestamp',
        status: 'healthy',
        value: new Date(data.timestamp).toLocaleString(),
        description: 'Last health check timestamp',
      },
    ];
  };

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleRefresh = async () => {
    await performDetailedHealthCheck();
  };

  const handleExportReport = () => {
    Alert.alert('Export', 'Health report exported successfully (mock).');
  };

  return (
    <Screen backgroundColor="#FAF8F2" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            Detailed Health Check
          </Text>
          <Text variant="caption" style={styles.subtitle}>
            {lastUpdate ? `Last updated: ${lastUpdate.toLocaleString()}` : 'No data yet'}
          </Text>
        </View>

        <View style={styles.metricsCard}>
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <Text variant="h3" style={styles.metricName}>{metric.name}</Text>
                <View style={[styles.metricStatus, { backgroundColor: getStatusColor(metric.status) }]}
                >
                  <Text variant="caption" style={styles.metricStatusText}>
                    {metric.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text variant="body" style={styles.metricValue}>{metric.value}</Text>
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
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    color: '#666',
  },
  metricsCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  metricRow: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricName: {
    marginBottom: 8,
  },
  metricStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metricStatusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  metricValue: {
    color: '#333',
  },
  metricDescription: {
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

export default HealthCheckScreen;