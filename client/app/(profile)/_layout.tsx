import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="profiles" options={{ headerShown: false }} />
    </Stack>
  );
}