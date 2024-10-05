import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import Header from '../../../components/Header';
import { collection, query, where, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface BuildRepairItem {
  id: string;
  type: string;
  createdAt: Timestamp;
  estimatedCost: number;
  projectId: string;
}

export default function BuildRepairScreen() {
  const [buildRepairItems, setBuildRepairItems] = useState<BuildRepairItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchBuildRepairItems();
  }, [navigation, user]);

  const fetchBuildRepairItems = async () => {
    if (!user) return;

    const db = getFirestore();
    const buildRepairsRef = collection(db, 'build_repairs');
    const q = query(buildRepairsRef, where('userId', '==', user.uid));

    try {
      const querySnapshot = await getDocs(q);
      const items: BuildRepairItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as BuildRepairItem);
      });
      setBuildRepairItems(items.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    } catch (error) {
      console.error('Error fetching build/repair items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBuildRepair = (id: string) => {
    router.push({
      pathname: '/build-repair/[id]',
      params: { id }
    });
  };

  const renderBuildRepairItem = ({ item }: { item: BuildRepairItem }) => (
    <TouchableOpacity style={styles.buildRepairItem} onPress={() => handleOpenBuildRepair(item.id)}>
      <View style={styles.buildRepairItemContent}>
        <Text style={styles.buildRepairItemTitle}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Plan</Text>
        <Text style={styles.buildRepairItemDetails}>
          Created: {item.createdAt.toDate().toLocaleDateString()}
        </Text>
        <Text style={styles.buildRepairItemDetails}>
          Estimated Cost: ${item.estimatedCost.toFixed(2)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DE2020" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Build/Repair Plans</Text>
      </View>

      <FlatList
        data={buildRepairItems}
        renderItem={renderBuildRepairItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No build/repair plans found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buildRepairItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buildRepairItemContent: {
    flex: 1,
  },
  buildRepairItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buildRepairItemDetails: {
    fontSize: 14,
    color: '#666',
  },
  emptyListText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});