import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Header = () => (
  <View style={styles.header}>
    <Ionicons name="car-sport" size={24} color="#DE2020" />
    <Text style={styles.headerText}>AutoSnap</Text>
  </View>
);
let tempImage: string = 'https://images.unsplash.com/photo-1680552413523-874b87f75475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHw5fHx0b3lvdGElMjA4NnxlbnwxfHx8fDE3Mjc1ODc0MjV8MA&ixlib=rb-4.0.3&q=80&w=1080'

const CarProfile = () => (
  <View style={styles.carProfile}>
    <Image
      source={{ uri: tempImage }}
      style={styles.carImage}
    />
    <Text style={styles.carText}>Your Toyota 86</Text>
  </View>
);

const DiagnosisItem = ({ icon, label }: { icon: any, label: any }) => (
  <View style={styles.diagnosisItem}>
    <View style={styles.diagnosisIconContainer}>
      <Ionicons name={icon} size={24} color="#000" />
    </View>
    <Text style={styles.diagnosisLabel}>{label}</Text>
  </View>
);

const CarDiagnosis = () => (
  <View style={styles.diagnosisContainer}>
    <Text style={styles.sectionTitle}>Car Diagnosis</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diagnosisScroll}>
      <DiagnosisItem icon="add-circle-outline" label="New" />
      <DiagnosisItem icon="alert-circle-outline" label="Flat tire" />
      <DiagnosisItem icon="cog-outline" label="Suspension" />
      <DiagnosisItem icon="disc-outline" label="Brake" />
      <DiagnosisItem icon="construct-outline" label="Engine" />
    </ScrollView>
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Enter car issue here"
        placeholderTextColor="#888"
      />
    </View>
  </View>
);

const PopularMod = ( { image, title, description }: { image: any, title: any, description: any }) => (
  <View style={styles.popularMod}>
    <Image source={image} style={styles.modImage} />
    <View style={styles.modInfo}>
      <Text style={styles.modTitle}>{title}</Text>
      <Text style={styles.modDescription}>{description}</Text>
    </View>
  </View>
);

const PopularCarMods = () => (
  <View style={styles.popularModsContainer}>
    <Text style={styles.sectionTitle}>Popular Car Mods</Text>
    <PopularMod
      image={{uri: tempImage}}
      title="Exhaust System Upgrade"
      description="Enhance your car's performance with a new exhaust system."
    />
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Enter your custom mod idea here..."
        placeholderTextColor="#888"
      />
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        <CarProfile />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#DE2020',
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
  diagnosisItem: {
    alignItems: 'center',
    marginRight: 16,
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
  diagnosisLabel: {
    textAlign: 'center',
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