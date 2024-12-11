import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ImageBackgroundComponent, SafeAreaView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { userDataState } from "@/states/StoreStates";
import { GiftedChat } from "react-native-gifted-chat";
import { database } from "@/js/supabaseClient";
import { SlideModal } from "./ModalComponent";
import Feather from '@expo/vector-icons/Feather';
import colors from "@/assets/colors";
import { TextInput } from "react-native-gesture-handler";

export default function PhoneChatScreen() {
     const uData = userDataState((state) => state.userData);
     const [friends, setFriends] = useState<any>({});
     const [showPlayers, setShowPlayers] = useState<boolean>(false);
     const [search, setSearch] = useState<string>("");
     const [responseMessage, setResponseMessage] = useState<string>();
     const [success, setSuccess] = useState<string>();

     useEffect(() => {
          console.log(uData);
     }, [uData])

     async function sendRequest() {
          const uDataClone = { ...uData };
          if (uData.friends.includes(search)) {
               setResponseMessage("You're already friends with this user");
               setSuccess("red");
          } else if (uData.friend_requests.outgoing.includes(search)) {
               setResponseMessage("You already sent a friend request to this user");
               setSuccess("red");
          } else {
               const userToAdd = await database.from("users").select("*").eq("username", search) as any;
               console.log(userToAdd);
               if (userToAdd.data.length === 0) {
                    setResponseMessage("User does not exist");
                    setSuccess("red");
               } else {
                    uDataClone.friend_requests.outgoing.push(search);
                    let currentToAddRequestsList = userToAdd?.data[0].friendRequests;
                    currentToAddRequestsList.recieved.push(uData.username);
                    const response = await database
                         .from("users")
                         .update({ friendRequests: currentToAddRequestsList })
                         .eq("username", search)
                         .select();
                    const response2 = await database.from("users").update({ friendRequests: uDataClone.friend_requests }).eq("username", uData.username);
                    setResponseMessage(`Sent friend request to ${search}`);
                    setSuccess("green");
               }
          }
     }

     return (
          <View>
               <Text style={{ fontFamily: "tex", fontSize: 16, color: "white", textAlign: "left", width: "100%" }}>
                    Messages
               </Text>
               <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Pressable style={{ backgroundColor: "#3c296c", padding: 8, borderRadius: "50%", aspectRatio: "1 / 1", marginRight: 10, height: 32 }}>
                         <Ionicons name="search" size={16} color="white" />
                    </Pressable>
                    <Pressable
                         style={{ backgroundColor: "#3c296c", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, flexGrow: 1, flexDirection: "row", alignItems: "center" }}
                         onPress={() => {
                              setShowPlayers(true)
                         }}
                    >
                         <Ionicons name="person-add" size={16} color="white" style={{ marginRight: 8 }} />
                         <Text style={{ fontFamily: "tex", fontSize: 16, color: "white" }}>Add Friend</Text>
                    </Pressable>
               </View>
               <SlideModal isOpen={showPlayers}>
                    <SafeAreaView style={{
                         backgroundColor: "rgb(46, 26, 71)",
                         width: "100%",
                         paddingVertical: 10,
                         height: "100%"
                    }}>
                         <Pressable onPress={() => setShowPlayers(false)} style={{ marginLeft: 10 }}>
                              <Feather name="arrow-left" size={24} color="white" />
                         </Pressable>
                         <View style={{ width: "70%", marginHorizontal: "auto" }}>
                              <Text style={{
                                   fontFamily: "tex",
                                   fontSize: 24,
                                   color: "white",
                                   textAlign: "center",
                                   marginVertical: 25
                              }}>Add by Username</Text>
                              <Text style={{
                                   fontFamily: "tex",
                                   fontSize: 12,
                                   color: colors.subtext,
                                   textAlign: "left",
                              }}>Who would you like to add?</Text>
                              <View
                                   style={{
                                        height: 32,
                                        width: "100%",
                                        backgroundColor: "rgb(87, 72, 105)",
                                        borderRadius: 20,
                                        paddingHorizontal: 10,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        marginTop: 10
                                   }}
                              >
                                   <TextInput
                                        style={[{ flexGrow: 1, marginLeft: 5, fontSize: 16, fontFamily: "tex", color: "white" }]}
                                        placeholder={"Search..."}
                                        placeholderTextColor={colors.subtext}
                                        onChangeText={(newText) => setSearch(newText)}
                                        value={search}
                                   ></TextInput>
                              </View>
                              <Text style={{
                                   fontFamily: "tex",
                                   fontSize: 12,
                                   color: success,
                                   textAlign: "left",
                                   marginVertical: 5
                              }}>{responseMessage}</Text>
                              <Pressable style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#813051", borderRadius: 20 }} onPress={() => { sendRequest() }}>
                                   <Text style={{ fontSize: 16, fontFamily: "tex", color: "white", textAlign: "center" }}>Send Friend Request</Text>
                              </Pressable>
                         </View>
                    </SafeAreaView>
               </SlideModal>
          </View>
     )
}