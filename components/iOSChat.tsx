import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { userDataState } from "@/states/StoreStates";
import { database } from "@/js/supabaseClient";
import { SlideModal } from "./ModalComponent";
import Feather from "@expo/vector-icons/Feather";
import colors from "@/assets/colors";
import { FlatList, TextInput } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

export default function PhoneChatScreen() {
  const uData = userDataState((state) => state.userData);
  const [friends, setFriends] = useState<any>({});
  const [showPlayers, setShowPlayers] = useState<boolean>(false);
  const [showRequests, setShowRequests] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [requestsNav, setRequestsNav] = useState<boolean>(false);
  const [navContainerWidth, setNavContainerWidth] = useState<number>(0);
  const [requestsContainerWidth, setRequestsContainerWidth] =
    useState<number>(0);

  const left = useSharedValue(2);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    left: left.value,
  }));
  const animatedXStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    // navbar for requests styling
    const toValue = navContainerWidth * 0.5;

    left.value = withTiming(requestsNav ? toValue - 2 : 2, {
      duration: 400,
    });
    translateX.value = withTiming(requestsNav ? -requestsContainerWidth : 0, {
      duration: 400,
    });
  }, [requestsNav]);

  async function handleRequests(user: string, accepted: boolean) {
    console.log(accepted);
    const uDataClone = { ...uData };
    if (accepted) {
      const userToAdd = (await database
        .from("users")
        .select("*")
        .eq("username", user)) as any;

      const friendsList = userToAdd.data[0].friends;
      friendsList.push(uData.username);
      uDataClone.friends.push(user);

      const response = await database
        .from("users")
        .update({ friends: friendsList })
        .eq("username", user)
        .select();
      const response2 = await database
        .from("users")
        .update({ friends: uDataClone.friends })
        .eq("username", uData.username);
    }

    const userToRemoveIndex = uDataClone.friendRequests.outgoing.indexOf(user);
    uDataClone.friendRequests.recieved.splice(userToRemoveIndex, 1);

    const userToRemove = (await database
      .from("users")
      .select("*")
      .eq("username", user)) as any;
    let currentToAddRequestsList = userToRemove.data[0].friendRequests;
    console.log(currentToAddRequestsList);
    const requestToRemoveIndex = currentToAddRequestsList.outgoing.indexOf(
      uData.username
    );
    currentToAddRequestsList.outgoing.splice(requestToRemoveIndex, 1);

    const response = await database
      .from("users")
      .update({ friendRequests: currentToAddRequestsList })
      .eq("username", user)
      .select();
    const response2 = await database
      .from("users")
      .update({ friendRequests: uDataClone.friendRequests })
      .eq("username", uData.username);
  }

  async function deleteRequest(user: string) {
    const uDataClone = { ...uData };
    const userToRemoveIndex = uDataClone.friendRequests.outgoing.indexOf(user);
    uDataClone.friendRequests.outgoing.splice(userToRemoveIndex, 1);

    const userToRemove = (await database
      .from("users")
      .select("*")
      .eq("username", user)) as any;
    let currentToAddRequestsList = userToRemove.data[0].friendRequests;
    console.log(currentToAddRequestsList);
    const requestToRemoveIndex = currentToAddRequestsList.recieved.indexOf(
      uData.username
    );
    currentToAddRequestsList.recieved.splice(requestToRemoveIndex, 1);

    const response = await database
      .from("users")
      .update({ friendRequests: currentToAddRequestsList })
      .eq("username", user)
      .select();
    const response2 = await database
      .from("users")
      .update({ friendRequests: uDataClone.friendRequests })
      .eq("username", uData.username);
  }

  async function sendRequest() {
    const uDataClone = { ...uData };
    if (uData.friends.includes(search)) {
      setResponseMessage("You're already friends with this user");
      setSuccess("red");
    } else if (uData.friendRequests.outgoing.includes(search)) {
      setResponseMessage("You already sent a friend request to this user");
      setSuccess("red");
    } else {
      const userToAdd = (await database
        .from("users")
        .select("*")
        .eq("username", search)) as any;
      if (userToAdd.data.length === 0) {
        setResponseMessage("User does not exist");
        setSuccess("red");
      } else {
        uDataClone.friendRequests.outgoing.push(search);
        let currentToAddRequestsList = userToAdd?.data[0].friendRequests;
        currentToAddRequestsList.recieved.push(uData.username);
        const response = await database
          .from("users")
          .update({ friendRequests: currentToAddRequestsList })
          .eq("username", search)
          .select();
        const response2 = await database
          .from("users")
          .update({ friendRequests: uDataClone.friendRequests })
          .eq("username", uData.username);
        setResponseMessage(`Sent friend request to ${search}`);
        setSuccess("green");
      }
    }
  }

  return (
    <View>
      <Text
        style={{
          fontFamily: "tex",
          fontSize: 16,
          color: "white",
          textAlign: "left",
          width: "100%",
        }}
      >
        Messages
      </Text>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Pressable style={styles.navButton}>
          <Ionicons name="search" size={16} color="white" />
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() => {
            setShowRequests(true);
          }}
        >
          <Feather name="mail" size={16} color="white" />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#3c296c",
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 20,
            flexGrow: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            setShowPlayers(true);
          }}
        >
          <Ionicons
            name="person-add"
            size={16}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontFamily: "tex", fontSize: 16, color: "white" }}>
            Add Friend
          </Text>
        </Pressable>
      </View>
      <SlideModal isOpen={showPlayers}>
        <SafeAreaView
          style={{
            backgroundColor: "rgb(46, 26, 71)",
            width: "100%",
            paddingVertical: 10,
            height: "100%",
          }}
        >
          <Pressable
            onPress={() => setShowPlayers(false)}
            style={{ marginLeft: 10 }}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </Pressable>
          <View
            style={{
              width: "70%",
              marginHorizontal: "auto",
              flexGrow: 1,
            }}
          >
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 24,
                color: "white",
                textAlign: "center",
                marginVertical: 25,
              }}
            >
              Add by Username
            </Text>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 12,
                color: colors.subtext,
                textAlign: "left",
              }}
            >
              Who would you like to add?
            </Text>
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
                marginTop: 10,
              }}
            >
              <TextInput
                style={[
                  {
                    flexGrow: 1,
                    marginLeft: 5,
                    fontSize: 16,
                    fontFamily: "tex",
                    color: "white",
                  },
                ]}
                placeholder={"Search..."}
                placeholderTextColor={colors.subtext}
                onChangeText={(newText) => setSearch(newText)}
                value={search}
              ></TextInput>
            </View>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 12,
                color: success,
                textAlign: "left",
                marginVertical: 5,
              }}
            >
              {responseMessage}
            </Text>
            <Pressable
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "#813051",
                borderRadius: 20,
              }}
              onPress={() => {
                sendRequest();
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "tex",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Send Friend Request
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SlideModal>
      <SlideModal isOpen={showRequests}>
        <SafeAreaView
          style={{
            backgroundColor: "rgb(46, 26, 71)",
            width: "100%",
            paddingVertical: 10,
            height: "100%",
          }}
        >
          <Pressable
            onPress={() => setShowRequests(false)}
            style={{ marginLeft: 10 }}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </Pressable>
          <View style={{ width: "70%", marginHorizontal: "auto" }}>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 24,
                color: "white",
                textAlign: "center",
                marginVertical: 25,
              }}
            >
              Friend Requests
            </Text>
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                backgroundColor: "#3c296c",
                borderRadius: 30,
                position: "relative",
              }}
              onLayout={(event) => {
                const width = event.nativeEvent.layout.width;
                setNavContainerWidth(width);
              }}
            >
              <Pressable
                style={{
                  width: "50%",
                  zIndex: 2,
                }}
                onPress={() => {
                  setRequestsNav(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "tex",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Received
                </Text>
              </Pressable>
              <Pressable
                style={{
                  width: "50%",
                  zIndex: 2,
                }}
                onPress={() => {
                  setRequestsNav(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "tex",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Outgoing
                </Text>
              </Pressable>
              <Animated.View
                style={[
                  {
                    width: "50%",
                    backgroundColor: "#5A3EA1",
                    position: "absolute",
                    borderRadius: "inherit",
                    top: "50%",
                    transform: [{ translateY: "-50%" }],
                    height: "90%",
                  },
                  animatedStyle,
                ]}
              ></Animated.View>
            </View>
            <View
              style={{ flex: 1, overflow: "hidden", flexDirection: "row" }}
              onLayout={(event) => {
                const width = event.nativeEvent.layout.width;
                setRequestsContainerWidth(width);
              }}
            >
              <Animated.View
                style={[
                  { flexDirection: "row", width: "100%" },
                  animatedXStyle,
                ]}
              >
                <View style={{ width: "100%" }}>
                  <FlatList
                    data={uData.friendRequests.recieved}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={{ padding: 10 }}>
                        <Text style={styles.text}>
                          {item} sent you a friend request!
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Pressable
                            style={styles.navButton}
                            onPress={() => {
                              handleRequests(item, true);
                            }}
                          >
                            <Feather name="check" size={16} color="green" />
                          </Pressable>
                          <Pressable
                            style={styles.navButton}
                            onPress={() => {
                              handleRequests(item, false);
                            }}
                          >
                            <Feather name="x" size={16} color="red" />
                          </Pressable>
                        </View>
                      </View>
                    )}
                    contentContainerStyle={
                      uData.friendRequests.recieved.length === 0
                        ? { flexGrow: 1 }
                        : null
                    }
                    ListEmptyComponent={
                      <View
                        style={{
                          margin: "auto",
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Svg>
                          <Path
                            d="M85.44,31.72l-14.69-10.67-18.57-13.47c-4.03-2.92-10.33-2.92-14.36,0l-18.56,13.47-14.14,10.26c-2.81,2.04-5.12,6.56-5.12,10.04v42.08c0,2.36.89,4.51,2.35,6.16.06.13.12.25.22.36.17.2.37.35.6.45,1.64,1.45,3.79,2.34,6.15,2.34h71.38c2.36,0,4.52-.89,6.16-2.35.22-.1.43-.24.59-.44.09-.11.16-.24.21-.36,1.46-1.64,2.35-3.8,2.35-6.16v-42.77c0-3.16-2-7.09-4.56-8.95ZM58.16,64.03c-.66-.54-.66-1.55,0-2.09l8.45-6.89,19.91-16.23c.19.64.3,1.26.3,1.83v42.77c0,.46-.05.92-.15,1.35-.22.96-1.4,1.35-2.16.72l-26.34-21.47ZM6.43,34.3l14.7-10.67s0,0,0,0l17.77-12.9c3.36-2.44,8.85-2.44,12.2,0l17.77,12.9s0,0,0,0l14.69,10.67c.19.13.37.29.54.46.57.56.52,1.5-.1,2l-19.42,15.83-9.39,7.65c-.49.4-1.2.4-1.7,0l-.67-.55c-4.31-3.51-11.36-3.51-15.67,0l-.67.55c-.49.4-1.2.4-1.7,0l-9.39-7.65-19.42-15.83c-.62-.5-.67-1.45-.1-2,.18-.17.36-.33.55-.46ZM5.5,85.5c-.77.63-1.94.24-2.16-.72-.1-.43-.15-.89-.15-1.35v-42.77c0-.57.11-1.19.3-1.83l19.91,16.23,8.45,6.89c.66.54.66,1.55,0,2.09l-26.34,21.47ZM9.31,89.55s-.02,0-.03,0c-1.23,0-1.74-1.61-.78-2.39l31.53-25.7c2.7-2.2,7.25-2.2,9.95,0l31.53,25.7c.95.78.45,2.38-.78,2.39-.01,0-.02,0-.03,0,0,0-71.38,0-71.38,0Z"
                            fill={"white"}
                          />
                          <Path
                            fill="none"
                            stroke={"#b3b3b3"}
                            d="M37.05,59.19c-.25-.22-.5-.44-.75-.66"
                          />
                          <Path
                            fill="none"
                            stroke={"#b3b3b3"}
                            strokeDasharray={1.98}
                            d="M34.85,57.18c-11.11-10.76-15.65-25.03-12.28-34.55,2.41-6.79,7.05-8.77,7.05-8.77.86-.38,4.06-1.81,6.37,0,3.75,2.93,4.01,13.42,0,18.95-4.42,6.09-13.33,5.24-18.14,0-5.22-5.7-6.18-17.24-1.03-26.48"
                          />
                          <Path
                            fill="none"
                            stroke={"#b3b3b3"}
                            d="M17.32,5.47c.17-.28.35-.57.54-.84"
                          />
                          <Path
                            fill={"white"}
                            d="M21.01,4.47c.02-.79-.15-2.1-.28-2.74.02-.02.04-.05.06-.08.19-.32.02-.78-.37-1.07l.2-.35c.1-.17-.17-.33-.27-.15l-.2.35c-.45-.2-.93-.12-1.12.21-.02.03-.03.06-.04.09-.62.21-1.84.7-2.52,1.12-.12.07-.25.16-.28.3-.04.18.09.34.24.45.35.28.8.42,1.25.45.02.44.21.82.55,1.02s.76.17,1.15-.03c.25.38.59.69,1.01.86.17.07.38.1.51-.02.1-.1.11-.25.12-.4Z"
                          />
                        </Svg>
                      </View>
                    }
                  />
                </View>
                <View style={{ width: "100%", height: "100%" }}>
                  <FlatList
                    data={uData.friendRequests.outgoing}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={{ padding: 10 }}>
                        <Text style={styles.text}>
                          You sent a friend request to {item}.
                        </Text>
                        <View>
                          <Pressable
                            style={styles.navButton}
                            onPress={() => {
                              deleteRequest(item);
                            }}
                          >
                            <Feather name="x" size={16} color="red" />
                          </Pressable>
                        </View>
                      </View>
                    )}
                  />
                </View>
              </Animated.View>
            </View>
          </View>
        </SafeAreaView>
      </SlideModal>
    </View>
  );
}

const styles = StyleSheet.create({
  navButton: {
    backgroundColor: "#3c296c",
    padding: 8,
    borderRadius: "50%",
    marginRight: 10,
    height: 32,
    width: 32,
  },
  text: {
    fontSize: 16,
    color: "white",
    fontFamily: "tex",
  },
});
