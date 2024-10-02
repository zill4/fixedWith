import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation, useFocusEffect } from 'expo-router';
import Header from '../../../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface Project {
  id: string;
  type: 'Repair' | 'Mod';
  problemDescription: string;
  createdAt: Date;
  image: string | null;
}


export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState<'Repair' | 'Mod'>('Repair');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const db = getFirestore();
    const projectsRef = collection(db, 'projects');
    const q = query(
      projectsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    try {
      const querySnapshot = await getDocs(q);
      const fetchedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Project));
      setAllProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
      return () => {
      };
    }, [fetchProjects])
  );


  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => project.type === activeTab);
  }, [allProjects, activeTab]);


  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/(main)/chat/${item.id}` as any)}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/50' }} 
        style={styles.chatItemImage} 
      />
      <View style={styles.chatItemContent}>
        <Text style={styles.chatItemTitle}>{item.problemDescription}</Text>
        <Text style={styles.chatItemTimestamp}>{item.createdAt.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Projects</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Repair' && styles.activeTab]}
          onPress={() => setActiveTab('Repair')}
        >
          <Text style={[styles.tabText, activeTab === 'Repair' && styles.activeTabText]}>Repairs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Mod' && styles.activeTab]}
          onPress={() => setActiveTab('Mod')}
        >
          <Text style={[styles.tabText, activeTab === 'Mod' && styles.activeTabText]}>Mods</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No {activeTab.toLowerCase()}s found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatItemContent: {
    flex: 1,
  },
  chatItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatItemTimestamp: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  expertItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expertImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  expertContent: {
    flex: 1,
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expertUsername: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});