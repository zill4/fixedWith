import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleChangePassword = () => {
    // TODO: Implement change password feature
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    logout();
    router.replace('/(auth)/login');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    // Temp
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Button title="Change Password" onPress={handleChangePassword} />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Delete Account" onPress={handleDeleteAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 12,
  },
});