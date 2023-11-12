import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WelcomeScreen = ({ route }, navigation) => {
  const { username } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {username}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
