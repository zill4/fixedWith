import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../components/Header';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectData {
  type: 'Repair' | 'Mod';
  estimate: {
    expectedRepairTime: string;
    averageRepairPrice: number;
    toolsAndMaterials: string[];
    averageShopPrice: number;
    repairDifficulty: string;
    summary: string;
  };
  parts_tools: {
    parts: string[];
    tools: string[];
  };
  instructions: {
    steps: string[];
  };
}

export default function ChatQuoteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Quotes');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchProjectData();
  }, [navigation]);

  const fetchProjectData = async () => {
    if (!user || !id) return;

    const db = getFirestore();
    const projectRef = doc(db, 'projects', id as string);

    try {
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const data = projectSnap.data() as ProjectData;
        setProjectData(data);
      } else {
        console.log("No such project!");
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuote = () => {
    if (activeTab === 'Quotes') {
      router.push(`/quote/${id}` as any);
    } else {
      router.push(`/build-repair/${id}` as any);
    }
  };

  const renderQuotesTab = () => {
    if (!projectData) return null;
    const { estimate, type } = projectData;
    const actionType = type === 'Mod' ? 'Mod' : 'Repair';

    return (
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteTitle}>Shop Quote</Text>
        <Text style={styles.estimatedCost}>Estimated Shop Cost</Text>
        <Text style={styles.costAmount}>${estimate.averageShopPrice.toFixed(2)}</Text>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.listItem}>{estimate.summary}</Text>
      </View>
    );
  };

  const renderPartsTab = () => {
    if (!projectData) return null;
    const { estimate, parts_tools, type } = projectData;
    const actionType = type === 'Mod' ? 'Mod' : 'Repair';

    return (
      <View style={styles.partsContainer}>
        <Text style={styles.partsTitle}>DIY {actionType} Details</Text>
        <Text style={styles.estimatedCost}>Estimated {actionType} Cost</Text>
        <Text style={styles.costAmount}>${estimate.averageRepairPrice.toFixed(2)}</Text>
        
        <Text style={styles.sectionTitle}>Expected {actionType} Time</Text>
        <Text style={styles.listItem}>{estimate.expectedRepairTime}</Text>
        
        <Text style={styles.sectionTitle}>{actionType} Difficulty</Text>
        <Text style={styles.listItem}>{estimate.repairDifficulty}</Text>
        
        <Text style={styles.sectionTitle}>Parts Needed</Text>
        {parts_tools.parts.map((part, index) => (
          <View key={index} style={styles.partItem}>
            <Text style={styles.partName}>{part}</Text>
            <Text style={styles.partCost}>Cost: To be determined</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Tools Needed</Text>
        {parts_tools.tools.map((tool, index) => (
          <Text key={index} style={styles.listItem}>• {tool}</Text>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DE2020" />
      </View>
    );
  }

  const actionType = projectData?.type === 'Mod' ? 'Mod' : 'Repair';

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
            <Text style={[styles.tabText, activeTab === 'Quotes' && styles.activeTabText]}>Shop Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Parts' && styles.activeTab]}
            onPress={() => setActiveTab('Parts')}
          >
            <Text style={[styles.tabText, activeTab === 'Parts' && styles.activeTabText]}>DIY {actionType}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          {activeTab === 'Quotes' ? renderQuotesTab() : renderPartsTab()}
        </ScrollView>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveQuote}>
          <Text style={styles.saveButtonText}>
            {activeTab === 'Quotes' ? 'Save Shop Quote' : `Save DIY ${actionType}`}
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
  partImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  partInfo: {
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  partsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  partItem: {
    marginBottom: 10,
  },
  partName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  partCost: {
    fontSize: 14,
    color: '#666',
  },
});