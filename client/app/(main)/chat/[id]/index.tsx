import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import Header from '../../../../components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, getFirestore, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { sendToClaude } from '@/components/SendToClaude';
import { ClaudeMessage } from '@/components/SendToClaude';

interface CarProfile {
  id: string;
  make: string;
  model: string;
  year: number;
  // Add other relevant fields
}

interface Project {
  id: string;
  carProfileId: string;
  createdAt: Date;
  image: string | null;
  imageDescription: string;
  problemDescription: string;
  type: 'Repair' | 'Mod';
  userId: string;
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [carProfile, setCarProfile] = useState<CarProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const mechanicImageTemp = "https://images.unsplash.com/photo-1680552413523-874b87f75475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHw5fHx0b3lvdGElMjA4NnxlbnwxfHx8fDE3Mjc1ODc0MjV8MA&ixlib=rb-4.0.3&q=80&w=1080"

  const fetchProjectAndCarProfile = useCallback(async () => {
    if (!user || !id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const db = getFirestore();
    const projectRef = doc(db, 'projects', id as string);
    let carProfileData = null;

    try {
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const projectData = projectSnap.data() as Omit<Project, 'id'>;
        const formattedProject: Project = {
          id: projectSnap.id,
          ...projectData,
          createdAt: projectData.createdAt,
          messages: projectData.messages ? projectData.messages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt
          })) : []
        };
        setProject(formattedProject);
        setMessages(formattedProject.messages);

        // Fetch the associated car profile
        const carProfileRef = doc(db, 'users', user.uid, 'profiles', formattedProject.carProfileId);
        const carProfileSnap = await getDoc(carProfileRef);
        if (carProfileSnap.exists()) {
          carProfileData = carProfileSnap.data() as Omit<CarProfile, 'id'>;
          setCarProfile({ id: carProfileSnap.id, ...carProfileData });
        } else {
          console.log("No such car profile!");
        }

        // Check if we need to make the initial Claude request
        if (formattedProject.messages.length === 0 && carProfileData !== null) {
          await handleInitialClaudeRequest(formattedProject, carProfileData as CarProfile);
        }
      } else {
        console.log("No such project!");
      }
    } catch (error) {
      console.error('Error fetching project and car profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, id]);

  const handleInitialClaudeRequest = async (project: Project, carProfile: CarProfile) => {
    const initialMessage = `Vehicle Info: ${JSON.stringify(carProfile)}\nProblem: ${project.problemDescription}`;
    const claudeResponse = await sendToClaude({ ...project, carProfile }, initialMessage, []);
    if (claudeResponse) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: claudeResponse.textResponse,
        userId: 'ai',
        createdAt: new Date()
      };
      setMessages([aiMessage]);
      await updateFirestoreMessages([aiMessage]);
    }
  };

  const updateFirestoreMessages = async (newMessages: Message[]) => {
    if (!project) return;

    const db = getFirestore();
    const projectRef = doc(db, 'projects', project.id);
    await updateDoc(projectRef, {
      messages: newMessages.map(msg => ({
        ...msg,
        createdAt: Timestamp.fromDate(msg.createdAt)
      }))
    });
  };

  const handleSend = async () => {
    if (newMessage.trim() && user && project) {
      const userMsg: Message = {
        id: Date.now().toString(),
        text: newMessage,
        userId: user.uid,
        createdAt: new Date()
      };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setNewMessage('');

      await updateFirestoreMessages(updatedMessages);

      const messageHistory: ClaudeMessage[] = updatedMessages.map(msg => ({
        role: msg.userId === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));

      const claudeResponse = await sendToClaude(project, newMessage, messageHistory);
      if (claudeResponse) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: claudeResponse.textResponse,
          userId: 'ai',
          createdAt: new Date()
        };
        const finalMessages = [...updatedMessages, aiMsg];
        setMessages(finalMessages);
        
        await updateFirestoreMessages(finalMessages);
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    fetchProjectAndCarProfile();
  }, [navigation, fetchProjectAndCarProfile]);
  
    const handleViewQuote = () => {
      router.push(`/chat/${id}/diagnosis` as any);
    };
  
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    
    if (!project || !carProfile) {
      return (
        <View style={styles.container}>
          <Text>Project or Car Profile not found</Text>
        </View>
      );
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(main)/chat')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Image source={{uri: project.image || mechanicImageTemp}} style={styles.avatar} />
            <Text style={styles.headerTitle}>{project.type} Issue - {carProfile.make} {carProfile.model}</Text>
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
    </SafeAreaView> );
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
  }
});