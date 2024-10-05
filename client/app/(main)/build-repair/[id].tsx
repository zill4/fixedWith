import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface BuildRepairData {
  createdAt: Timestamp;
  difficulty: string;
  estimatedCost: number;
  expectedTime: string;
  parts: string[];
  tools: string[];
  projectId: string;
  type: string;
  userId: string;
}

export default function BuildRepairChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [buildRepairData, setBuildRepairData] = useState<BuildRepairData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchBuildRepairData();
  }, [id, user]);

  const fetchBuildRepairData = async () => {
    if (!user || !id) {
      setIsLoading(false);
      return;
    }

    const db = getFirestore();
    const buildRepairRef = doc(db, 'build_repairs', id);

    try {
      const buildRepairSnap = await getDoc(buildRepairRef);
      if (buildRepairSnap.exists()) {
        const data = buildRepairSnap.data() as BuildRepairData;
        setBuildRepairData(data);
      } else {
        console.log("No such build/repair document!");
      }
    } catch (error) {
      console.error('Error fetching build/repair data:', error);
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

  if (!buildRepairData) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.errorText}>Failed to load build/repair data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{buildRepairData.type.charAt(0).toUpperCase() + buildRepairData.type.slice(1)} Plan</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detailText}>Difficulty: {buildRepairData.difficulty}</Text>
          <Text style={styles.detailText}>Estimated Time: {buildRepairData.expectedTime}</Text>
          <Text style={styles.detailText}>Estimated Cost: ${buildRepairData.estimatedCost.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parts Needed</Text>
          {buildRepairData.parts.map((part, index) => (
            <Text key={index} style={styles.listItem}>• {part}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools Needed</Text>
          {buildRepairData.tools.map((tool, index) => (
            <Text key={index} style={styles.listItem}>• {tool}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.detailText}>Created: {buildRepairData.createdAt.toDate().toLocaleString()}</Text>
          <Text style={styles.detailText}>Project ID: {buildRepairData.projectId}</Text>
        </View>
      </ScrollView>
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
  detailText: {
    color: '#666',
  },
  listItem: {
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});