import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileSetupScreen() {
  const [profileName, setProfileName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [trim, setTrim] = useState('');
  const router = useRouter();

  const handleCreateProfile = () => {
    // TODO: Save profile data
    router.replace('/(main)/home');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Profile Name"
        value={profileName}
        onChangeText={setProfileName}
        style={styles.input}
      />
      <TextInput
        placeholder="Make"
        value={make}
        onChangeText={setMake}
        style={styles.input}
      />
      <TextInput
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        style={styles.input}
      />
      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Trim"
        value={trim}
        onChangeText={setTrim}
        style={styles.input}
      />
      <Button title="Create Profile" onPress={handleCreateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
});