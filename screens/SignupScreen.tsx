import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomTextInput from "../components/TextInput";
import Logo from "../components/Logo";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../components/type";
import { StackNavigationProp } from "@react-navigation/stack";

import { useEffect, useState } from "react";
import React from "react";
import { database } from "@/js/supabaseClient";

type AuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

export default function SignupScreen() {
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const navigation = useNavigation<AuthScreenNavigationProp>();

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
          <View>
            <Text style={[styles.inputLable, styles.visby]}>Username</Text>
            <CustomTextInput
              value={text}
              onChange={(newText) => setText(newText)}
              placeholder=""
              secureTextEntry={false}
            ></CustomTextInput>
          </View>
          <View style={styles.inputMargin}>
            <Text style={[styles.inputLable, styles.visby]}>Email</Text>
            <CustomTextInput
              value={text2}
              onChange={(newText) => setText2(newText)}
              placeholder=""
              secureTextEntry={false}
            ></CustomTextInput>
          </View>
          <View style={styles.inputMargin}>
            <Text style={[styles.inputLable, styles.visby]}>Password</Text>
            <CustomTextInput
              value={text3}
              onChange={(newText) => setText3(newText)}
              placeholder=""
              secureTextEntry={true}
            ></CustomTextInput>
          </View>
          <Pressable style={styles.button} onPress={async () => {
            let response = await database
              .auth.signUp({
                email: text2,
                password: text3,
              })
            if (response.error) {
              alert('There was an error signing up');
            }

            const userID = response?.data?.user?.id

            let response2 = await database.from("users").insert({
              username: text,
              email: text2,
              id: userID,
            })

            if (response2.error) {
              alert('There was an error signing up');
            } else {
              navigation.navigate("Login");
            }
          }}>
            <Text style={[styles.bold, styles.btnText]}>Sign Up</Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={[styles.visby, styles.text]}>
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text
                style={[
                  styles.visby,
                  styles.text,
                  { textDecorationLine: "underline", alignSelf: "baseline" },
                ]}
              >
                Log in
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
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
