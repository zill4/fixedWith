import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Ionicons name="car-sport" size={24} color="#DE2020" />
    <Text style={styles.headerText}>FixedWith</Text>
    </View>
  );
}

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#DE2020',
    },
});