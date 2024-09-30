import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';

interface Part {
  name: string;
  cost: string;
  source: string;
  image: string;
}

interface ResponseData {
  title: string;
  description: string;
  estimatedTotal: string;
  parts: Part[];
}

export default function BuildRepairChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [response, setResponse] = useState<ResponseData | null>(null);
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({
    headerShown: false,
    });
}, [navigation]);

  useEffect(() => {
    // TODO: Fetch AI response using the build ID
    // For now, use dummy data
    const dummyResponse: ResponseData = {
      title: "Engine Rep1 DIY List",
      description: "Replace front brake pads and rotors. Inspect and clean brake calipers...",
      estimatedTotal: "$500.00",
      parts: [
        {
          name: "Oil Filter",
          cost: "$15.00",
          source: "Source",
          image: "https://www.pgfilters.com/wp-content/uploads/2023/02/What-is-the-Oil-Filters-Primary-Job_-1000x675-1.jpg"
        },
        {
          name: "Synthetic Motor Oil",
          cost: "$25.00",
          source: "Source",
          image: "https://media.istockphoto.com/id/153517859/photo/pouring-oil.jpg?s=612x612&w=0&k=20&c=bWda1gadsnp827XRm0ioim-7xKduBD-qxupriQcNOoQ="
        },
        {
          name: "Wrench Set",
          cost: "$40.00",
          source: "Source",
          image: "https://www.harborfreight.com/media/catalog/product/cache/9fc4a8332f9638515cd199dd0f9238da/3/3/33284_W3.jpg"
        }
      ]
    };
    setResponse(dummyResponse);
  }, [id]);

  if (!response) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading response...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/build-repair')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{response.title}</Text>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.descriptionContainer}>
          <View style={styles.descriptionContent}>
            <Text style={styles.descriptionTitle}>Repair Description</Text>
            <Text style={styles.descriptionText} numberOfLines={2}>{response.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.estimatedTotal}>Estimated total: {response.estimatedTotal}</Text>
        {response.parts.map((part, index) => (
          <View key={index} style={styles.partItem}>
            <Image source={{ uri: part.image }} style={styles.partImage} />
            <View style={styles.partInfo}>
              <Text style={styles.partName}>{part.name}</Text>
              <Text style={styles.partCost}>Estimated Cost: {part.cost}</Text>
              <Text style={styles.partSource}>{part.source}</Text>
            </View>
          </View>
        ))}
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
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  descriptionContent: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#666',
  },
  estimatedTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  partItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  partImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  partCost: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  partSource: {
    fontSize: 14,
    color: '#DE2020',
  },
});