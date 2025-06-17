// components/ProfileScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebaseConfig';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login'); // กลับไปหน้า Login หลัง logout
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.email || 'User'}!</Text>
      <Text style={styles.subtitle}>This is your profile screen.</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 30 },
});
