import * as Clipboard from "expo-clipboard";
import { deleteUser, getAuth } from "firebase/auth";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
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

  const handleLeaveGroup = async () => {
    if (!groupId) {
      Alert.alert("Error", "You are not in a group.");
      return;
    }

    Alert.alert("Confirm Leave", "Are you sure you want to leave the group?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Leave",
        onPress: async () => {
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
              routes: [{ name: "LandingPage" }],
            });

            Alert.alert(
              "Removed",
              "You are no longer in the group. Please sign in again to join a new group."
            );

            const groupSnapshot = await getDoc(groupRef);
            if (
              groupSnapshot.exists() &&
              groupSnapshot.data().members.length === 0
            ) {
              await deleteDoc(groupRef);
            }
          } catch (error) {
            console.error("Error leaving group:", error);
            Alert.alert("Error", "Unable to leave group. Please try again.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const db = getFirestore();
              const auth = getAuth();
              const user = auth.currentUser;
              const uid = user ? user.uid : null;
              let groupRef = null;

              if (groupId) {
                groupRef = doc(db, "Groups", groupId);
                await updateDoc(groupRef, {
                  members: arrayRemove(uid),
                });
              }

              const userRef = doc(db, "Users", uid);
              await deleteDoc(userRef);
              await deleteUser(user);

              navigation.reset({
                index: 0,
                routes: [{ name: "LandingPage" }],
              });

              const groupSnapshot = await getDoc(groupRef);
              if (
                groupSnapshot.exists() &&
                groupSnapshot.data().members.length === 0
              ) {
                await deleteDoc(groupRef);
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Unable to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {groupId && (
        <>
          <TouchableOpacity
            style={[styles.baseButton, styles.copyButton]}
            onPress={handleCopyGroupId}
          >
            <Icon
              name="clipboard"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.buttonText}>Copy Group ID</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.baseButton, styles.leaveGroupButton]}
            onPress={handleLeaveGroup}
          >
            <Icon
              name="times-circle"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.buttonText}>Leave Group</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={[styles.baseButton, styles.deleteAccountButton]}
        onPress={handleDeleteAccount}
      >
        <Icon
          name="trash"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[styles.baseButton, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Icon
          name="sign-out"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
        />
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
  baseButton: {
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  copyButton: {
    backgroundColor: "#2a9df4",
  },
  leaveGroupButton: {
    backgroundColor: "#d9534f",
  },
  deleteAccountButton: {
    backgroundColor: "#ff3b30",
  },
  signOutButton: {
    backgroundColor: "#4a09a5",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
});

export default SettingsScreen;
