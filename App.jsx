import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./app/screens/LandingPage";
import Login from "./app/screens/Login";
import Register from "./app/screens/Register";
import HelloWorld from "./app/screens/HelloWorld";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import { AuthProvider } from "./AuthContext";

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
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="HelloWorld" component={HelloWorld} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
