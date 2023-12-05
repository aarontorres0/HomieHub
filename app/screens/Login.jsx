import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const userId = userCredential.user.uid;

      const db = getFirestore();
      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const groupId = userSnap.data().roommateGroupID;
        const username = userSnap.data().name;

        if (groupId) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "HomeScreen",
                params: { groupId: groupId, username: username },
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [
              { name: "GroupSetupScreen", params: { username, uid: userId } },
            ],
          });
        }
      } else {
        console.error("User not found in database");
        Alert.alert("Error", "User not found in database.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert("Authentication Error", "Invalid email or password.");
      setPassword("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.linkText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  inputField: {
    fontSize: 16,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "black",
  },
  loginButton: {
    backgroundColor: "#4a09a5",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  registerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#333",
    fontSize: 16,
  },
  linkText: {
    color: "#4a90e2",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default LoginPage;
