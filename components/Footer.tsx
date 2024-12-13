import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Svg, Path } from "react-native-svg";
import { navigation as n } from "@/states/StoreStates";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/type";
import Ionicons from '@expo/vector-icons/Ionicons';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Footer">;

export default function Footer() {
  const activeTab = n((state) => state.currentScreen);
  const setActiveTab = n((state) => state.setCurrentScreen);
  const navigation = useNavigation<AuthScreenNavigationProp>();

  useEffect(() => {
    console.log(activeTab);
  }, [activeTab])

  return (
    <View style={{ marginBottom: 16, flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
      <Pressable style={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => { setActiveTab("Home"); navigation.goBack() }}
      >
        <Svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill={activeTab === "Home" ? "#fff" : "none"}
        >
          <Path
            d="M15.9999 24V20M13.4266 3.76L4.18661 11.16C3.14661 11.9867 2.47995 13.7333 2.70661 15.04L4.47995 25.6533C4.79995 27.5467 6.61328 29.08 8.53328 29.08H23.4666C25.3733 29.08 27.1999 27.5333 27.5199 25.6533L29.2933 15.04C29.5066 13.7333 28.8399 11.9867 27.8133 11.16L18.5733 3.77333C17.1466 2.62667 14.8399 2.62667 13.4266 3.76Z"
            stroke={activeTab === "Home" ? "rgba(11, 17, 36, 1)" : "white"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text
          style={{
            fontSize: 13,
            fontFamily: "VisbyCF",
            color: "white",
            fontWeight: 700,
          }}
        >
          Home
        </Text>
      </Pressable>
      <Pressable style={{ justifyContent: "center", alignItems: "center" }}
        onPress={() => { setActiveTab("Chat"); navigation.navigate("Friends") }}
      >
        {activeTab === "Chat" ? <Ionicons name="chatbubble-ellipses" size={30} color="white" /> : <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />}
        <Text
          style={{
            fontSize: 13,
            fontFamily: "VisbyCF",
            color: "white",
            fontWeight: 700,
          }}
        >
          Chat
        </Text>
      </Pressable>
    </View>
  );
}
