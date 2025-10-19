import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen, Text, Button } from '@icon/ui';
import { agentService } from '@icon/api';
import { useAgent } from '../providers/AgentProvider';

const DashboardScreen: React.FC = () => {
  const { agent, setAgent, loading, setLoading, config } = useAgent();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await agentService.getAgentDashboard();
        setAgent(data);
      } catch (error) {
        console.error('Failed to fetch agent dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [setAgent, setLoading]);

  return (
    <Screen backgroundColor="#FAF8F2" style={styles.container}>
      <View style={styles.card}>
        <Text variant="h2" style={styles.title}>Agent Dashboard</Text>
        <Text variant="body" style={styles.subtitle}>
          {config.mockMode ? 'Mock Mode' : 'Live'} environment
        </Text>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2E2E2E" />
            <Text variant="caption" style={styles.loaderText}>Loading dashboard...</Text>
          </View>
        ) : (
          <View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text variant="h3">Active Sessions</Text>
                <Text variant="h2">{agent?.activeSessions ?? 0}</Text>
              </View>
              <View style={styles.statBox}>
                <Text variant="h3">Pending Requests</Text>
                <Text variant="h2">{agent?.pendingRequests ?? 0}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Button title="Health Check" variant="primary" size="large" />
              <Button title="Settings" variant="outline" size="large" />
            </View>
          </View>
        )}
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
  loader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loaderText: {
    color: '#666',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
});

export default DashboardScreen;