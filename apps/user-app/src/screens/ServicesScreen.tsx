import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@icon/config';
import { Screen, Text } from '@icon/ui';
import { Ionicons } from '@expo/vector-icons';

type ServicesNavProp = StackNavigationProp<RootStackParamList, 'Services'>;

interface Props {
  navigation: ServicesNavProp;
}

const SERVICES = [
  { key: 'cctv', name: 'CCTV Installation', icon: 'videocam-outline' as const },
  { key: 'laptop-repair', name: 'Laptop Repair', icon: 'construct-outline' as const },
  { key: 'computer-setup', name: 'Computer Setup', icon: 'desktop-outline' as const },
  { key: 'data-recovery', name: 'Data Recovery', icon: 'cloud-outline' as const },
  { key: 'network', name: 'Network Troubleshooting', icon: 'wifi-outline' as const },
  { key: 'printer', name: 'Printer Setup', icon: 'print-outline' as const },
  { key: 'battery', name: 'Battery Replacement', icon: 'battery-charging-outline' as const },
  { key: 'screen', name: 'Screen Replacement', icon: 'phone-portrait-outline' as const },
];

const ServicesScreen: React.FC<Props> = () => {
  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>Services</Text>
        <Text variant="caption" color="#666">Some examples of what we offer</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <View style={styles.grid}>
          {SERVICES.map(svc => (
            <TouchableOpacity key={svc.key} style={styles.card} activeOpacity={0.85} accessibilityLabel={svc.name}>
              <View style={styles.cardIconWrap}>
                <Ionicons name={svc.icon} size={26} color="#333" />
              </View>
              <Text variant="body" style={styles.cardText}>{svc.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F2',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: '#2E2E2E',
    marginBottom: 4,
  },
  list: {
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF1F5',
  },
  cardText: {
    color: '#2E2E2E',
    fontWeight: '600',
  },
});