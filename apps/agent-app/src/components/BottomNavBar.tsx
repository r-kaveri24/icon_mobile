import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@icon/ui';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onHome?: () => void;
  onSocial?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

const BottomNavBar: React.FC<Props> = ({ onHome, onSocial, onNotifications, onProfile }) => {
  return (
    <View style={styles.container}>
      <NavItem icon="home-outline" label="Home" onPress={onHome} />
      <NavItem icon="reader-outline" label="Requests" onPress={onSocial} />
      <NavItem icon="notifications-outline" label="Notifications" onPress={onNotifications} />
      <NavItem icon="person-outline" label="Profile" onPress={onProfile} />
    </View>
  );
};

const NavItem: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; }>
 = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#7C8DA4" />
    <Text variant="caption" style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEF3FB',
    paddingVertical: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    color: '#7C8DA4',
  },
});

export default BottomNavBar;