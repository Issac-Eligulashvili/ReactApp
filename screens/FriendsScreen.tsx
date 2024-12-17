import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Footer from "@/components/Footer";
import WebChat from "@/components/WebChat";
import PhoneChatScreen from "@/components/iOSChat";

export default function FriendsScreen() {
  return (
    <LinearGradient
      colors={["#2E1A47", "#0B1124"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {/* This is the top bar of the screen holding small tidbits of data */}
        <View style={{ width: "100%", flexGrow: 1 }}>
          <View style={[{ width: "100%", padding: 10, flexGrow: 1 }, Platform.OS === 'web' ? { paddingRight: 0, paddingVertical: 0 } : null]}>
            {Platform.OS === "web" ? <WebChat /> : <PhoneChatScreen />}
          </View>
        </View>
        {Platform.OS === 'web' ? null :
          <Footer></Footer>}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // This makes the gradient cover the full area
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Full width to match the parent container
    overflow: "hidden",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
});
