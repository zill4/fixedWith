import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface RepairInstructionsComponentProps {
  data: {
    steps: string[];
  };
}

function RepairInstructionsComponent({ data }: RepairInstructionsComponentProps) {
  console.log("RepairInstructionsComponent data:", data);

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepNumber}>{index + 1}.</Text>
      <Text style={styles.stepText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Repair Instructions</Text>
        <FlatList
          data={data.steps}
          renderItem={renderItem}
          keyExtractor={(item, index) => `step-${index}`}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

export default RepairInstructionsComponent;

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    backgroundColor: '#f0f4f8',
    padding: 15,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DE2020',
    marginRight: 10,
    minWidth: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 20,
  },
});