import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'The passwords you entered do not match. Please try again.');
      return;
    }
    
    // If passwords match, proceed with the registration process
    // TODO: Add Firebase logic here
    console.log(username, email, password);
    Alert.alert('Registration Attempt', `Name: ${username}, Email: ${email}, Password: ${password}`);
  };

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.inputField}
        placeholder="Enter Username"
        placeholderTextColor="grey"
        onChangeText={setUsername}
        value={username}
      />

      <TextInput
        style={styles.inputField}
        placeholder="Enter Email Address"
        placeholderTextColor="grey"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputField}
        placeholder="Enter Password"
        placeholderTextColor="grey"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TextInput
        style={styles.inputField}
        placeholder="Confirm Password"
        placeholderTextColor="grey"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  inputField: {
    fontSize: 16,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
  },
  registerButton: {
    backgroundColor: '#4a09a5',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
  },
});

export default Register;
