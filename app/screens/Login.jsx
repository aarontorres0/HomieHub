import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const auth = getAuth();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      navigation.navigate("HelloWorld");
    } catch (error) {
      console.error("Authentication error:", error);
      Alert.alert("Authentication Error", "Invalid email or password.");
      setPassword("");
    }
  };

  return (
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
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
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
});

export default LoginPage;
