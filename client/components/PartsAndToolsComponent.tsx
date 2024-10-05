import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface PartsAndToolsComponentProps {
  data: {
    parts: string[];
    tools: string[];
  };
}

function PartsAndToolsComponent({ data }: PartsAndToolsComponentProps) {
//   console.log("PartsAndToolsComponent data:", data);
  
  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Parts and Tools</Text>
        <View style={styles.listContainer}>
          <Text style={styles.subTitle}>Parts:</Text>
          <FlatList
            data={data.parts}
            renderItem={renderItem}
            keyExtractor={(item, index) => `part-${index}`}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.listContainer}>
          <Text style={styles.subTitle}>Tools:</Text>
          <FlatList
            data={data.tools}
            renderItem={renderItem}
            keyExtractor={(item, index) => `tool-${index}`}
            scrollEnabled={false}
          />
        </View>
      </View>
    </View>
  );
}

export default PartsAndToolsComponent;

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
  listContainer: {
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 16,
    marginRight: 5,
    color: '#DE2020',
  },
  itemText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
