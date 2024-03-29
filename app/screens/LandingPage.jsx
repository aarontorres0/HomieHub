import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const LandingPage = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Video
        source={require("../../assets/Homie.mp4")}
        rate={1.0}
        isMuted={true}
        resizeMode="contain"
        shouldPlay
        isLooping
        style={styles.logoVideo}
      />
      <Text style={styles.welcomeText}>Welcome to HomieHub</Text>
      <Text style={styles.descriptionText}>
        HomieHub is the ultimate tool to keep you and your roommates organized
        and connected.
      </Text>
      <TouchableOpacity
        style={[styles.baseButton, styles.loginButton]}
        onPress={() => navigation.navigate("Log in")}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoVideo: {
    width: "100%",
    height: "60%",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
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
    color: "#fff",
    fontSize: 16,
  },
  linkText: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});

export default LandingPage;
