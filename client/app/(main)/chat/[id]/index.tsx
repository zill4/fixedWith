import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import Header from '../../../../components/Header';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Our analysis indicates a faulty spark plug.', isUser: false },
    { id: '2', text: 'When can you bring', isUser: true },
    { id: '3', text: 'Our analysis indicates a faulty spark plug.', isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: newMessage, isUser: true }]);
      setNewMessage('');
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
          <Text style={styles.headerTitle}>Engine Issue</Text>
        </View>
        <TouchableOpacity style={styles.quoteButton} onPress={handleViewQuote}>
          <Text style={styles.quoteButtonText}>View Quote</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.isUser ? styles.userMessage : styles.botMessage]}>
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