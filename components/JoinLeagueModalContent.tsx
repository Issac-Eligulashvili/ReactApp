import React, { useState } from "react";
import {
  allLeaguesData,
  useCurrentLeagueStore,
  useModalStore,
  userDataState,
} from "@/states/StoreStates";
import { database } from "@/js/supabaseClient";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "./type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type LeagueData = {
  "league-name": string;
  leagueID: string;
  numPlayers: number;
  teamsPlaying: any[];
  availablePlayers: string[];
  isDrafted: boolean;
};

export default function JoinLeagueModalContent() {
  const [text, onChangeText] = React.useState("");
  const [isFocused, setIsFocused] = useState(false);
  const setIsOpened = useModalStore((state) => state.setIsOpened);
  const userData = userDataState((state) => state.userData);
  const setLeaguesData = allLeaguesData((state) => state.setLeaguesData);
  const leaguesData = allLeaguesData((state) => state.fetchedLeagues);
  const setCurrentLeagueData = useCurrentLeagueStore(
    (state) => state.setCurrentLeagueData
  );
  const setCurrentLeagueID = useCurrentLeagueStore(
    (state) => state.setCurrentLeagueID
  );
  const setIsPicked = useModalStore((state) => state.setIsPicked);
  const [isJoined, setIsJoined] = useState(false);
  const navigation = useNavigation<AuthScreenNavigationProp>();
  async function joinLeague() {
    const response = await database
      .from("leagues")
      .select("*")
      .eq("leagueID", text);

    if (response.error) {
      alert("There was an error joining the league");
      throw new Error(response.error.message);
    }

    let leaugeJoiningData = response.data[0] as LeagueData;
    let teamsPlaying = leaugeJoiningData?.teamsPlaying;
    let index = teamsPlaying.findIndex((p: any) => p.playerID === userData.id);
    if (index === -1) {
      setIsJoined(false);
      teamsPlaying.push({
        playerID: userData.id,
        playerName: userData.username,
        team: { starters: [], bench: [] },
        isAdmin: false,
        wins: 0,
        losses: 0,
      });

      leaugeJoiningData.teamsPlaying = teamsPlaying;

      const response2 = await database
        .from("leagues")
        .update({ teamsPlaying: teamsPlaying })
        .eq("leagueID", text);

      let currentLeaguesData = leaguesData;
      currentLeaguesData.push(leaugeJoiningData);
      setCurrentLeagueID(text);
      setLeaguesData(currentLeaguesData);
      setCurrentLeagueData(leaugeJoiningData);
    } else {
      setIsJoined(true);
      throw new Error("User is already in leauge");
    }
  }

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
            setIsPicked(null);
          }}
        >
          <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>Step 1 of 1</Text>
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

      {!isJoined ? (
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
            Enter Leauge ID
          </Text>
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
            placeholder="Enter League ID"
            onChangeText={onChangeText}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
          />
        </>
      ) : (
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
            You're already in this league!
          </Text>
          <Pressable
            style={[styles.btn, { marginTop: 20 }]}
            onPress={() => {
              setIsOpened(false);
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
              CLOSE
            </Text>
          </Pressable>
        </>
      )}
      {!isJoined ? (
        <Pressable
          style={[styles.btn, { marginTop: 20 }]}
          onPress={async () => {
            try {
              await joinLeague().then(() => {
                if (!isJoined) {
                  setIsOpened(false);
                  navigation.navigate("Leagues");
                }
              });
            } catch (err) { }
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
            JOIN
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 7,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
