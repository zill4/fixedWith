import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { useNavigation, useRouter } from 'expo-router';
export default function NewScreen() {
  const [activeTab, setActiveTab] = useState('Diagnose');
  const [images, setImages] = useState<string[]>([]);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  const commonIssues = [
    'Check Engine Light',
    'Adding a Turbo',
    'Brake System Issue'
  ];

  const handleAddImage = () => {
    // Implement image picker logic here
    console.log('Add image');
  };

  const handleSubmit = () => {
    console.log('Submit');
    router.push('/chat/dummy-id' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        {/* <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}

        <Text style={styles.title}>What would you like to do?</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Diagnose' && styles.activeTab]}
            onPress={() => setActiveTab('Diagnose')}
          >
            <Text style={[styles.tabText, activeTab === 'Diagnose' && styles.activeTabText]}>Diagnose</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Mod' && styles.activeTab]}
            onPress={() => setActiveTab('Mod')}
          >
            <Text style={[styles.tabText, activeTab === 'Mod' && styles.activeTabText]}>Mod</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Common Issues</Text>
        {commonIssues.map((issue, index) => (
          <TouchableOpacity key={index} style={styles.issueItem}>
            <Text style={styles.issueText}>{issue}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Describe Your Problem</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Provide details about the issue or modification"
          placeholderTextColor="#999"
        />

        <Text style={styles.sectionTitle}>Add Images</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
            <Ionicons name="add" size={24} color="#DE2020" />
            <Text style={styles.addImageText}>Add</Text>
          </TouchableOpacity>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    confirmButton: {
        backgroundColor: '#DE2020',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    confirmButtonText: {
    color: 'white',     
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 10,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
  },
  issueItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 10,
  },
  issueText: {
    fontSize: 16,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DE2020',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  addImageText: {
    color: '#DE2020',
    marginTop: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
});