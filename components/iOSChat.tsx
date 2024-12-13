import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image } from "react-native";
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
import { RootStackParamList } from "./type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

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
  const navigation = useNavigation<AuthScreenNavigationProp>();


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
      <FlatList
        data={uData.friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable style={{ padding: 10, borderRadius: 8 }} onPress={() => { navigation.navigate("Chat", { name: item }) }}>
            <Text style={styles.text}>{item}</Text>
          </Pressable>
        )}
        style={{ marginTop: 20 }}
      />
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
          <View style={{ width: "70%", marginHorizontal: "auto", flexGrow: 1 }}>
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
                  marginVertical: 10
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
                  marginVertical: 10
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
                    borderRadius: 30,
                    top: "50%",
                    transform: [{ translateY: "-50%" }],
                    height: "90%",
                  },
                  animatedStyle,
                ]}
              />
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
                        <Image source={require("../assets/img/emptyMail.png")} style={{ height: "50%", resizeMode: 'contain', aspectRatio: "448 / 561" }} />
                        <Text style={[styles.text, { marginTop: 5 }]}>You have no current requests</Text>
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
