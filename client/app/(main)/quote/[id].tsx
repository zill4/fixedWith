import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface QuoteData {
  createdAt: Timestamp;
  estimatedCost: number;
  projectId: string;
  summary: string;
  type: string;
  userId: string;
}

export default function QuoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchQuoteData();
  }, [id, user]); // Add dependencies here

  const fetchQuoteData = async () => {
    if (!user || !id) {
      setIsLoading(false);
      return;
    }

    const db = getFirestore();
    const quoteRef = doc(db, 'quotes', id);

    try {
      const quoteSnap = await getDoc(quoteRef);
      if (quoteSnap.exists()) {
        const data = quoteSnap.data() as QuoteData;
        setQuoteData(data);
      } else {
        console.log("No such quote!");
      }
    } catch (error) {
      console.error('Error fetching quote data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DE2020" />
      </View>
    );
  }

  if (!quoteData) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.errorText}>Failed to load quote data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Shop Quote</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote Summary</Text>
          <Text style={styles.description}>{quoteData.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Cost</Text>
          <Text style={styles.costAmount}>${quoteData.estimatedCost.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote Details</Text>
          <Text style={styles.detailText}>Type: {quoteData.type}</Text>
          <Text style={styles.detailText}>Created: {quoteData.createdAt.toDate().toLocaleString()}</Text>
          <Text style={styles.detailText}>Project ID: {quoteData.projectId}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share Quote</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  costAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DE2020',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#DE2020',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});