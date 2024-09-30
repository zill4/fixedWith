import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const { login } = useAuth();
  const handleLogin = () => {
    login();
    router.replace('/(profile)/profile-setup');
  };

  const handleGoogleLogin = () => {
    // Implement Google SSO login logic here
    console.log('Google login pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Ionicons name="car-sport" size={24} color="#DE2020" />
        <Text style={styles.logoText}> FixedWith</Text>
      </View>
      
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
        <Text style={styles.signUpButtonText}>Sign up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.resetPasswordText}>Reset password</Text>
      </TouchableOpacity>
            
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
      <Text style={styles.googleButtonText}>Sign in with  </Text>
        <Ionicons name="logo-google" size={24} color="#DE2020" />
        <Text style={styles.googleButtonText}>oogle</Text>
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