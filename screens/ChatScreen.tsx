import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, KeyboardAvoidingView, FlatList } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/components/type";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from '@expo/vector-icons/Ionicons';
import { userDataState } from "@/states/StoreStates";
import { TextInput } from "react-native-gesture-handler";
import colors from "@/assets/colors";
import { filter, lastIndexOf } from "lodash";
import { database } from "@/js/supabaseClient";

type ChatScreenProps = RouteProp<RootStackParamList, "Chat">;
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type message = {
     senderID: string;
     message: string;
     timestamp: string;
     senderUserName: string;
}
type chatroom = {
     id: string;
     messages: message[];
     users: string[];
     most_recent_message: message;
}

export default function ChatScreen({ route }: { route: ChatScreenProps }) {
     const navigation = useNavigation<AuthScreenNavigationProp>();
     const uData = userDataState((state) => state.userData);
     const [messages, setMessages] = useState<message[]>([]);
     const [placeholder, setPlaceholder] = useState("");
     const [input, setInput] = useState<string>("");
     const [currentChatID, setCurrentChatID] = useState("");
     const { name } = route.params;
     const arrOfChatUsers = [uData.username, name];

     useEffect(() => {
          setPlaceholder(`Message ${name}`);
          async function setInitMessages() {
               const response = await database
                    .from("chatrooms")
                    .select("*")
                    .contains('users', arrOfChatUsers);
               if (!Array.isArray(response.data) || response.data.length === 0) {
                    const r2 = await database
                         .from('chatrooms')
                         .insert({ users: arrOfChatUsers })
                         .select("*");
                    if (r2?.data && r2.data.length > 0) {
                         setCurrentChatID(r2.data[0].id);
                    }
               } else {
                    const filteredChatroom: chatroom | undefined = (response.data as chatroom[]).find((chatroom) => {
                         return chatroom.users.length === arrOfChatUsers.length;
                    });
                    if (filteredChatroom) {
                         setMessages(filteredChatroom.messages);
                         setCurrentChatID(filteredChatroom.id);
                    }
               }
          }
          setInitMessages();
     }, [])

     useEffect(() => {
          console.log(messages);
     }, [messages])

     async function sendMessage() {
          const message: message = {
               senderID: uData.id,
               senderUserName: uData.username,
               message: input.trim(),
               timestamp: new Date().toLocaleString(),
          }
          messages ?
               setMessages([
                    ...messages,
                    message
               ]) : setMessages([
                    message
               ])
          let newMessages;
          messages ? newMessages = [...messages, message] : newMessages = [message];
          console.log(newMessages);
          const { error } = await database
               .from("chatrooms")
               .update({ messages: newMessages, most_recent_chat: message })
               .eq("id", currentChatID)
          error ? console.log(error) : null
          setInput("")
     }

     return (
          <LinearGradient
               colors={["#2E1A47", "#0B1124"]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={styles.gradient}
          >
               <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView behavior="padding" style={{ flexGrow: 1, marginTop: 10, width: "100%" }}>
                         <View
                              style={{ flexDirection: "row", justifyContent: "space-between" }}
                         >
                              <Pressable
                                   onPress={() => navigation.goBack()}
                                   style={{ marginLeft: 10 }}
                              >
                                   <Feather name="arrow-left" size={24} color="white" />
                              </Pressable>
                              <Text style={styles.text}>{name}</Text>
                              <View style={{ height: "100%", width: 24, marginRight: 10 }} />
                         </View>
                         <View
                              style={{
                                   height: 2,
                                   width: "100%",
                                   backgroundColor: "rgba(255,255,255,0.1)",
                                   marginTop: 10,
                              }}
                         />
                         <View style={{ flex: 1 }}>
                              <FlatList style={{ flexGrow: 1 }}
                                   keyExtractor={(item: message, index) => index.toString()}
                                   renderItem={({ item, index }: { item: message, index: number }) => {
                                        let previousItem;
                                        if (messages[index - 1]) {
                                             previousItem = messages[index - 1];
                                        }
                                        const isDifferentID = previousItem?.senderID != item.senderID

                                        return (<View style={[{ paddingHorizontal: 10 },
                                        item.senderID === uData.id ?
                                             { alignItems: "flex-end" } :
                                             { alignItems: "flex-start" },
                                        !isDifferentID ?
                                             { marginTop: 0 } :
                                             { marginTop: 5 }
                                        ]}>
                                             <View style={[{ width: "70%" },
                                             item.senderID === uData.id ?
                                                  { alignItems: "flex-end" } :
                                                  { alignItems: "flex-start" }]}>
                                                  {isDifferentID ?
                                                       (<Text style={{ color: colors.subtext }}>{item.senderUserName}</Text>) :
                                                       null
                                                  }
                                                  <Text style={[styles.text, { flexWrap: "wrap", maxWidth: "100%" }]}>
                                                       {item.message}
                                                  </Text>
                                             </View>
                                        </View>)
                                   }}
                                   data={messages}
                              />
                              <View
                                   style={{
                                        height: 2,
                                        width: "100%",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                   }}
                              />
                              <View style={{ padding: 10, flexDirection: "row" }}>
                                   <TextInput
                                        style={[{
                                             flexGrow: 1,
                                             height: 32,
                                        }, styles.text]}
                                        placeholder={placeholder}
                                        onChangeText={(text) => { setInput(text) }}
                                        placeholderTextColor={colors.subtext}
                                        value={input}
                                   />
                                   <Pressable
                                        style={styles.sendBtn}
                                        onPress={sendMessage}
                                   >
                                        <Ionicons name="send" size={20} color="white" />
                                   </Pressable>
                              </View>
                         </View>
                    </KeyboardAvoidingView>
               </SafeAreaView>
          </LinearGradient >
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
     text: {
          fontFamily: "tex",
          color: "white",
          fontSize: 16,
     },
     sendBtn: {
          width: 32,
          height: 32,
          backgroundColor: "#813051",
          marginLeft: 10,
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center"
     }
});
