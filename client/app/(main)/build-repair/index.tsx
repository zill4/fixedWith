import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function BuildRepairScreen() {
  const [buildName, setBuildName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageContext, setImageContext] = useState('');
  const router = useRouter();

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGetEstimate = () => {
    // TODO: Implement request logic
    // For now, navigate to chat screen with dummy ID
    const buildId = '123'; // Replace with actual build ID
    router.push(`/build-repair/${buildId}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Build Name"
        value={buildName}
        onChangeText={setBuildName}
        style={styles.input}
      />
      <TextInput
        placeholder="Selected Profile"
        value={selectedProfile}
        onChangeText={setSelectedProfile}
        style={styles.input}
      />
      <TextInput
        placeholder="Describe the issue or build"
        value={prompt}
        onChangeText={setPrompt}
        style={styles.input}
        multiline
      />
      <Button title="Add Image" onPress={handleSelectImage} />
      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TextInput
            placeholder="Image Context"
            value={imageContext}
            onChangeText={setImageContext}
            style={styles.input}
          />
        </>
      )}
      <Button
        title="Get Estimate"
        onPress={handleGetEstimate}
        disabled={!buildName || !selectedProfile || !prompt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 12,
  },
});