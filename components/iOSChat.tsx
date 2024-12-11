import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { userDataState } from "@/states/StoreStates";
import { database } from "@/js/supabaseClient";
import { SlideModal } from "./ModalComponent";
import Feather from "@expo/vector-icons/Feather";
import colors from "@/assets/colors";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function PhoneChatScreen() {
  const uData = userDataState((state) => state.userData);
  const [friends, setFriends] = useState<any>({});
  const [showPlayers, setShowPlayers] = useState<boolean>(false);
  const [showRequests, setShowRequests] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [requestsNav, setRequestsNav] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const translateX = useSharedValue(2);

  function animateNavTab() {
    const toValue = containerWidth * 0.5;

    translateX.value = withTiming(requestsNav ? toValue - 2 : 2, {
      duration: 1000,
    });
    setRequestsNav(!requestsNav);
  }

  useEffect(() => {
    console.log(uData);
  }, [uData]);

  async function sendRequest() {
    const uDataClone = { ...uData };
    if (uData.friends.includes(search)) {
      setResponseMessage("You're already friends with this user");
      setSuccess("red");
    } else if (uData.friend_requests.outgoing.includes(search)) {
      setResponseMessage("You already sent a friend request to this user");
      setSuccess("red");
    } else {
      const userToAdd = (await database
        .from("users")
        .select("*")
        .eq("username", search)) as any;
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
        const response2 = await database
          .from("users")
          .update({ friendRequests: uDataClone.friend_requests })
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
                setContainerWidth(width);
              }}
            >
              <Pressable
                style={{
                  width: "50%",
                  zIndex: 2,
                }}
                onPress={() => {
                  animateNavTab();
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
              <Pressable
                style={{
                  width: "50%",
                  zIndex: 2,
                }}
                onPress={() => {
                  animateNavTab();
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
                  Recieved
                </Text>
              </Pressable>
              <Animated.View
                style={{
                  width: "50%",
                  backgroundColor: "#5A3EA1",
                  position: "absolute",
                  borderRadius: "inherit",
                  top: "50%",
                  transform: [{ translateY: "-50%" }],
                  left: translateX.value,
                  height: "90%",
                }}
              ></Animated.View>
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
    aspectRatio: "1 / 1",
    marginRight: 10,
    height: 32,
  },
});
