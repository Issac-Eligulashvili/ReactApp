import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useModalDropdownStore } from "@/states/StoreStates";

const NumTeamsDropdown = () => {
     const setSelectedValue = useModalDropdownStore((state) => state.setSelectedValue);
     const [activeButton, setActiveButton] = useState<number | null>(null);

     const buttons = [4, 6, 8, 10];

     return (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
               {buttons.map((button, index) => (
                    <Pressable style={[
                         styles.Btn,
                         activeButton === index ? styles.activeBtn : styles.deactiveBtn
                    ]}
                         onPress={() => {
                              setActiveButton(index);
                              setSelectedValue(button);
                         }}
                         key={index}
                    >
                         <Text style={styles.btnText}>
                              {button}
                         </Text>
                    </Pressable>
               ))}
          </View>
     )
};

const styles = StyleSheet.create({
     Btn: {
          backgroundColor: "#bea618",
          borderColor: "#FFD700",
          borderWidth: 2,
          borderRadius: 10,
          width: 50,
          aspectRatio: "1 / 1",
          margin: 0,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center"
     },
     btnText: {
          textAlign: "center",
          fontFamily: "tex",
          color: "white",
          margin: 0
     },
     activeBtn: {
          backgroundColor: "#bea618",
          borderColor: "#FFD700",
     },
     deactiveBtn: {
          backgroundColor: "rgba(91, 96, 97, 0.8)",
          borderColor: "rgba(91, 96, 97, 0.8)",
     }
});

export default NumTeamsDropdown;
