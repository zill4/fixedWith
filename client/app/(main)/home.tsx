import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Profiles" onPress={() => router.push('/(profile)/profiles')} />
      <Button title="Build/Repair" onPress={() => router.push('/(main)/build-repair')} />
      <Button title="Settings" onPress={() => router.push('/(main)/settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});