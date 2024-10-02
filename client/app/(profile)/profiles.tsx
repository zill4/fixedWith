import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';

export default function ProfilesScreen() {
  const router = useRouter();

  let tempCarImage: string = 'https://images.unsplash.com/photo-1680552413523-874b87f75475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHw5fHx0b3lvdGElMjA4NnxlbnwxfHx8fDE3Mjc1ODc0MjV8MA&ixlib=rb-4.0.3&q=80&w=1080'
  // TODO: Replace with actual profile data
  const profile = {
    name: 'Toyota 86',
    spec: 'TRD SE',
    year: '2019',
    mileage: '50,000 miles',
    modifications: 'None',
    maintenance: 'Regular',
    engine: 'V6',
    image: tempCarImage, // Replace with actual image URL
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    router.push('/profile-setup' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Header />

      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: profile.image }} style={styles.profileImage} />
          <View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileSpec}>Spec: {profile.spec}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoItem label="Year" value={profile.year} />
          <InfoItem label="Engine" value={profile.engine} />
          <InfoItem label="Mileage" value={profile.mileage} />
          <InfoItem label="Horsepower" value="Upgrade plans" />
          <InfoItem label="Modifications" value={profile.modifications} />
          <InfoItem label="Tune-up" value={profile.maintenance} />
        </View>

        <Text style={styles.sectionTitle}>Diagnosese</Text>
        <View style={styles.grid}>
          <GridItem label="Engine" value="No" />
          <GridItem label="Transmi" value="ssion" />
          <GridItem label="Service" value="Tires" />
          <GridItem label="Pad" value="s" />
          <GridItem label="Suspensi" value="Pressur" />
          <GridItem label="Exhaust" value="" />
          <GridItem label="Alignmen" value="Brakes" />
          <GridItem label="Minor" value="" />
        </View>

        <Text style={styles.sectionTitle}>Mods</Text>
        <View style={styles.grid}>
          <GridItem label="Engine" value="No" />
          <GridItem label="Transmi" value="ssion" />
          <GridItem label="Service" value="Tires" />
          <GridItem label="Pad" value="s" />
          <GridItem label="Suspensi" value="Pressur" />
          <GridItem label="Exhaust" value="" />
          <GridItem label="Alignmen" value="Brakes" />
          <GridItem label="Minor" value="" />
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Car Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const GridItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.gridItem}>
    <Text style={styles.gridLabel}>{label}</Text>
    <Text style={styles.gridValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '25%',
    marginBottom: 8,
  },
  gridLabel: {
    fontWeight: 'bold',
  },
  gridValue: {
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
});