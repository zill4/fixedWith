import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import Header from '../../../components/Header';
interface ChatItem {
  id: string;
  title: string;
  timestamp: string;
  image: string;
}

interface Expert {
  id: string;
  name: string;
  username: string;
  image: string;
}

const chatItems: ChatItem[] = [
  { id: '1', title: 'Engine upgrade build', timestamp: '9/29/24 1:28 am', image: 'https://images.unsplash.com/photo-1557411255-28ebcc0fdd54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '2', title: 'bodykit repair build', timestamp: '9/29/24 1:28 am', image: 'https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },

];

const experts: Expert[] = [
  { id: '1', name: 'Car Mechanic', username: '@simplecar.2', image: 'https://example.com/mechanic.jpg' },
  { id: '2', name: 'Car Specialist', username: '@autogun209', image: 'https://example.com/specialist.jpg' },
  { id: '3', name: 'Auto Technician', username: '@aepro_97', image: 'https://example.com/technician.jpg' },
  { id: '4', name: 'Car Diagnose', username: '@car_expert', image: 'https://example.com/diagnose.jpg' },
];

export default function BuildRepairScreen() {
    const [activeTab, setActiveTab] = useState('Repairs');
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    const handleOpenBuild = (id: string) => {
        router.push({
          pathname: '/build-repair/[id]',
          params: { id }
        });
      };
    
    useEffect(() => {
        navigation.setOptions({
        headerShown: false,
        });
    }, [navigation]);

    const renderChatItem = ({ item }: { item: ChatItem }) => (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleOpenBuild(item.id)}>
        <Image source={{ uri: item.image }} style={styles.chatItemImage} />
        <View style={styles.chatItemContent}>
          <Text style={styles.chatItemTitle}>{item.title}</Text>
          <Text style={styles.chatItemTimestamp}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  
    const renderExpert = ({ item }: { item: Expert }) => (
      <TouchableOpacity style={styles.expertItem}>
        <Image source={{ uri: item.image }} style={styles.expertImage} />
        <View style={styles.expertContent}>
          <Text style={styles.expertName}>{item.name}</Text>
          <Text style={styles.expertUsername}>{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Car Issue</Text>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
{/*   
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Repairs' && styles.activeTab]}
            onPress={() => setActiveTab('Repairs')}
          >
            <Text style={[styles.tabText, activeTab === 'Repairs' && styles.activeTabText]}>Repairs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Mods' && styles.activeTab]}
            onPress={() => setActiveTab('Mods')}
          >
            <Text style={[styles.tabText, activeTab === 'Mods' && styles.activeTabText]}>Mods</Text>
          </TouchableOpacity>
        </View> */}
  
        <FlatList
          data={chatItems}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Recent Chats</Text>
          }
        />
  
        {/* <FlatList
          data={experts}
          renderItem={renderExpert}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Experts</Text>
          }
        /> */}
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