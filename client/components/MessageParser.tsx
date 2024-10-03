import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface MessagePart {
  type: 'text' | 'json';
  content: string | object;
  title?: string;
}

interface MessageParserProps {
  message: string;
}

const MessageParser: React.FC<MessageParserProps> = ({ message }) => {
  const parseMessage = (message: string): MessagePart[] => {
    const parts: MessagePart[] = [];
    let lastIndex = 0;

    // Regular expression to match the pattern: Title:\n{\ncontent\n}\n
    const regex = /([^\n]+):\n\{\n([\s\S]*?)\n\}\n/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
      const index = match.index;

      // Add any plain text before the current match
      if (lastIndex < index) {
        parts.push({
          type: 'text',
          content: message.substring(lastIndex, index),
        });
      }

      // Extract the title and JSON content
      const title = match[1];
      const jsonString = `{${match[2]}}`;

      let jsonContent;
      try {
        jsonContent = JSON.parse(jsonString);
      } catch (error) {
        // If JSON parsing fails, treat the content as plain text
        jsonContent = match[2];
      }

      parts.push({
        type: 'json',
        title,
        content: jsonContent,
      });

      lastIndex = regex.lastIndex;
    }

    // Add any remaining plain text after the last match
    if (lastIndex < message.length) {
      parts.push({
        type: 'text',
        content: message.substring(lastIndex),
      });
    }

    return parts;
  };

  const renderPart = (part: MessagePart, index: number) => {
    if (part.type === 'text') {
      return (
        <Text key={index} style={styles.text}>
          {part.content as string}
        </Text>
      );
    } else if (part.type === 'json') {
      // Based on the title, render the JSON content differently
      switch (part.title) {
        case 'Repair Estimate':
          return (
            <RepairEstimate key={index} data={part.content} />
          );
        case 'Repair Instructions':
          return (
            <RepairInstructions key={index} data={part.content} />
          );
        case 'Parts and Tools Needed':
          return (
            <PartsAndToolsNeeded key={index} data={part.content} />
          );
        default:
          return (
            <View key={index} style={styles.jsonContainer}>
              <Text style={styles.title}>{part.title}:</Text>
              <Text style={styles.jsonText}>
                {typeof part.content === 'object'
                  ? JSON.stringify(part.content, null, 2)
                  : part.content}
              </Text>
            </View>
          );
      }
    }
    return null;
  };

  const parts = parseMessage(message);

  return <View>{parts.map((part, index) => renderPart(part, index))}</View>;
};

// Subcomponents for different JSON sections
interface RepairEstimateProps {
  data: any;
}

const RepairEstimate: React.FC<RepairEstimateProps> = ({ data }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Repair Estimate</Text>
      <View style={styles.sectionContent}>
        <Text style={styles.label}>Expected Repair Time:</Text>
        <Text style={styles.value}>{data.expectedRepairTime}</Text>

        <Text style={styles.label}>Average Repair Price:</Text>
        <Text style={styles.value}>${data.averageRepairPrice.toFixed(2)}</Text>

        <Text style={styles.label}>Average Shop Price:</Text>
        <Text style={styles.value}>${data.averageShopPrice.toFixed(2)}</Text>

        <Text style={styles.label}>Repair Difficulty:</Text>
        <Text style={styles.value}>{data.repairDifficulty}</Text>

        <Text style={styles.label}>Summary:</Text>
        <Text style={styles.value}>{data.summary}</Text>
      </View>
    </View>
  );
};

interface RepairInstructionsProps {
  data: any;
}

const RepairInstructions: React.FC<RepairInstructionsProps> = ({ data }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Repair Instructions</Text>
      <View style={styles.sectionContent}>
        {data.steps && data.steps.length > 0 && (
          data.steps.map((step: string, index: number) => (
            <View key={index} style={styles.stepContainer}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

interface PartsAndToolsNeededProps {
  data: any;
}

const PartsAndToolsNeeded: React.FC<PartsAndToolsNeededProps> = ({ data }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Parts and Tools Needed</Text>
      <View style={styles.sectionContent}>
        <Text style={styles.label}>Parts:</Text>
        {data.parts && data.parts.length > 0 && (
          data.parts.map((part: string, index: number) => (
            <Text key={index} style={styles.listItem}>• {part}</Text>
          ))
        )}

        <Text style={styles.label}>Tools:</Text>
        {data.tools && data.tools.length > 0 && (
          data.tools.map((tool: string, index: number) => (
            <Text key={index} style={styles.listItem}>• {tool}</Text>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionContainer: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  sectionContent: {
    // Optional styling if needed
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  stepNumber: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 2,
  },
});

export default MessageParser;