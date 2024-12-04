import React from "react";
import { View, Text, Dimensions } from "react-native";
import { Svg, Path } from "react-native-svg";

let activeTab = true;

export default function Footer() {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill={activeTab ? "#fff" : "none"}
        >
          <Path
            d="M15.9999 24V20M13.4266 3.76L4.18661 11.16C3.14661 11.9867 2.47995 13.7333 2.70661 15.04L4.47995 25.6533C4.79995 27.5467 6.61328 29.08 8.53328 29.08H23.4666C25.3733 29.08 27.1999 27.5333 27.5199 25.6533L29.2933 15.04C29.5066 13.7333 28.8399 11.9867 27.8133 11.16L18.5733 3.77333C17.1466 2.62667 14.8399 2.62667 13.4266 3.76Z"
            stroke={activeTab ? "rgba(11, 17, 36, 1)" : "white"}
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
      </View>
    </View>
  );
}
