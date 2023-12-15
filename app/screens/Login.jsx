import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import Icon from "react-native-vector-icons/FontAwesome";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter an email address.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Password Required", "Please enter a password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const uid = userCredential.user.uid;

      const db = getFirestore();
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const groupId = userSnap.data().roommateGroupID;
        const username = userSnap.data().name;

        if (groupId) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Home",
                params: { groupId, username },
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Group Setup", params: { username, uid } }],
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

        <TouchableOpacity
          style={[styles.baseButton, styles.loginButton]}
          onPress={handleLogin}
        >
          <Icon
            name="sign-in"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Sign up")}>
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.linkText}>Sign up</Text>
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
  baseButton: {
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#4a09a5",
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
