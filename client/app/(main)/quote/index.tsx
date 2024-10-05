import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import Header from '../../../components/Header';
import { collection, query, where, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface QuoteItem {
  id: string;
  type: string;
  createdAt: Timestamp;
  estimatedCost: number;
  projectId: string;
  summary: string;
}

export default function QuoteScreen() {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchQuoteItems();
  }, [navigation, user]);

  const fetchQuoteItems = async () => {
    if (!user) return;

    const db = getFirestore();
    const quotesRef = collection(db, 'quotes');
    const q = query(quotesRef, where('userId', '==', user.uid));

    try {
      const querySnapshot = await getDocs(q);
      const items: QuoteItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as QuoteItem);
      });
      setQuoteItems(items.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    } catch (error) {
      console.error('Error fetching quote items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenQuote = (id: string) => {
    router.push({
      pathname: '/quote/[id]',
      params: { id }
    });
  };

  const renderQuoteItem = ({ item }: { item: QuoteItem }) => (
    <TouchableOpacity style={styles.quoteItem} onPress={() => handleOpenQuote(item.id)}>
      <View style={styles.quoteItemContent}>
        <Text style={styles.quoteItemTitle}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Quote</Text>
        <Text style={styles.quoteItemDetails}>
          Created: {item.createdAt.toDate().toLocaleDateString()}
        </Text>
        <Text style={styles.quoteItemDetails}>
          Estimated Cost: ${item.estimatedCost.toFixed(2)}
        </Text>
        <Text style={styles.quoteItemSummary} numberOfLines={2}>
          {item.summary}
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
        <Text style={styles.headerTitle}>Quotes</Text>
      </View>

      <FlatList
        data={quoteItems}
        renderItem={renderQuoteItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No quotes found.</Text>
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
  quoteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quoteItemContent: {
    flex: 1,
  },
  quoteItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quoteItemDetails: {
    fontSize: 14,
    color: '#666',
  },
  quoteItemSummary: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyListText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});