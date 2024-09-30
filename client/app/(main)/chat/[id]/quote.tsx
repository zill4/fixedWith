import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../components/Header';

export default function ChatQuoteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Quotes');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
        </ScrollView>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Quote</Text>
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
});