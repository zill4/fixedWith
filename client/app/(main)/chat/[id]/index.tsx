import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import Header from '../../../../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, getFirestore, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

interface Message {
  text: string;
  createdAt: Date;
  userId: string;
  id: string;
}

interface Project {
  id: string;
  type: 'Repair' | 'Mod';
  problemDescription: string;
  createdAt: Date;
  image: string | null;
  messages: Message[];
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchProject = useCallback(async () => {
    if (!user || !id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const db = getFirestore();
    const projectRef = doc(db, 'projects', id as string);
    try {
      const docSnap = await getDoc(projectRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Project, 'id'>;
        const projectData = {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt,
          messages: data.messages ? data.messages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt
          })) : []
        };
        setProject(projectData);
        
        // Set the initial message as the problem description
        if (projectData.messages.length === 0) {
          setMessages([{
            id: '0',
            text: projectData.problemDescription,
            userId: user.uid,
            createdAt: projectData.createdAt
          }]);
        } else {
          setMessages(projectData.messages);
        }
      } else {
        console.log("No such project!");
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchProject();
  }, [navigation, fetchProject]);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Project not found</Text>
      </View>
    );
  }

  const handleSend = async () => {
    if (newMessage.trim() && user) {
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        userId: user.uid,
        createdAt: new Date()
      };
      setMessages(prevMessages => [...prevMessages, newMsg]);
      setNewMessage('');

      // Update Firestore
      const db = getFirestore();
      const projectRef = doc(db, 'projects', id as string);
      try {
        await updateDoc(projectRef, {
          messages: arrayUnion({
            ...newMsg,
            createdAt: Timestamp.fromDate(newMsg.createdAt)
          })
        });
      } catch (error) {
        console.error('Error updating messages in Firestore:', error);
      }
    }
  };

  const handleViewQuote = () => {
    router.push(`/chat/${id}/diagnosis` as any);
  };

  const mechanicImageTemp: string = 'https://images.unsplash.com/photo-1552656967-7a0991a13906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHwxfHxlbmdpbmV8ZW58MXx8fHwxNzI3NTkwNjkzfDA&ixlib=rb-4.0.3&q=80&w=1080'

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(main)/chat')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{uri: mechanicImageTemp}} style={styles.avatar} />
          <Text style={styles.headerTitle}>{project.type} Issue</Text>
        </View>
        <TouchableOpacity style={styles.quoteButton} onPress={handleViewQuote}>
          <Text style={styles.quoteButtonText}>View Quote</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.userId === user?.uid ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a new message"
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={24} color="#DE2020" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quoteButton: {
    backgroundColor: '#DE2020',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quoteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E1FFC7',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
});