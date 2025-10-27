import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AgentStackParamList, ServiceType } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useAgent } from '../providers/AgentProvider';
import { CARD_COLORS } from '../components/theme'
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export type ServiceFlowNav = StackNavigationProp<AgentStackParamList, 'ServiceFlow'>;
export type ServiceFlowRoute = RouteProp<AgentStackParamList, 'ServiceFlow'>;

interface Props {
  navigation: ServiceFlowNav;
  route: ServiceFlowRoute;
}

type StageKey = 'ACCEPT' | 'ETA' | 'START_VISIT' | 'DIAGNOSIS' | 'REPAIR' | 'END_VISIT' | 'BUILD' | 'INSTALL' | 'QA' | 'COMPLETED';
interface TimelineEvent { id: string; type: StageKey | 'CANCELLED' | 'REASSIGN'; description?: string; timestamp: string; actor: 'AGENT'|'ADMIN'|'USER'; }

const SERVICE_FLOWS: Record<ServiceType, StageKey[]> = {
  IN_HOUSE: ['ACCEPT', 'ETA', 'START_VISIT', 'DIAGNOSIS', 'REPAIR', 'END_VISIT', 'COMPLETED'],
  IN_SHOP: ['ACCEPT', 'DIAGNOSIS', 'REPAIR', 'COMPLETED'],
  PC_BUILD: ['ACCEPT', 'BUILD', 'INSTALL', 'QA', 'COMPLETED'],
};

const StageLabel: Record<StageKey, string> = {
  ACCEPT: 'Accept Request',
  ETA: 'Set ETA',
  START_VISIT: 'Start Visit',
  DIAGNOSIS: 'Diagnosis',
  REPAIR: 'Repair',
  END_VISIT: 'End Visit',
  BUILD: 'Build',
  INSTALL: 'Install',
  QA: 'QA',
  COMPLETED: 'Completed',
};

const ServiceFlowScreen: React.FC<Props> = ({ navigation, route }) => {
  const { config } = useAgent();
  const { requestId, serviceType, etaMinutes } = route.params;
  const stages = useMemo(() => SERVICE_FLOWS[serviceType], [serviceType]);

  const indexOfStage = (key: StageKey) => stages.findIndex(s => s === key);
  const initialIndex = useMemo(() => {
    if (serviceType === 'IN_HOUSE') {
      const idxEta = indexOfStage('ETA');
      return idxEta >= 0 ? idxEta : 0;
    }
    return 0;
  }, [serviceType, stages]);

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const [etaTargetTs, setEtaTargetTs] = useState<number | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (serviceType === 'IN_HOUSE' && typeof etaMinutes === 'number' && etaMinutes > 0) {
      const target = Date.now() + etaMinutes * 60 * 1000;
      setEtaTargetTs(target);
      setTimeline(prev => [
        ...prev,
        {
          id: `${requestId}-eta-${Date.now()}`,
          type: 'ETA',
          description: `ETA set to ${etaMinutes} minutes`,
          timestamp: new Date().toISOString(),
          actor: 'AGENT',
        },
      ]);
      const tick = () => {
        const secs = Math.max(Math.ceil((target - Date.now()) / 1000), 0);
        setTimeLeftSec(secs);
      };
      tick();
      timerRef.current = setInterval(tick, 1000) as unknown as number;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [serviceType, etaMinutes, requestId]);

  const formatTime = (seconds: number) => {
    const s = seconds % 60;
    const mTotal = Math.floor(seconds / 60);
    const m = mTotal % 60;
    const h = Math.floor(mTotal / 60);
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  const advance = () => {
    const nextIndex = Math.min(currentIndex + 1, stages.length - 1);
    const nextStage = stages[nextIndex];
    const evt: TimelineEvent = {
      id: `${requestId}-${Date.now()}`,
      type: nextStage,
      description: `Moved to ${StageLabel[nextStage]}`,
      timestamp: new Date().toISOString(),
      actor: 'AGENT',
    };
    setTimeline(prev => [...prev, evt]);
    setCurrentIndex(nextIndex);
  };

  const startVisit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Hide ETA countdown and button after starting the visit
    setEtaTargetTs(null);
    setTimeLeftSec(0);
    const idx = indexOfStage('START_VISIT');
    if (idx >= 0) {
      setCurrentIndex(idx);
    }
    setTimeline(prev => [
      ...prev,
      {
        id: `${requestId}-${Date.now()}`,
        type: 'START_VISIT',
        description: 'Started visit',
        timestamp: new Date().toISOString(),
        actor: 'AGENT',
      },
    ]);
  };

  const openTimeline = () => {
    navigation.navigate('Timeline', { requestId, events: timeline });
  };

  return (
    <Screen backgroundColor="#FAF8F2" style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Requests')} style={styles.backButton} accessibilityLabel="Back to Requests">
              <Ionicons name="arrow-back-outline" size={22} color="#000" />
            </TouchableOpacity>
            <Text variant="h2" style={{ color: '#333' }}>Service Flow</Text>
          </View>
          <Text variant="caption" style={[styles.subtitle, { color: CARD_COLORS.caption }]}>Request {requestId}</Text>
          <Text variant="caption" style={[styles.subtitle, { color: CARD_COLORS.caption }]}>Type: {serviceType.replace('_', ' ')}</Text>
          <Text variant="caption" style={[styles.subtitle, { color: CARD_COLORS.caption }]}>{config.mockMode ? 'Mock Mode' : 'Live'}</Text>
        </View>

        <View style={styles.flowCard}>
          {serviceType === 'IN_HOUSE' && etaTargetTs && currentIndex < indexOfStage('START_VISIT') && (
            <View style={styles.etaCard}>
              <Text variant="h3">Arriving in</Text>
              <Text variant="h2" style={styles.etaCountdown}>{formatTime(timeLeftSec)}</Text>
              <View style={styles.etaActions}>
                <Button title="Start Visit" variant="primary" size="small" onPress={startVisit} />
              </View>
            </View>
          )}

          {stages.map((stage, idx) => (
            <View key={stage} style={styles.stageRow}>
              <View style={[styles.stageMarker, idx <= currentIndex ? styles.stageActive : styles.stageInactive]} />
              <View style={styles.stageContent}>
                <Text variant="h3" numberOfLines={1}>{StageLabel[stage]}</Text>
                <Text variant="caption">{idx < currentIndex ? 'Done' : idx === currentIndex ? 'Current' : 'Pending'}</Text>
              </View>
            </View>
          ))}

          <View style={styles.actions}>
            <Button title="Advance" variant="primary" size="small" onPress={advance} style={{ flex: 1, marginRight: 8 }} />
            <Button title="View Timeline" variant="secondary" size="small" onPress={openTimeline} style={{ flex: 1 }} />
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomNavBar
          onHome={() => navigation.navigate('Dashboard')}
          onSocial={() => navigation.navigate('Requests')}
         onNotifications={() => navigation.navigate('Notifications')}
          onProfile={() => navigation.navigate('Profile')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24, paddingHorizontal: 16 },
  header: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backButton: { padding: 4 },
  subtitle: { color: '#555' },
  flowCard: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: CARD_COLORS.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  etaCard: { backgroundColor: '#F9FBFF', borderColor: CARD_COLORS.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  etaCountdown: { color: '#2E86FF' },
  etaActions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stageMarker: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  stageActive: { backgroundColor: '#34C759' },
  stageInactive: { backgroundColor: '#E5E5E5' },
  stageContent: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
});

export default ServiceFlowScreen;