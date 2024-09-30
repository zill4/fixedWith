import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
interface Part {
  name: string;
  cost: number;
}

interface Labor {
  name: string;
  cost: number;
}

interface QuoteData {
  title: string;
  description: string;
  parts: Part[];
  labor: Labor[];
}

export default function QuoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  // Mock data - replace with actual data fetching logic
  const quoteData: QuoteData = {
    title: "Engine Rep1 Quote",
    description: "Replace front brake pads and rotors. Inspect and clean brake calipers.",
    parts: [
      { name: "Brake Pads (Front)", cost: 50.00 },
      { name: "Brake Rotors (Front)", cost: 120.00 },
      { name: "Brake Cleaner", cost: 10.00 },
    ],
    labor: [
      { name: "Labor Cost", cost: 80.00 },
      { name: "Markup", cost: 30.00 },
    ],
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const totalCost = [...quoteData.parts, ...quoteData.labor].reduce((sum, item) => sum + item.cost, 0);

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/quote')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{quoteData.title}</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repair Description</Text>
          <Text style={styles.description}>{quoteData.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parts & Estimated Costs</Text>
          {quoteData.parts.map((part, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{part.name}</Text>
              <Text style={styles.itemCost}>${part.cost.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labor & Markup</Text>
          {quoteData.labor.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCost}>${item.cost.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.totalCost}>Total: ${totalCost.toFixed(2)}</Text>
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
  },
  itemCost: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 16,
    marginBottom: 24,
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