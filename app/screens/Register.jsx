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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "The passwords you entered do not match. Please try again."
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your password must be at least 8 characters long."
      );
      return;
    }

    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const username = email.split("@")[0];

        const db = getFirestore();
        setDoc(doc(db, "Users", uid), {
          email: email,
          name: username,
        })
          .then(() => {
            navigation.navigate("WelcomeScreen", { username: username });
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
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Already have an account? Log In</Text>
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
  registerButton: {
    backgroundColor: "#4a09a5",
    padding: 15,
    borderRadius: 5,
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
});

export default Register;