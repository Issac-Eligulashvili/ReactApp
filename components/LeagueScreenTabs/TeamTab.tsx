import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useCurrentLeagueStore, userDataState } from "@/states/StoreStates";
import Feather from "@expo/vector-icons/Feather";
import Svg, { Path } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TeamTab() {
  const userData = userDataState((state) => state.userData);

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 33,
          paddingTop: 18,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 48,
            width: 48,
            marginRight: 8,
            backgroundColor: "white",
          }}
        />
        <View>
          <Text
            style={{ fontFamily: "The-Bold-Font", fontSize: 13, color: "#fff" }}
          >
            {userData.username}'s Team
          </Text>
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 8,
              color: "#A9A9B0",
              marginTop: 3,
            }}
          >
            0 - 0
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable style={{ alignItems: "center" }}>
          <Feather name="calendar" size={24} color="white" />
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 8,
              color: "white",
              marginTop: 4,
            }}
          >
            Schedule
          </Text>
        </Pressable>
        <Pressable style={{ alignItems: "center", marginHorizontal: 65 }}>
          <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <Path
              d="M13.98 13.98C14.15 13.99 14.33 14 14.5 14C18.09 14 21 11.09 21 7.5C21 3.91 18.09 1 14.5 1C10.91 1 8 3.91 8 7.5C8 7.67 8.00999 7.84999 8.01999 8.01999M13.98 13.98C13.73 10.81 11.19 8.26999 8.01999 8.01999M13.98 13.98C13.99 14.15 14 14.33 14 14.5C14 18.09 11.09 21 7.5 21C3.91 21 1 18.09 1 14.5C1 10.91 3.91 8 7.5 8C7.67 8 7.84999 8.00999 8.01999 8.01999M4.59 1H2C1.45 1 1 1.45 1 2V4.59C1 5.48 2.07999 5.92999 2.70999 5.29999L5.29999 2.70999C5.91999 2.07999 5.48 1 4.59 1ZM17.41 21H20C20.55 21 21 20.55 21 20V17.41C21 16.52 19.92 16.07 19.29 16.7L16.7 19.29C16.08 19.92 16.52 21 17.41 21Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 8,
              color: "white",
              marginTop: 4,
            }}
          >
            Trade
          </Text>
        </Pressable>
        <Pressable style={{ alignItems: "center" }}>
          <MaterialCommunityIcons
            name="clipboard-flow-outline"
            size={24}
            color="white"
          />
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 8,
              color: "white",
              marginTop: 4,
            }}
          >
            Transfer
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
