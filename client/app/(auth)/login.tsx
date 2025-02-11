import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  
  
  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(main)/home');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.replace('/(main)/home');
    } catch (error: any) {
      Alert.alert('Google Login Error', error.message);
    }
  };


const handleNavigateToRegister = () => {
  router.replace('/(auth)/register');
};

const handleNavigateToResetPassword = () => {
  router.replace('/(auth)/resetPassword');
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
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
        <Text style={styles.signUpButtonText}>Sign in</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleNavigateToRegister}>
        <Text style={styles.resetPasswordText}>Don't have an account sign up</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={handleNavigateToResetPassword}>
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