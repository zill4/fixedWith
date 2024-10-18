import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
export default function Header() {
  const router = useRouter();
  const handleEditProfile = () => {
    router.push('/settings' as any);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
      <Text style={styles.headerText}>FixedW/</Text>
      <Ionicons name="car-sport" size={32} color="#DE2020" />
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