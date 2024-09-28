import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfilesScreen() {
  const router = useRouter();

  // TODO: Replace with actual profiles data
  const profiles = [
    { id: '1', name: 'MyCar', make: 'Toyota', model: '86', year: '2019', trim: 'TRD' },
    // Add more profiles as needed
  ];

  const handleAddProfile = () => {
    router.push('/(profile)/profile-setup');
  };

  const handleEditProfile = (profileId: string) => {
    // TODO: Implement edit profile functionality
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.profileItem}>
            <Text style={styles.profileName}>{item.name}</Text>
            <Text>
              {item.make} {item.model} {item.year} {item.trim}
            </Text>
            <Button title="Edit" onPress={() => handleEditProfile(item.id)} />
          </View>
        )}
      />
      <Button title="Add Profile" onPress={handleAddProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});