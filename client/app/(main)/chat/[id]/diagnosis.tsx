import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../components/Header';

interface Part {
  name: string;
  cost: number;
  quantity: number;
  image: string;
}

export default function ChatQuoteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Quotes');

  const parts: Part[] = [
    { name: 'Engine Cap', cost: 450.00, quantity: 1, image: 'https://media.istockphoto.com/id/1251594669/photo/servicing-a-car-with-oil-change.jpg?s=612x612&w=0&k=20&c=78YUg0yu1Sr2RWv8rQVZcRsp76giy0JWvSsjQfmkzNQ=' },
    { name: 'Socket Wrench', cost: 50.00, quantity: 1, image: 'https://m.media-amazon.com/images/I/41UzJM7XA+L._AC_.jpg' },
    { name: 'Spark Plugs', cost: 200.00, quantity: 1, image: 'https://lawrencevilleautocenter.com/wp-content/uploads/AdobeStock_286942688.jpeg' },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSaveQuote = () => {
    if (activeTab === 'Quotes') {
      router.push(`/quote/${id}` as any);
    } else {
      router.push(`/build-repair/${id}` as any);
    }
  };


  const renderQuotesTab = () => (
    <View style={styles.quoteContainer}>
      <Text style={styles.quoteTitle}>Repair Quote</Text>
      <Text style={styles.estimatedCost}>Estimated Cost</Text>
      <Text style={styles.costAmount}>$450.00</Text>
      <Text style={styles.sectionTitle}>Parts Needed</Text>
      <Text style={styles.listItem}>• Brake Pads</Text>
      <Text style={styles.listItem}>• Oil Filter</Text>
      <Text style={styles.listItem}>• Spark Plugs</Text>
      <Text style={styles.sectionTitle}>Tools Needed</Text>
      <Text style={styles.listItem}>• Wrench Set</Text>
      <Text style={styles.listItem}>• Jack</Text>
      <Text style={styles.listItem}>• Screwdriver Set</Text>
      <Text style={styles.sectionTitle}>Labor</Text>
      <Text style={styles.laborText}>5hrs x $20.00hr + tax + fees + upcharge</Text>
    </View>
  );

  const renderPartsTab = () => (
    <View>
      {parts.map((part: Part, index: number) => (
        <View key={index} style={styles.partItem}>
          <Image source={{ uri: part.image as string }} style={styles.partImage} />
          <View style={styles.partInfo}>
            <Text style={styles.partName}>{part.name}</Text>
            <Text style={styles.partCost}>Estimated Cost: ${part.cost.toFixed(2)}</Text>
            <Text style={styles.partQuantity}>Quantity: {part.quantity}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.totalCost}>Estimated total: ${parts.reduce((sum, part) => sum + part.cost, 0).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Diagnosis</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Quotes' && styles.activeTab]}
            onPress={() => setActiveTab('Quotes')}
          >
            <Text style={[styles.tabText, activeTab === 'Quotes' && styles.activeTabText]}>Quotes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Parts' && styles.activeTab]}
            onPress={() => setActiveTab('Parts')}
          >
            <Text style={[styles.tabText, activeTab === 'Parts' && styles.activeTabText]}>Parts</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          {activeTab === 'Quotes' ? renderQuotesTab() : renderPartsTab()}
        </ScrollView>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveQuote}>
          <Text style={styles.saveButtonText}>
            {activeTab === 'Quotes' ? 'Save Quote' : 'Save Part List'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DE2020',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#DE2020',
  },
  tabText: {
    color: '#DE2020',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  quoteContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  estimatedCost: {
    fontSize: 16,
    color: '#666',
  },
  costAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DE2020',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  laborText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#DE2020',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  partItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  partImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  partCost: {
    fontSize: 16,
    color: '#666',
  },
  partQuantity: {
    fontSize: 14,
    color: '#888',
  },
  totalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
  },
});