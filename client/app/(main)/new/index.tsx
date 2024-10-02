import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { useNavigation, useRouter } from 'expo-router';
import ProfileCard from '@/components/cards/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function NewScreen() {
  const [activeTab, setActiveTab] = useState('Repair');
  const [problemDescription, setProblemDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [carProfiles, setCarProfiles] = useState<any[]>([]);
  const [selectedCarProfileId, setSelectedCarProfileId] = useState<string | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuth();

  let tempCarImage: string = 'https://images.unsplash.com/photo-1680552413523-874b87f75475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHw5fHx0b3lvdGElMjA4NnxlbnwxfHx8fDE3Mjc1ODc0MjV8MA&ixlib=rb-4.0.3&q=80&w=1080'
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchCarProfiles();
  }, [navigation]);

  const fetchCarProfiles = async () => {
    if (!user) return;

    const db = getFirestore();
     const profilesCollection = collection(db, 'users', user.uid, 'profiles');
    //const profilesCollection = doc(db, 'profiles', user.uid);
    console.log('profilesCollections', profilesCollection);
    try {
      const querySnapshot = await getDocs(profilesCollection);
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('profiles', profiles);
      setCarProfiles(profiles);
      if (profiles.length > 0) {
        setSelectedCarProfileId(profiles[0].id);
      }
    } catch (error) {
      console.error('Error fetching car profiles:', error);
      Alert.alert('Error', 'Failed to load car profiles');
    }
  };


  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant camera roll permissions to add an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('Error', 'You must be logged in to create a project');
      Alert.alert('Error', 'You must be logged in to create a project');
      return;
    }

    if (!selectedCarProfileId) {
      console.error('Error', 'Please select a car profile');
      Alert.alert('Error', 'Please select a car profile');
      return;
    }


    if (!problemDescription) {
      console.error('Error', 'Please provide a problem description');
      Alert.alert('Error', 'Please provide a problem description');
      return;
    }

    const db = getFirestore();
    const projectsCollection = collection(db, 'projects');

    try {
      const newProject = {
        userId: user.uid,
        type: activeTab,
        problemDescription,
        image: image || null,
        imageDescription,
        carProfileId: selectedCarProfileId,
        createdAt: new Date(),
      };
      console.log('newProject', newProject);
      const docRef = await addDoc(projectsCollection, newProject);
      console.log('Project created with ID: ', docRef.id);
      Alert.alert('Success', 'Your project has been created');
      router.push('/chat/' + docRef.id as any);
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project');
    }
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
            style={[styles.tab, activeTab === 'Repair' && styles.activeTab]}
            onPress={() => setActiveTab('Repair')}
          >
            <Text style={[styles.tabText, activeTab === 'Repair' && styles.activeTabText]}>Repair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Mod' && styles.activeTab]}
            onPress={() => setActiveTab('Mod')}
          >
            <Text style={[styles.tabText, activeTab === 'Mod' && styles.activeTabText]}>Mod</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.sectionTitle}>
            Select your car profile
          </Text>
          {carProfiles.map((profile) => (
            <ProfileCard 
              key={profile.id}
              image={profile.image || tempCarImage} 
              title={`${profile.name} (${profile.year})`} 
              func={() => setSelectedCarProfileId(profile.id)}
              isSelected={selectedCarProfileId === profile.id as string}
            />
          ))}       
          <TouchableOpacity onPress={() => router.push('/(profile)/profile-setup')}>
            <Text style={styles.addProfileText}>+ Add new car profile</Text>
          </TouchableOpacity> 
          </View>
{/* 
        <Text style={styles.sectionTitle}>Common Issues</Text>
        {commonIssues.map((issue, index) => (
          <TouchableOpacity key={index} style={styles.issueItem}>
            <Text style={styles.issueText}>{issue}</Text>
          </TouchableOpacity>
        ))} */}

        <Text style={styles.sectionTitle}>Describe Your Problem</Text>
        <TextInput
          value={problemDescription}
          onChangeText={setProblemDescription}
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
          {image && (
            <Image key={0} source={{ uri: image }} style={styles.image} />
          )}
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
        marginLeft: 10,
        marginRight: 10,
    },
    confirmButtonText: {
    color: 'white',     
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DE2020',
    overflow: 'hidden',
  },
  addProfileText: {
    color: '#DE2020',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
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
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
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