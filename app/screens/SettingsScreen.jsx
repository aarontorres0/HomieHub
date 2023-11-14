import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";

const SettingsScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      // Navigate to the Login screen after successful sign-out
      navigation.reset({
        index: 0,
        routes: [{ name: "LandingPage" }],
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  loginButton: {
    backgroundColor: "#4a09a5",
    padding: 15,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  // ... add other styles as needed
});

export default SettingsScreen;
