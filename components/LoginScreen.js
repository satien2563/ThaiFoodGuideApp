import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      navigation.replace('Home'); // เปลี่ยนหน้าไป Home ทันทีหลัง Login สำเร็จ
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Login Failed', 'No user found with this email');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Login Failed', 'Incorrect password');
      } else {
        Alert.alert('Login Failed', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Thai Food Guide</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  registerLink: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});
