import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../components/Header';
import { doc, getDoc, getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectData } from '@/types/projects';


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
        const data = new ProjectData(projectSnap.data());
        console.log('raw data:', data);
        setProjectData(data);
      } else {
        console.log("No such project!");
        Alert.alert('Error', 'Project not found');
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      Alert.alert('Error', 'Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuote = async () => {
    if (!user || !projectData || !id) {
      Alert.alert('Error', 'Unable to save. Please try again later.');
      return;
    }

    const db = getFirestore();
    const actionType = projectData.type === 'mod' ? 'Mod' : 'Repair';

    try {
      let savedDocId: string;

      if (activeTab === 'Quotes') {
        // Save shop quote
        const quoteData = {
          projectId: id,
          userId: user.uid,
          createdAt: serverTimestamp(),
          type: 'shop',
          estimatedCost: projectData.estimate.averageShopPrice,
          summary: `${actionType} - ${projectData.difficulty}`,
        };

        const quoteRef = await addDoc(collection(db, 'quotes'), quoteData);
        savedDocId = quoteRef.id;
        console.log('Shop quote saved with ID: ', savedDocId);
        Alert.alert('Success', 'Shop quote saved successfully!');
      } else {
        // Save DIY build/repair
        const buildRepairData = {
          projectId: id,
          userId: user.uid,
          createdAt: serverTimestamp(),
          type: projectData.type,
          estimatedCost: projectData.estimate.averageRepairPrice,
          expectedTime: projectData.expectedTime,
          difficulty: projectData.difficulty,
          parts: projectData.parts_tools.parts,
          tools: projectData.parts_tools.tools,
        };

        const buildRepairRef = await addDoc(collection(db, 'build_repairs'), buildRepairData);
        savedDocId = buildRepairRef.id;
        console.log('DIY build/repair saved with ID: ', savedDocId);
        Alert.alert('Success', `DIY ${actionType} plan saved successfully!`);
      }

      // Navigate to the appropriate screen with the saved document ID
      if (activeTab === 'Quotes') {
        router.push(`/quote/${savedDocId}` as any);
      } else {
        router.push(`/build-repair/${savedDocId}` as any);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  const renderQuotesTab = () => {
    if (!projectData) return null;
    const actionType = projectData.type === 'mod' ? 'Mod' : 'Repair';

    return (
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteTitle}>Shop Quote</Text>
        <Text style={styles.estimatedCost}>Estimated Shop Cost</Text>
        <Text style={styles.costAmount}>${projectData.estimate.averageShopPrice.toFixed(2)}</Text>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.listItem}>{projectData.estimate.summary}</Text>
      </View>
    );
  };

  const renderPartsTab = () => {
    if (!projectData) return null;
    console.log('projectData Data:', projectData);
    const actionType = projectData.type === 'mod' ? 'Mod' : 'Repair';
    let tools: string[] = [];
    let parts: string[] = [];
    if (projectData.parts_tools) {
      tools = Object.values(projectData.parts_tools.tools);
      parts = Object.values(projectData.parts_tools.parts);
    }
    return (
      <View style={styles.partsContainer}>
        <Text style={styles.partsTitle}>DIY {actionType} Details</Text>
        <Text style={styles.estimatedCost}>Estimated {actionType} Cost</Text>
        <Text style={styles.costAmount}>{projectData.estimate.averageRepairPrice <= 0 ? 'To be determined' : `$${projectData.estimate.averageRepairPrice.toFixed(2)}`}</Text>
        
        <Text style={styles.sectionTitle}>Expected {actionType} Time</Text>
        <Text style={styles.listItem}>{projectData.estimate.expectedRepairTime}</Text>
        
        <Text style={styles.sectionTitle}>{actionType} Difficulty</Text>
        <Text style={styles.listItem}>{projectData.estimate.repairDifficulty}</Text>
        
        <Text style={styles.sectionTitle}>Parts Needed</Text>
        {parts.map((part, index) => (
          <View key={index} style={styles.partItem}>
            <Text style={styles.partName}>{part}</Text>
            <Text style={styles.partCost}>Cost: To be determined</Text>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Tools Needed</Text>
        {tools.map((tool, index) => (
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

  if (!projectData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No project data available</Text>
      </View>
    );
  }

  const actionType = projectData.type === 'mod' ? 'Mod' : 'Repair';

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