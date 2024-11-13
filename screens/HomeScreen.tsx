import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

function HomeScreen() {
  return (
    <View style={styles.container}>
        <LinearGradient
        colors={["#2E1A47", "#0B1124"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient} // Add a style for LinearGradient
      >
        <Text style={styles.text}>this is home screen!</Text>
        <StatusBar style="auto" />
        </LinearGradient>
    </View>
  );
}

export default HomeScreen;

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
});
