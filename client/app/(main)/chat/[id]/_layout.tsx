import { Stack } from 'expo-router';

export default function ChatDiagnosisLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="diagnosis" options={{ headerShown: false }} />
    </Stack>
  );
}