import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  id: string;
  name: string;
  spec: string;
  year: string;
  mileage: string;
  modifications: string;
  maintenance: string;
  engine: string;
  image: string;
}

export default function ProfilesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const tempProfilePlaceholderImage = "https://images.unsplash.com/photo-1583732964634-2576820523d0?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const profilesCollection = collection(db, 'users', user.uid, 'profiles');
    try {
      const querySnapshot = await getDocs(profilesCollection);
      const fetchedProfiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ProfileData));
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfile = () => {
    router.push('/profile-setup' as any);
  };

  const handleEditProfile = (profileId: string) => {
    router.push({ pathname: '/profile-setup', params: { profileId } } as any);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.centerContent}>
          <Text>Loading profiles...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Your Car Profiles</Text>
      
      {profiles.length === 0 ? (
        <View style={styles.noProfilesContainer}>
          <Text style={styles.noProfilesText}>You haven't created any car profiles yet.</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
            <Text style={styles.addButtonText}>Create Your First Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        profiles.map((profile) => (
          <View key={profile.id} style={styles.card}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: tempProfilePlaceholderImage }} style={styles.profileImage} />
              <View>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileSpec}>Spec: {profile.spec}</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <InfoItem label="Year" value={profile.year} />
              <InfoItem label="Engine" value={profile.engine} />
              <InfoItem label="Mileage" value={profile.mileage} />
              <InfoItem label="Modifications" value={profile.modifications} />
              <InfoItem label="Maintenance" value={profile.maintenance} />
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => handleEditProfile(profile.id)}>
              <Text style={styles.editButtonText}>Edit Car Details</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      
      {profiles.length > 0 && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
          <Text style={styles.addButtonText}>Add Another Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  noProfilesContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  noProfilesText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSpec: {
    fontSize: 16,
    color: '#666',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#666',
  },
  editButton: {
    backgroundColor: '#ff0000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ff0000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    margin: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});