import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface ResponseData {
  Text: string;
  Parts_Estimate: string;
  Mechanic_Estimate: string;
  Parts: Array<{
    name: string;
    cost: string;
    source: string;
  }>;
  recommended_action: string;
}

export default function BuildRepairChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [response, setResponse] = useState<ResponseData | null>(null);

  useEffect(() => {
    // TODO: Fetch AI response using the build ID
    // For now, use dummy data
    const dummyResponse: ResponseData = {
      Text:
        'It looks like you have a bumper scrape. The recommended course of action is to get it buffed out at a detail shop or on your own.',
      Parts_Estimate: '$1,000',
      Mechanic_Estimate: '$1,200',
      Parts: [
        {
          name: 'raven_black',
          cost: '$100',
          source: 'somewebsite.com',
        },
        {
          name: 'buffer_tool',
          cost: '$800',
          source: 'somewebsite.com',
        },
      ],
      recommended_action: 'Go to a detail shop if you don’t have the skill or tools.',
    };
    setResponse(dummyResponse);
  }, [id]);

  const handleExportEstimate = () => {
    // TODO: Implement PDF generation
  };

  const handleViewPrompt = () => {
    // TODO: Show the original build/repair prompt
  };

  if (!response) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading response...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="View Prompt" onPress={handleViewPrompt} />
      <ScrollView style={styles.chatContainer}>
        <Text style={styles.responseText}>{response.Text}</Text>
        <Text>Parts Estimate: {response.Parts_Estimate}</Text>
        <Text>Mechanic Estimate: {response.Mechanic_Estimate}</Text>
        <Text>Recommended Action: {response.recommended_action}</Text>
        <Text style={styles.partsTitle}>Parts:</Text>
        {response.Parts.map((part, index) => (
          <View key={index} style={styles.partItem}>
            <Text>Name: {part.name}</Text>
            <Text>Cost: {part.cost}</Text>
            <Text>Source: {part.source}</Text>
          </View>
        ))}
      </ScrollView>
      <Button title="Export Estimate" onPress={handleExportEstimate} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  chatContainer: {
    flex: 1,
    marginVertical: 16,
  },
  responseText: {
    fontSize: 16,
    marginBottom: 12,
  },
  partsTitle: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  partItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
});