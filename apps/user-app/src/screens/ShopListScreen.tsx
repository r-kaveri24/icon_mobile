import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Shop } from '@icon/config';
import { Screen, Text, Button } from '@icon/ui';
import { cmsService } from '@icon/api';
import { useApp } from '../providers/AppProvider';

type ShopListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShopList'>;

interface Props {
  navigation: ShopListScreenNavigationProp;
}

const ShopListScreen: React.FC<Props> = ({ navigation }) => {
  const { setLoading } = useApp();
  const [shops, setShops] = useState<Shop[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      const response = await cmsService.getShops();
      if (response.success && response.data) {
        setShops(response.data);
      } else {
        Alert.alert('Error', 'Failed to load shops');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
      console.error('Load Shops Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadShops();
    setRefreshing(false);
  };

  const handleShopPress = (shop: Shop) => {
    navigation.navigate('ShopDetail', { shopId: shop.id });
  };

  const renderShopItem = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => handleShopPress(item)}
    >
      <View style={styles.shopHeader}>
        <Text variant="h3" style={styles.shopName}>
          {item.name}
        </Text>
        <Text variant="caption" style={[
          styles.statusBadge,
          { backgroundColor: item.isActive ? '#4CAF50' : '#F44336' }
        ] as any}>
          {item.isActive ? 'Open' : 'Closed'}
        </Text>
      </View>
      
      <Text variant="body" style={styles.shopAddress}>
        {item.address}
      </Text>
      
      <Text variant="body" style={styles.shopPhone}>
        📞 {item.phone}
      </Text>
      
      <Text variant="caption" style={styles.shopHours}>
        Hours: {item.operatingHours}
      </Text>
      
      <View style={styles.shopFooter}>
        <Text variant="caption" color="#666">
          Tap to view details
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Our Shops
        </Text>
        <Text variant="body" style={styles.subtitle}>
          Find an Icon Computer shop near you
        </Text>
      </View>

      {shops.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="body" style={styles.emptyText}>
            No shops available at the moment
          </Text>
          <Button
            title="Refresh"
            onPress={handleRefresh}
            variant="outline"
            size="medium"
          />
        </View>
      ) : (
        <FlatList
          data={shops}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
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
  listContainer: {
    padding: 15,
  },
  shopItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  shopAddress: {
    marginBottom: 4,
    color: '#666',
  },
  shopPhone: {
    marginBottom: 4,
    color: '#333',
  },
  shopHours: {
    marginBottom: 8,
    color: '#666',
  },
  shopFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
});

export default ShopListScreen;