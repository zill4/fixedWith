import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function Header() {

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
      <Ionicons name="car-sport" size={24} color="#DE2020" />
      <Text style={styles.headerText}>FixedWith</Text>
      </View>
      <TouchableOpacity onPress={handleEditProfile}>
        <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#DE2020',
    },
});