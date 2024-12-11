import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  allLeaguesData,
  useCurrentLeagueStore,
  useModalStore,
  useModalDropdownStore,
} from "@/states/StoreStates";
import NumTeamsDropdown from "./NumTeamsDropdown";
import { database } from "@/js/supabaseClient";
import { userDataState } from "@/states/StoreStates";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./type";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Clipboard from "expo-clipboard";
import { navigation as n } from "@/states/StoreStates";

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

function CreateLeaugeModalContent() {
  const [text, onChangeText] = React.useState("");
  const [isFocused, setIsFocused] = useState(false);
  const setIsOpened = useModalStore((state) => state.setIsOpened);
  const userData = userDataState((state) => state.userData);
  const [leagueCreatedID, setLeagueCreatedID] = useState("");
  const [currentStep, setCurrentStep] = React.useState(1);
  const selectedValue = useModalDropdownStore((state) => state.selectedValue);
  const setLeaguesData = allLeaguesData((state) => state.setLeaguesData);
  const leaguesData = allLeaguesData((state) => state.fetchedLeagues);
  const setCurrentLeagueData = useCurrentLeagueStore(
    (state) => state.setCurrentLeagueData
  );
  const setCurrentLeagueID = useCurrentLeagueStore(
    (state) => state.setCurrentLeagueID
  );
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const progressAnim = useRef(new Animated.Value(1)).current;
  const setIsPicked = useModalStore((state) => state.setIsPicked);
  const [isCoppied, setIsCoppied] = useState(false);
  const setPreviousScreen = n((state) => state.setPreviousScreen);

  async function createLeague() {
    const id = userData?.id;
    const username = userData?.username;

    let availablePlayers = await database.from("players").select("player");
    let available_players: { player: any }[] = [];

    availablePlayers?.data?.forEach((player) => {
      available_players.push(player.player);
    });

    const response = await database
      .from("leagues")
      .insert({
        "league-name": text,
        numPlayers: selectedValue,
        teamsPlaying: [
          {
            playerID: id,
            playerName: username,
            team: { starters: [], bench: [] },
            isAdmin: true,
            wins: 0,
            losses: 0,
          },
        ],
        available_players: available_players,
      })
      .select();

    if (response.error) {
      alert("There was an error creating your league. Please try again");
    } else {
      setLeagueCreatedID(response.data[0].leagueID);
      setCurrentLeagueID(response.data[0].leagueID);

      const response2 = await database
        .from("leagues")
        .select("")
        .eq("leagueID", response.data[0].leagueID);

      if (!response2.error) {
        setCurrentLeagueData(response2.data[0]);
      }

      const data = leaguesData;

      data.push({
        leagueID: response.data[0].leagueID,
        "league-name": text,
        numPlayers: selectedValue,
        teamsPlaying: [
          {
            playerID: id,
            playerName: username,
            team: {
              bench: [],
              starters: [],
            },
            isAdmin: true,
            wins: 0,
            losses: 0,
          },
        ],
        available_players: available_players,
      });

      setLeaguesData(data);
    }
  }

  const updateProgress = (step: number) => {
    const progress = (step / 3) * 100; // Calculate percentage
    Animated.timing(progressAnim, {
      toValue: progress, // Directly use the calculated progress
      duration: 300, // Animation duration in ms
      useNativeDriver: false, // Use false for width animations
    }).start();
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 24,
                color: "#fff",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Name Your League
            </Text>
            <View style={{ padding: 10 }}>
              <TextInput
                style={[
                  {
                    padding: 10,
                    color: "rgba(255,255,255,0.8);",
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    borderWidth: 0,
                  },
                  isFocused && {
                    borderBottomColor: "#FFD700",
                    color: "#fff",
                  },
                ]}
                placeholder="Enter League Name"
                onChangeText={onChangeText}
                onFocus={() => {
                  setIsFocused(true);
                }}
                onBlur={() => setIsFocused(false)}
              />
              <Pressable
                style={[styles.btn, { marginTop: 20 }]}
                onPress={() => {
                  const newStep = currentStep + 1;
                  setCurrentStep(newStep);
                  updateProgress(newStep);
                }}
              >
                <Text
                  style={{
                    fontFamily: "tex",
                    fontSize: 16,
                    letterSpacing: 2,
                    textAlign: "center",
                  }}
                >
                  NEXT
                </Text>
              </Pressable>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 24,
                color: "#fff",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Choose Number of Players
            </Text>
            <View style={{ padding: 10 }}>
              <NumTeamsDropdown />
              <Pressable
                style={[styles.btn, { marginTop: 20 }]}
                onPress={async () => {
                  const newStep = currentStep + 1;
                  setCurrentStep(newStep);
                  updateProgress(newStep);
                  await createLeague();
                }}
              >
                <Text
                  style={{
                    fontFamily: "tex",
                    fontSize: 16,
                    letterSpacing: 2,
                    textAlign: "center",
                  }}
                >
                  CREATE LEAGUE
                </Text>
              </Pressable>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 24,
                color: "#fff",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Share with Your Friends!
            </Text>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "rgb(87, 72, 105)",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "tex",
                    overflow: "hidden",
                    flex: 1,
                    fontSize: 16,
                  }}
                  numberOfLines={1}
                >
                  {leagueCreatedID}
                </Text>
                <Pressable
                  style={{
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: "#0B1124",
                  }}
                  onPress={() => {
                    Clipboard.setString(leagueCreatedID);
                    setIsCoppied(true);
                    setTimeout(() => {
                      setIsCoppied(false);
                    }, 1000);
                  }}
                >
                  {isCoppied ? (
                    <MaterialIcons name="check" size={24} color="white" />
                  ) : (
                    <MaterialIcons
                      name="content-copy"
                      size={24}
                      color="white"
                    />
                  )}
                </Pressable>
              </View>
              <Pressable
                style={[styles.btn, { marginTop: 20 }]}
                onPress={() => {
                  setIsOpened(false);
                  setPreviousScreen("Leagues");
                  navigation.navigate("Leagues");
                }}
              >
                <Text
                  style={{
                    fontFamily: "tex",
                    fontSize: 16,
                    letterSpacing: 2,
                    textAlign: "center",
                  }}
                >
                  DONE
                </Text>
              </Pressable>
            </View>
          </>
        );
    }
  };

  updateProgress(currentStep);

  return (
    <View
      style={{
        backgroundColor: "#2E1A47",
        padding: 20,
        borderRadius: 10,
        width: "80%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => {
            if (currentStep > 1) {
              const newStep = currentStep - 1;
              setCurrentStep(newStep);
              updateProgress(newStep);
            } else {
              setIsPicked(null);
            }
          }}
        >
          <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>Step {currentStep} of 3</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressIndicator,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"], // Map progress to width
                  }),
                },
              ]}
            />
          </View>
        </View>
        <Pressable
          onPress={() => {
            setIsOpened(false);
            setIsPicked(null);
          }}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>
      </View>
      {renderStepComponent()}
    </View>
  );
}

export default CreateLeaugeModalContent;

const styles = StyleSheet.create({
  btn: {
    padding: 7,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    width: "50%",
    marginTop: 8,
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 10,
  },
});
