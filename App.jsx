import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AuthProvider } from "./AuthContext";
import GroupSetupScreen from "./app/screens/GroupSetupScreen";
import HomeScreen from "./app/screens/HomeScreen";
import LandingPage from "./app/screens/LandingPage";
import Login from "./app/screens/Login";
import Signup from "./app/screens/Signup";
import SettingsScreen from "./app/screens/SettingsScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Log in"
            component={Login}
            options={{ headerBackTitle: "" }}
          />
          <Stack.Screen
            name="Sign up"
            component={Signup}
            options={{ headerBackTitle: "" }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Group Setup"
            component={GroupSetupScreen}
            options={{ headerBackTitle: "" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerBackTitle: "" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
