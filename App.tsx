import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { database } from "./js/supabaseClient";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";

// Define types for the stack routes
type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

const AuthStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<RootStackParamList>();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await database.auth.getUser();
      setUser(user);
    }

    fetchUser();
  }, []);

  return (
    <NavigationContainer>
      {user ? <HomeStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}
