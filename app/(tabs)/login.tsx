import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // For navigation

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // For navigation

  const handleLogin = async () => {
    console.log('logged in');
    // if (!username || !password) {
    //   Alert.alert('Error', 'Please enter both username and password');
    //   return;
    // }

    // // Here you would typically make an API call to authenticate the user
    // try {
    //   const response = await fetch('https://your-api-url/user/login', {
    //     method: 'GET', // Use POST for real-world applications
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Invalid credentials');
    //   }

    //   const data = await response.json();
    //   Alert.alert('Success', `Welcome, ${data.username}!`);
      
    //   // Redirect or navigate to another screen on successful login
    //   router.push('/home'); // Change '/home' to your home screen route

    // } catch (error) {
    //   Alert.alert('Login Failed', error.message || 'Something went wrong');
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      
      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign up!</Text>
      </TouchableOpacity>
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
  signupButton: {
    marginTop: 20,
    alignItems: 'center', // Center the text
  },
  signupText: {
    color: 'blue', // Change to your preferred color
    fontSize: 16,
  },
});

export default LoginScreen;
