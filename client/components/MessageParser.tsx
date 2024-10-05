import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RepairEstimateComponent from './RepairEstimateComponent';
import RepairInstructionsComponent from './RepairInstructionsComponent';
import PartsAndToolsComponent from './PartsAndToolsComponent';

export interface MessageParserProps {
  message: string;
  onParsedData: (data: ParsedData) => void;
}

export interface ParsedData {
  repairEstimate: RepairEstimate | null;
  repairInstructions: RepairInstructions | null;
  partsAndTools: PartsAndTools | null;
  plainText: string;
}

export interface RepairEstimate {
  expectedRepairTime: string;
  averageRepairPrice: number;
  toolsAndMaterials: string[];
  averageShopPrice: number;
  repairDifficulty: string;
  summary: string;
}

export interface RepairInstructions {
  steps: string[];
}

export interface PartsAndTools {
  parts: string[];
  tools: string[];
}

const MessageParser: React.FC<MessageParserProps> = ({ message, onParsedData }) => {
  const parseMessage = (message: string): ParsedData => {
    let remainingText = message;
    const jsonRegex = /(\w+(?:\s+\w+)*):\s*\n\{[\s\S]*?\n\}/g;
    let match;
    let repairEstimate: RepairEstimate | null = null;
    let repairInstructions: RepairInstructions | null = null;
    let partsAndTools: PartsAndTools | null = null;

    while ((match = jsonRegex.exec(message)) !== null) {
      const title = match[1];
      const jsonString = match[0].substring(match[0].indexOf('{'));

      try {
        const jsonData = JSON.parse(jsonString);
        switch (title) {
          case 'Repair Estimate':
            repairEstimate = jsonData as RepairEstimate;
            break;
          case 'Repair Instructions':
            repairInstructions = jsonData as RepairInstructions;
            break;
          case 'Parts and Tools Needed':
            partsAndTools = jsonData as PartsAndTools;
            break;
        }
        remainingText = remainingText.replace(match[0], '');
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    return {
      repairEstimate,
      repairInstructions,
      partsAndTools,
      plainText: remainingText.trim(),
    };
  };

  const parsedData = parseMessage(message);
  onParsedData(parsedData);

  return (
    <View>
      <Text style={styles.plainText}>{parsedData.plainText}</Text>
      {parsedData.repairEstimate && <RepairEstimateComponent data={parsedData.repairEstimate} />}
      {parsedData.repairInstructions && <RepairInstructionsComponent data={parsedData.repairInstructions} />}
      {parsedData.partsAndTools && <PartsAndToolsComponent data={parsedData.partsAndTools} />}
    </View>
  );
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
  plainText: {
    fontSize: 16,
    marginBottom: 10,
  },
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
  jsonContainer: {
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 14,
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