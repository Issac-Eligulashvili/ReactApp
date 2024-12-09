import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { database } from "./js/supabaseClient";
import { User } from "@supabase/supabase-js";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import CurrentLeagueScreen from "./screens/CurrentLeagueScreen";
import DraftScreen from "./screens/DraftScreen";
import { RootStackParamList } from "./components/type";
import { DataProvider } from "./components/UserDataProvider";
import { FontProvider } from "./components/FontProvider";
import { RealTimeListener } from "./components/LiveUpdateListener";
import { LogBox } from "react-native";

const AuthStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<RootStackParamList>();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
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
      <HomeStack.Screen
        name="Leagues"
        component={CurrentLeagueScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Draft"
        component={DraftScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  LogBox.ignoreAllLogs(true);
  console.error = () => { }; // Suppress error logs
  console.warn = () => { };  // Suppress warning logs


  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await database.auth.getUser();
      setUser(user);
    }

    fetchUser();

    const { data: authListener } = database.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <RealTimeListener />
      <DataProvider>
        <FontProvider>
          <NavigationContainer>
            {user ? <HomeStackScreen /> : <AuthStackScreen />}
          </NavigationContainer>
        </FontProvider>
      </DataProvider>
    </>
  );
}
