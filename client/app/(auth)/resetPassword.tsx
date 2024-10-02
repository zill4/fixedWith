import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const { resetPassword } = useAuth();
  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Reset Password Error', error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google SSO login logic here
    console.log('Google login pressed');
  };


const handleNavigateToRegister = () => {
  router.replace('/(auth)/register');
};

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Ionicons name="car-sport" size={24} color="#DE2020" />
        <Text style={styles.logoText}> FixedWith</Text>
      </View>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      
      <TouchableOpacity style={styles.signUpButton} onPress={handleResetPassword}>
        <Text style={styles.signUpButtonText}>Send reset password email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleNavigateToRegister}>
        <Text style={styles.resetPasswordText}>Don't have an account sign up</Text>
      </TouchableOpacity>
            
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DE2020',
  },
  input: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#DE2020',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetPasswordText: {
    color: '#DE2020',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});