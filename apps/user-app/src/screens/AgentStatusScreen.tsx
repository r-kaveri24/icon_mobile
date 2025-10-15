import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { Ionicons } from '@expo/vector-icons';

type AgentStatusNavProp = StackNavigationProp<RootStackParamList, 'AgentStatus'>;
type AgentStatusRouteProp = RouteProp<RootStackParamList, 'AgentStatus'>;

interface Props {
  navigation: AgentStatusNavProp;
  route: AgentStatusRouteProp;
}

const timelineEntries = [
  { key: 'raised', title: 'Request Raised', desc: 'You submitted a service request', time: '10:12 AM', status: 'done' as const },
  { key: 'searching', title: 'Searching For Agent', desc: 'Matching an available technician', time: '10:13 AM', status: 'done' as const },
  { key: 'accepted', title: 'Agent Accepted', desc: 'Rahul accepted your request', time: '10:16 AM', status: 'done' as const },
  { key: 'eta', title: 'ETA Confirmed', desc: 'Estimated arrival in 25 minutes', time: '10:18 AM', status: 'done' as const },
  { key: 'departed', title: 'Agent Departed', desc: 'Technician is on the way', time: '10:22 AM', status: 'current' as const },
  { key: 'arrived', title: 'Agent Arrived', desc: 'Reaching your location', time: '—', status: 'pending' as const },
  { key: 'diagnosis', title: 'Diagnosis Started', desc: 'Assessing device issues', time: '—', status: 'pending' as const },
  { key: 'part', title: 'Part Required', desc: 'Spare part identified', time: '—', status: 'pending' as const },
  { key: 'ordered', title: 'Part Ordered', desc: 'Ordering the required part', time: '—', status: 'pending' as const },
  { key: 'repair', title: 'Repair In Progress', desc: 'Fixing the device', time: '—', status: 'pending' as const },
  { key: 'testing', title: 'Testing & QA', desc: 'Verifying the fix', time: '—', status: 'pending' as const },
  { key: 'complete', title: 'Completed', desc: 'Service marked done', time: '—', status: 'pending' as const },
];

export default function AgentStatusScreen({ navigation, route }: Props) {
  // Placeholder progress; in future, fetch by requestId from route.params
  const progressIndex = timelineEntries.findIndex(e => e.status === 'current');

  return (
    <Screen style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="h2" style={styles.title}>Agent Request Timeline</Text>
        <Text variant="caption" color="#666">Track your service status</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timelineList}>
        {timelineEntries.map((item, index) => {
          const isReached = index <= progressIndex;
          const isCurrent = index === progressIndex;
          const isLast = index === timelineEntries.length - 1;
          return (
            <View key={item.key} style={styles.row}>
              <View style={styles.leftCol}>
                <View style={[styles.dot, isReached ? styles.dotActive : styles.dotInactive, isCurrent && styles.dotCurrent]} />
                {!isLast && (
                  <View style={[styles.vline, isReached ? styles.vlineActive : styles.vlineInactive]} />
                )}
              </View>
              <View style={[styles.card, isCurrent && styles.cardCurrent]}>
                <Text variant="body" style={styles.cardTitle}>{item.title}</Text>
                <Text variant="caption" color="#666">{item.desc}</Text>
                <Text variant="caption" color="#999">{item.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.actions}>
        <Button title="Back to Agent Hub" onPress={() => navigation.navigate('AgentHub')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F2',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
    color: '#2E2E2E',
  },
  timelineList: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftCol: {
    width: 28,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C9CED6',
    backgroundColor: '#FFFFFF',
  },
  dotActive: {
    backgroundColor: '#2C5AA0',
    borderColor: '#2C5AA0',
  },
  dotInactive: {
    backgroundColor: '#FFFFFF',
  },
  dotCurrent: {
    shadowColor: '#2C5AA0',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  vline: {
    width: 2,
    flexGrow: 1,
    minHeight: 36,
    marginTop: 4,
    borderRadius: 1,
  },
  vlineActive: {
    backgroundColor: '#2C5AA0',
  },
  vlineInactive: {
    backgroundColor: '#D8DDE6',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardCurrent: {
    borderColor: '#2C5AA0',
    shadowColor: '#2C5AA0',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    color: '#2E2E2E',
    marginBottom: 4,
    fontWeight: '600',
  },
  actions: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});