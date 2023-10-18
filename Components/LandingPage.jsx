import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Video } from 'expo-av';

const LandingPage = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Video
        source={require('./Homie.mp4')}
        rate={1.0}
        isMuted={true}
        resizeMode="contain"
        shouldPlay
        isLooping
        style={styles.logoVideo}
      />
      <Text style={styles.welcomeText}>Welcome to HomieHub</Text>
      <Text style={styles.descriptionText}>
        HomieHub is the ultimate tool to keep you and your roommates organized and connected.
      </Text>
      
      <Text style={styles.memberText}>Already a member?</Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoVideo: {
    width: '100%',
    height: '60%', // Made video larger by occupying 50% of screen height
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  memberText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#4a09a5', // Darker shade of purple
    padding: 15,
    borderRadius: 5,
    width: '100%', // Full width
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#4a09a5', // Darker shade of blue
    padding: 15,
    borderRadius: 5,
    width: '100%', // Full width
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default LandingPage;
