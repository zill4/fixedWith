import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RepairEstimateComponentProps {
  data: {
    expectedRepairTime: string;
    averageRepairPrice: number;
    toolsAndMaterials: string[];
    averageShopPrice: number;
    repairDifficulty: string;
    summary: string;
  };
}

const RepairEstimateComponent: React.FC<RepairEstimateComponentProps> = ({ data }) => {
//   console.log("RepairEstimateComponent data:", data);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Repair Estimate</Text>
        <View style={styles.infoContainer}>
          <InfoItem label="Expected Repair Time" value={data.expectedRepairTime} />
          <InfoItem label="Average Repair Price" value={`$${data.averageRepairPrice.toFixed(2)}`} />
          <InfoItem label="Average Shop Price" value={`$${data.averageShopPrice.toFixed(2)}`} />
          <InfoItem label="Repair Difficulty" value={data.repairDifficulty} />
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Summary:</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      </View>
    </View>
  );
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default RepairEstimateComponent;

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
  infoContainer: {
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  value: {
    fontSize: 14,
    color: '#2c3e50',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
});