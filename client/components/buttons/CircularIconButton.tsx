import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CircularIconButton ({ icon, onPress }: { icon: any, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.diagnosisIconContainer}>
                <Ionicons name={icon} size={24} color="#000" />
            </View>
        </TouchableOpacity>
    )
}   
const styles = StyleSheet.create({
  diagnosisContainer: {
    padding: 16,
  },
  diagnosisScroll: {
    marginBottom: 16,
  },
  diagnosisItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  diagnosisIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  diagnosisLabel: {
    textAlign: 'center',
  },
});