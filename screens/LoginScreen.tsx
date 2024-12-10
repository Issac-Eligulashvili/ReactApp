import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../components/TextInput";
import Logo from "../components/Logo";
import { RootStackParamList } from "../components/type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { database } from "../js/supabaseClient";
import React from "react";
import { userDataState } from "@/states/StoreStates";
import Ionicons from '@expo/vector-icons/Ionicons';

type League = {
  teamsPlaying: []; // Array of players in this league
  // other league properties
  leagueID: string;
};

type LeaguesResponse = {
  data: League[] | null;
  // other properties
};

type AuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const setUserData = userDataState((state) => state.setUserData);
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2E1A47", "#0B1124"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient} // Add a style for LinearGradient
      >
        <Logo width={128} height={128} style={styles.logo} />
        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={[styles.inputLable, styles.visby]}>Email</Text>
            <CustomTextInput
              value={text1}
              onChange={(newText) => setText1(newText)}
              placeholder=""
              secureTextEntry={false}
            ></CustomTextInput>
          </KeyboardAvoidingView>
          <KeyboardAvoidingView style={styles.inputMargin}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={[styles.inputLable, styles.visby]}>Password</Text>
            <View style={{ position: "relative" }}>
              <CustomTextInput
                value={text2}
                onChange={(newText) => setText2(newText)}
                placeholder=""
                secureTextEntry={isHidden}
              ></CustomTextInput>
              {isHidden ?
                <Ionicons name="eye-off" size={24} color="black" /> :
                <Ionicons name="eye" size={24} color="black" />}
            </View>
          </KeyboardAvoidingView>
          <Pressable
            style={styles.button}
            onPress={() => {
              async function login() {
                let response = await database.auth.signInWithPassword({
                  email: text1,
                  password: text2,
                });
                if (response.error) {
                  alert("Incorrect email or password");
                } else {
                  getUserData();
                }
              }

              async function getUserData() {
                let userData = {
                  id: "",
                  username: "",
                  leaguesIsInIDS: [] as string[],
                };

                const { data } = await database.auth.getUser();

                userData.id = data?.user?.id!;

                const response = await database
                  .from("users")
                  .select("username")
                  .eq("id", userData.id);

                if (!response.error) {
                  userData.username = response.data[0]?.username!;
                }

                const leagues: LeaguesResponse = await database
                  .from("leagues")
                  .select("");
                const leaguesUserIsIn = leagues.data?.filter((league) => {
                  return league.teamsPlaying.find(
                    (player: { playerID: string }) => player.playerID === userData.id
                  );
                });

                userData.leaguesIsInIDS =
                  leaguesUserIsIn?.map((league) => league.leagueID) ?? [];

                setUserData(userData);
              }
              login();
            }}
          >
            <Text style={[styles.bold, styles.btnText]}>Log In</Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={[styles.visby, styles.text]}>No Account? </Text>
            <Pressable onPress={() => navigation.navigate("Signup")}>
              <Text
                style={[
                  styles.visby,
                  styles.text,
                  { textDecorationLine: "underline", alignSelf: "baseline" },
                ]}
              >
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1, // This makes the gradient cover the full area
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Full width to match the parent container
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  inputLable: {
    color: "#D3D3D3",
    fontSize: 16,
    marginBottom: 3,
  },
  logo: {
    marginBottom: 50,
  },
  visby: {
    fontFamily: "VisbyCF",
  },
  bold: {
    fontFamily: "The-Bold-Font",
  },
  tex: {
    fontFamily: "tex",
  },
  inputMargin: {
    marginTop: 17,
  },
  button: {
    height: 40,
    width: 258,
    backgroundColor: "#fff",
    borderRadius: 40,
    marginTop: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#0B1124", // Text color is transparent to show the gradient
  },
});
