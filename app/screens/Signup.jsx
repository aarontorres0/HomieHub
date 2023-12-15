import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter an email address.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "The passwords you entered do not match. Please try again."
      );
      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your password must be at least 8 characters long."
      );
      setPassword("");
      setConfirmPassword("");
      return;
    }

    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        const username = email.split("@")[0];

        const db = getFirestore();
        setDoc(doc(db, "Users", uid), {
          email: email,
          name: username,
        })
          .then(() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Group Setup",
                  params: { username, uid },
                },
              ],
            });
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            Alert.alert("Firestore Error", "Error writing document.");
          });
      })
      .catch((error) => {
        Alert.alert("Registration Error", error.message);
      });
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

        <TextInput
          style={styles.inputField}
          placeholder="Confirm Password"
          placeholderTextColor="grey"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.baseButton, styles.registerButton]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Log in")}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.linkText}>Log in</Text>
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
    backgroundColor: "white",
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
  registerButton: {
    backgroundColor: "#4a09a5",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  loginText: {
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

export default Signup;
