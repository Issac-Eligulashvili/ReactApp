import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native"
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/components/type";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "@/components/Footer";
import { StackNavigationProp } from "@react-navigation/stack";
import Feather from '@expo/vector-icons/Feather';

type ChatScreenProps = RouteProp<RootStackParamList, 'Chat'>;
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;


export default function ChatScreen({ route }: { route: ChatScreenProps }) {
     const navigation = useNavigation<AuthScreenNavigationProp>();

     const { name } = route.params;
     console.log(name);

     return (
          <LinearGradient
               colors={["#2E1A47", "#0B1124"]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={styles.gradient}
          >
               <SafeAreaView style={styles.container}>
                    <View style={{ flexGrow: 1, marginTop: 10, width: "100%" }}>
                         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                              <Pressable
                                   onPress={() => navigation.goBack()}
                                   style={{ marginLeft: 10 }}
                              >
                                   <Feather name="arrow-left" size={24} color="white" />
                              </Pressable>
                              <Text style={styles.text}>
                                   {name}
                              </Text>
                              <View style={{ height: "100%", width: 16 }} />
                         </View>
                         <View style={{ height: 2, width: "100%", backgroundColor: "rgba(255,255,255,0.1)", marginTop: 15 }} />
                    </View>
               </SafeAreaView>
          </LinearGradient>
     )
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
     text: {
          fontFamily: "tex",
          color: "white",
          fontSize: 16
     }
});