import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // For navigation

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter(); // For navigation

  const handleSignup = async () => {
    if (!username || !password || !email) {
      console.log("unfilled");
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically make an API call to create a new user
    try {
      const response = await fetch('http://127.0.0.1:5000/users/create', {
        method: 'POST', // Use POST for creating a new user
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      Alert.alert('Success', `User ${data.username} created successfully!`);
      
      // Redirect or navigate to another screen on successful signup
      router.push('/login'); // Change '/login' to your desired screen route

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Signup Failed', error.message);
      } else {
        Alert.alert('Signup Failed', 'Something went wrong');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default SignupScreen;
