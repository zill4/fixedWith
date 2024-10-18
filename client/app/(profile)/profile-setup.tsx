import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  make: string;
  model: string;
  year: string;
  trim: string;
}

export default function ProfileSetupScreen() {
  const [profile, setProfile] = useState<ProfileData>({
    make: '',
    model: '',
    year: '',
    trim: '',
  });
  const router = useRouter();
  const { user } = useAuth();
  const { profileId } = useLocalSearchParams<{ profileId: string }>();

  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    }
  }, [profileId]);

  const fetchProfileData = async () => {
    if (!user || !profileId) return;
    
    const db = getFirestore();
    const profileRef = doc(db, 'users', user.uid, 'profiles', profileId);
    
    try {
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data() as ProfileData;
        setProfile(data);
        // console.log('Profile data:', data);
      }
    } catch (error) {
      console.log('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save a profile');
      return;
    }

    if (!profile.make || !profile.model || !profile.year || !profile.trim) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const db = getFirestore();
    const profilesCollectionRef = collection(db, 'users', user.uid, 'profiles');

    try {
      if (profileId) {
        const profileDocRef = doc(profilesCollectionRef, profileId);
        await updateDoc(profileDocRef, profile as any);
      } else {
        const newProfileRef = await addDoc(profilesCollectionRef, {
          ...profile,
          createdAt: new Date(),
        });
        // console.log('Car profile created with ID: ', newProfileRef.id);
      }

      Alert.alert('Success', `Car profile ${profileId ? 'updated' : 'saved'} successfully`);
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

      <Text style={styles.title}>{profileId ? 'Edit' : 'Enter'} your car information:</Text>

      <TextInput
        placeholder="Make"
        value={profile.make}
        onChangeText={(text) => setProfile({ ...profile, make: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Model"
        value={profile.model}
        onChangeText={(text) => setProfile({ ...profile, model: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Year"
        value={profile.year}
        onChangeText={(text) => setProfile({ ...profile, year: text })}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Trim"
        value={profile.trim}
        onChangeText={(text) => setProfile({ ...profile, trim: text })}
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>{profileId ? 'Update' : 'Save'} Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
  backButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});