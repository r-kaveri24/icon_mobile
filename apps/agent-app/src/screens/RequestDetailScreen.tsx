import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AgentStackParamList } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { useAgent } from '../providers/AgentProvider';
import TopBar from '../components/TopBar';
import { CARD_COLORS } from '../components/theme';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export type RequestDetailNav = StackNavigationProp<AgentStackParamList, 'RequestDetail'>;
export type RequestDetailRoute = RouteProp<AgentStackParamList, 'RequestDetail'>;

interface Props {
  navigation: RequestDetailNav;
  route: RequestDetailRoute;
}

const RequestDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { config } = useAgent();
  const {
    requestId,
    serviceType,
    title,
    customerName,
    nextVisitAt,
    status,
    clientAddress,
    clientPhone,
    clientEmail,
    issueType,
    issueDescription,
  } = route.params;

  const [etaMinutes, setEtaMinutes] = useState<string>('');
  const [etaError, setEtaError] = useState<string>('');

  const acceptRequest = () => {
    // Require ETA for IN_HOUSE before accepting
    if (serviceType === 'IN_HOUSE') {
      const num = parseInt(etaMinutes, 10);
      if (isNaN(num) || num <= 0) {
        setEtaError('Please enter ETA in minutes (positive number).');
        Alert.alert('ETA required', 'Enter a valid ETA in minutes to proceed.');
        return;
      }
      setEtaError('');
      navigation.navigate('ServiceFlow', { requestId, serviceType, etaMinutes: num });
      return;
    }
    navigation.navigate('ServiceFlow', { requestId, serviceType });
  };

  const openServiceFlow = () => {
    navigation.navigate('ServiceFlow', { requestId, serviceType });
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Requests')}
            style={styles.backButton}
            accessibilityLabel="Back to Requests"
          >
            <Ionicons name="arrow-back-outline" size={22} color="#000" />
          </TouchableOpacity>
          <Text variant="h2" style={{ color: CARD_COLORS.title }}>Request Details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text variant="caption" numberOfLines={1} style={{ color: CARD_COLORS.title }}>{title || 'Service request'}</Text>
            {status && (
              <View style={[
                styles.statusChip,
                status === 'NEW' ? styles.new :
                status === 'ACCEPTED' ? styles.accepted :
                status === 'IN_PROGRESS' ? styles.in_progress :
                status === 'COMPLETED' ? styles.completed :
                styles.cancelled
              ]}>
                <Text variant="captionSm" style={styles.chipText} numberOfLines={1}>{status}</Text>
               </View>
             )}
           </View>

           <Text variant="body">Request ID: {requestId}</Text>
           <Text variant="caption" style={{ color: CARD_COLORS.caption }}>Type: {serviceType.replace('_', ' ')}</Text>
           {customerName && <Text variant="body">Customer: {customerName}</Text>}
           {clientPhone && <Text variant="body">Phone: {clientPhone}</Text>}
           {clientEmail && <Text variant="body">Email: {clientEmail}</Text>}
           {serviceType === 'IN_HOUSE' && clientAddress && (
             <Text variant="body">Address: {clientAddress}</Text>
           )}
           {issueType && <Text variant="body">Issue: {issueType}</Text>}
           {issueDescription && <Text variant="caption" style={{ color: CARD_COLORS.caption }}>{issueDescription}</Text>}
           {nextVisitAt && status !== 'NEW' && (
             <Text variant="button">Next visit: {new Date(nextVisitAt).toLocaleString()}</Text>
           )}

           {serviceType === 'IN_HOUSE' && status === 'NEW' && (
             <View style={styles.etaRow}>
               <Text variant="body" style={styles.etaLabel}>ETA (minutes)</Text>
               <TextInput
                 style={styles.input}
                 keyboardType="numeric"
                 placeholder="Enter ETA"
                 value={etaMinutes}
                 onChangeText={setEtaMinutes}
               />
             </View>
           )}
           {etaError ? <Text variant="caption" style={styles.error}>{etaError}</Text> : null}

           <View style={styles.actions}>
             {status === 'NEW' && (
               <Button title="Accept Request" variant="primary" size="small" onPress={acceptRequest} style={{ flex: 1, marginRight: 8 }} />
             )}
             {(status === 'ACCEPTED' || status === 'IN_PROGRESS') && (
               <Button title="Open Service Flow" variant="primary" size="small" onPress={openServiceFlow} style={{ flex: 1, marginRight: 8 }} />
             )}
             <Button title="View Timeline" variant="secondary" size="small" onPress={() => navigation.navigate('Timeline', { requestId })} style={{ flex: 1 }} />
           </View>
         </View>
       </ScrollView>
      <View style={styles.bottomNav}>
        <BottomNavBar onHome={() => navigation.navigate('Dashboard')} onSocial={() => navigation.navigate('Requests')} onProfile={() => navigation.navigate('Profile')}/>
      </View>
     </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  pageHeader: { marginBottom: 12, paddingHorizontal: 20, paddingTop: 20 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  content: { padding: 20, flexGrow: 1, paddingBottom: 90 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEF3FB', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', flexShrink: 0, maxWidth: 120, marginLeft: 8 },
  chipText: { color: '#fff', fontWeight: 'bold' },
  new: { backgroundColor: '#007AFF' },
  accepted: { backgroundColor: '#34C759' },
  in_progress: { backgroundColor: '#FF9800' },
  completed: { backgroundColor: '#4CAF50' },
  cancelled: { backgroundColor: '#F44336' },
  actions: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  etaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  etaLabel: { marginRight: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFF' },
  error: { color: '#E74C3C', marginTop: 6 },
});

export default RequestDetailScreen;