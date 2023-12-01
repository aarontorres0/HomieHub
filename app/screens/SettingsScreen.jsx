import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { FIREBASE_AUTH } from "../../firebaseConfig";

const SettingsScreen = ({ navigation, route }) => {
  const groupId = route.params?.groupId;

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "LandingPage" }],
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
    }
  };

  const handleCopyGroupId = () => {
    Clipboard.setStringAsync(groupId);
    Alert.alert("Copied", `Group ID has been copied to clipboard.`);
  };

  return (
    <View style={styles.container}>
      {groupId && (
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyGroupId}>
          <Text style={styles.buttonText}>Copy Group ID</Text>
        </TouchableOpacity>
      )}

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
  copyButton: {
    backgroundColor: "#2a9df4",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default SettingsScreen;
