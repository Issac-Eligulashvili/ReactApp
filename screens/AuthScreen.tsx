import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomTextInput from "../components/TextInput";
import Logo from "../components/Logo";
import * as Font from "expo-font";

import { useEffect, useState } from "react";

export default function AuthScreen() {
  const [text, setText] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        VisbyCF: require("../assets/fonts/VisbyCF-Bold.ttf"),
        "The-Bold-Font": require("../assets/fonts/THE BOLD FONT - FREE VERSION - 2023.ttf"),
        tex: require("../assets/fonts/tex-gyre-adventor.bold.otf"),
      });
      setFontLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

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
              value={text}
              onChange={(newText) => setText(newText)}
              placeholder=""
              secureTextEntry={false}
            ></CustomTextInput>
          </View>
          <View style={styles.inputMargin}>
            <Text style={[styles.inputLable, styles.visby]}>Password</Text>
            <CustomTextInput
              value={text}
              onChange={(newText) => setText(newText)}
              placeholder=""
              secureTextEntry={true}
            ></CustomTextInput>
          </View>
          <Pressable style={styles.button}>
            <Text style={[styles.bold, styles.btnText]}>Sign Up</Text>
          </Pressable>
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
    width: 129,
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
