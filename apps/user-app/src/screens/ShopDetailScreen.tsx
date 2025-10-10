import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Shop } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { cmsService } from '@icon/api';
import { useApp } from '../providers/AppProvider';

type ShopDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShopDetail'>;
type ShopDetailScreenRouteProp = RouteProp<RootStackParamList, 'ShopDetail'>;

interface Props {
  navigation: ShopDetailScreenNavigationProp;
  route: ShopDetailScreenRouteProp;
}

const ShopDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { shopId } = route.params;
  const { setLoading } = useApp();
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    loadShopDetail();
  }, [shopId]);

  const loadShopDetail = async () => {
    try {
      setLoading(true);
      const response = await cmsService.getShopById(shopId);
      if (response.success && response.data) {
        setShop(response.data);
      } else {
        Alert.alert('Error', 'Failed to load shop details');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error('Load Shop Detail Error:', error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCallShop = () => {
    if (shop?.phone) {
      Alert.alert(
        'Call Shop',
        `Would you like to call ${shop.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => {
            // In a real app, you would use Linking.openURL(`tel:${shop.phone}`)
            Alert.alert('Call Feature', `Calling ${shop.phone}...`);
          }}
        ]
      );
    }
  };

  const handleGetDirections = () => {
    if (shop?.address) {
      Alert.alert(
        'Get Directions',
        `Open maps to ${shop.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Maps', onPress: () => {
            // In a real app, you would use Linking.openURL with maps URL
            Alert.alert('Maps Feature', `Opening directions to ${shop.address}...`);
          }}
        ]
      );
    }
  };

  if (!shop) {
    return (
      <Screen style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="body">Loading shop details...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h1" style={styles.shopName}>
            {shop.name}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: shop.isActive ? '#4CAF50' : '#F44336' }
          ]}>
            <Text variant="caption" style={styles.statusText}>
              {shop.isActive ? 'Currently Open' : 'Currently Closed'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text variant="h3" style={styles.infoLabel}>
              📍 Address
            </Text>
            <Text variant="body" style={styles.infoValue}>
              {shop.address}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text variant="h3" style={styles.infoLabel}>
              📞 Phone
            </Text>
            <Text variant="body" style={styles.infoValue}>
              {shop.phone}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text variant="h3" style={styles.infoLabel}>
              🕒 Operating Hours
            </Text>
            <Text variant="body" style={styles.infoValue}>
              {shop.operatingHours}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Call Shop"
            onPress={handleCallShop}
            variant="primary"
            size="large"
            style={styles.actionButton}
          />
          
          <Button
            title="Get Directions"
            onPress={handleGetDirections}
            variant="outline"
            size="large"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.servicesSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            Services Available
          </Text>
          <View style={styles.servicesList}>
            <Text variant="body" style={styles.serviceItem}>
              • Computer Sales & Repairs
            </Text>
            <Text variant="body" style={styles.serviceItem}>
              • Hardware Upgrades
            </Text>
            <Text variant="body" style={styles.serviceItem}>
              • Software Installation
            </Text>
            <Text variant="body" style={styles.serviceItem}>
              • Technical Support
            </Text>
            <Text variant="body" style={styles.serviceItem}>
              • Data Recovery
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  shopName: {
    textAlign: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    marginBottom: 5,
    color: '#333',
  },
  infoValue: {
    color: '#666',
    lineHeight: 20,
  },
  actionsSection: {
    margin: 15,
    gap: 10,
  },
  actionButton: {
    marginVertical: 5,
  },
  servicesSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    color: '#666',
    lineHeight: 20,
  },
});

export default ShopDetailScreen;