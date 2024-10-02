import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSetupScreen() {
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [year, setYear] = React.useState('');
  const [trim, setTrim] = React.useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleContinue = () => {
    // TODO: Save car information
    router.replace('/(main)/home');
    // TODO: Fix car go back
    // router.back();
  };

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save a profile');
      return;
    }
  
    const db = getFirestore();
    const profilesCollection = collection(db, 'users', user.uid, 'profiles');
  
    try {
      const newProfile = {
        name: make + ' ' + model,
        spec: trim,
        year,
        mileage: '0 miles',
        modifications: 'None',
        maintenance: 'Regular',
        engine: 'Not specified',
        image: 'https://example.com/default-car-image.jpg',
        createdAt: new Date(),
      };
  
      const docRef = await addDoc(profilesCollection, newProfile);
      console.log('Car profile created with ID: ', docRef.id);
  
      Alert.alert('Success', 'Car profile saved successfully');
      router.replace('/(main)/home');
    } catch (error) {
      console.error('Error saving car profile:', error);
      Alert.alert('Error', 'Failed to save car profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car" size={24} color="#DE2020" />
        <Text style={styles.headerText}>FixedWith</Text>
      </View>

      <Text style={styles.title}>Enter your car information:</Text>

      <TextInput
        placeholder="Make"
        value={make}
        onChangeText={setMake}
        style={styles.input}
      />
      <TextInput
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        style={styles.input}
      />
      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Trim"
        value={trim}
        onChangeText={setTrim}
        style={styles.input}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DE2020',
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  continueButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  skipButtonText: {
    color: '#888',
    fontSize: 16,
  },
});