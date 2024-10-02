import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import ProfileCard from '@/components/cards/ProfileCard';
import CircularIconButton from '@/components/buttons/CircularIconButton';
import MediaCard from '@/components/cards/MediaCard';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

let tempEngineImage: string =  'https://assets.api.uizard.io/api/cdn/stream/7294fa89-54fb-4ac9-914d-c5b44f98c77e.png'

const DiagnosisItem = ({ icon, label }: { icon: any, label: string }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({ 
      pathname: '/new', 
      params: { description: label, type: 'Repair' } 
    } as any);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.diagnosisItem}>
      <CircularIconButton icon={icon} onPress={handlePress} />
      <Text style={styles.diagnosisLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const CarDiagnosis = () => (
  <View style={styles.diagnosisContainer}>
    <Text style={styles.sectionTitle}>Car Diagnosis</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diagnosisScroll}>
      <DiagnosisItem icon="alert-circle-outline" label="Flat tire" />
      <DiagnosisItem icon="cog-outline" label="Suspension issue" />
      <DiagnosisItem icon="disc-outline" label="Brake problem" />
      <DiagnosisItem icon="construct-outline" label="Engine trouble" />
    </ScrollView>
  </View>
);

const PopularCarMods = () => {
  const router = useRouter();

  const handlePress = (title: string) => {
    router.push({ 
      pathname: '/new', 
      params: { description: title, type: 'Mod' } 
    } as any);
  };

  return (
    <View style={styles.popularModsContainer}>
      <Text style={styles.sectionTitle}>Popular Car Mods</Text>
      <MediaCard
        image={{uri: tempEngineImage}}
        title="Exhaust System Upgrade"
        description="Enhance your car's performance with a new exhaust system."
        onPress={() => handlePress("Exhaust System Upgrade")}
      />
    </View>
  )
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileCount, setProfileCount] = useState(0);

  useEffect(() => {
    const fetchProfileCount = async () => {
      if (!user) return;

      const db = getFirestore();
      const profilesRef = collection(db, 'users', user.uid, 'profiles');
      const q = query(profilesRef);

      try {
        const querySnapshot = await getDocs(q);
        setProfileCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching profile count:', error);
      }
    };

    fetchProfileCount();
  }, [user]);

  const handleProfilePress = () => {
    router.push('/(profile)/profiles');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        <ProfileCard 
          image={tempEngineImage}
          title={profileCount > 0 ? `View Car Profiles: ${profileCount}` : "Create a car profile"}
          func={handleProfilePress}
          isSelected={false}
        />
        <CarDiagnosis />
        <PopularCarMods />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  diagnosisItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  diagnosisLabel: {
    textAlign: 'center',
    marginTop: 8,
  },
  carProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  carText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  diagnosisContainer: {
    padding: 16,
  },
  diagnosisScroll: {
    marginBottom: 16,
  },

  diagnosisIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  popularModsContainer: {
    padding: 16,
  },
  popularMod: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  modImage: {
    width: 100,
    height: 100,
  },
  modInfo: {
    flex: 1,
    padding: 12,
  },
  modTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modDescription: {
    fontSize: 14,
    color: '#666',
  },
});