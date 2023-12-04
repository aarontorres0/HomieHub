import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { getFirestore, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

  const handleLeaveGroup = async () => {
    if (!groupId) {
      Alert.alert("Error", "You are not in a group.");
      return;
    }

    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user ? user.uid : null;

      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, {
        roommateGroupID: "",
      });

      const groupRef = doc(db, "Groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(uid),
      });

      await FIREBASE_AUTH.signOut();

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

      Alert.alert("Signed Out", "You have left the group and been signed out.");
    } catch (error) {
      console.error("Error leaving group:", error);
      Alert.alert("Error", "Unable to leave group. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {groupId && (
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyGroupId}>
          <Text style={styles.buttonText}>Copy Group ID</Text>
        </TouchableOpacity>
      )}

      {groupId && (
        <TouchableOpacity
          style={styles.leaveGroupButton}
          onPress={handleLeaveGroup}
        >
          <Text style={styles.buttonText}>Leave Group</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
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
  copyButton: {
    backgroundColor: "#2a9df4",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  leaveGroupButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  signOutButton: {
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
});

export default SettingsScreen;
