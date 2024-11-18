import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { useCurrentLeagueStore } from "@/states/StoreStates";
import { StatusBar } from "expo-status-bar";
import Footer from "@/components/Footer";
import LeagueScreenNav from "@/components/LeaugeScreenNav";

export default function CurrentLeagueScreen() {
     return (
          <LinearGradient
               colors={["#2E1A47", "#0B1124"]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={styles.gradient}
          >
               <SafeAreaView style={styles.container}>
                    <LeagueScreenNav />
                    <Text>
                         This is the league screen.
                    </Text>

                    <StatusBar style="auto" />
                    <Footer></Footer>
               </SafeAreaView >
          </LinearGradient>
     )
}

const styles = StyleSheet.create({
     gradient: {
          flex: 1, // This makes the gradient cover the full area
          alignItems: "center",
          justifyContent: "center",
          width: "100%", // Full width to match the parent container
     },
     container: {
          flex: 1,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "relative",
     },
})