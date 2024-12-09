import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  liveData,
  useCurrentLeagueStore,
  userDataState,
} from "@/states/StoreStates";
import { MaterialIcons } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import * as Clipboard from "expo-clipboard";
import colors from "@/assets/colors";
import { database } from "@/js/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../type";
import { StackNavigationProp } from "@react-navigation/stack";

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;


export default function DraftTab() {
  const userData = userDataState((state) => state.userData);
  const userDataForCurrentLeague = userDataState(
    (state) => state.userDataForCurrentLeague
  );
  const currentLeagueData = useCurrentLeagueStore(
    (state) => state.currentLeagueData
  );
  const setCurrentLeagueData = useCurrentLeagueStore(
    (state) => state.setCurrentLeagueData
  );
  const currentLeagueID = useCurrentLeagueStore(
    (state) => state.currentLeagueID
  );
  const takenPlayers = liveData((state) => state.liveLeagueData);
  const [isCoppied, setIsCoppied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [usersInLeague, setUsersInLeague] = useState<any>([]);
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { width } = useWindowDimensions();

  useEffect(() => {
  }, [takenPlayers]);

  function generateUsersInLeague(leagueData: any) {
    let users = [];
    for (let i = 0; i < leagueData.numPlayers; i++) {
      let crown: any = [];

      if (leagueData.teamsPlaying[i]) {
        if (leagueData.teamsPlaying[i].isAdmin) {
          crown.push(
            <Foundation
              name="crown"
              size={16}
              color="#fdb640"
              style={{
                marginLeft: 5,
              }}
            />
          );
        } else {
          crown.push(null);
        }

        const playerId = leagueData.teamsPlaying[i].id || `player-${i}`;

        users.push(
          <View key={playerId}>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                },
                i != 0 ? { marginTop: 10 } : {},
              ]}
            >
              <Text style={styles.listText}>
                {i + 1}. {leagueData.teamsPlaying[i].playerName}
              </Text>
              {crown[0]}
            </View>
            {leagueData.seedGenerated ? (
              <Text style={{ fontFamily: "tex", color: colors.subtext }}>
                Draft Seed #{leagueData.teamsPlaying[i].seed}
              </Text>
            ) : (
              <Text style={{ fontFamily: "tex", color: colors.subtext }}>
                No seed generated yet
              </Text>
            )}
          </View>
        );
      } else {
        users.push(
          <Text key={`team-${i}`} style={[styles.listText, { marginTop: 10 }]}>
            {i + 1}. Team {i + 1}
          </Text>
        );
      }
    }
    return users;
  }

  useEffect(() => {
    setUsersInLeague(generateUsersInLeague(currentLeagueData));
  }, [currentLeagueData]);

  async function generateDraftSeeding() {
    const shuffledPlayers = [...currentLeagueData.teamsPlaying];
    let currentTeamsPlaying = [...currentLeagueData.teamsPlaying];
    let dataClone = { ...currentLeagueData };

    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[randomIndex]] = [
        shuffledPlayers[randomIndex],
        shuffledPlayers[i],
      ];
    }

    shuffledPlayers.forEach((player: any, index: number) => {
      player.seed = index + 1;
    });
    const response = await database
      .from("leagues")
      .update({ teamsPlaying: currentTeamsPlaying, seedGenerated: true })
      .eq("leagueID", currentLeagueID);
    dataClone.teamsPlaying = currentTeamsPlaying;
    dataClone.seedGenerated = true;
    setCurrentLeagueData(dataClone);
  }

  return (
    <View style={{ flexGrow: 1, width: "100%" }}>
      <View
        style={{
          paddingHorizontal: 37,
          width: "100%",
        }}
      >
        <View
          style={{
            marginTop: 23,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "tex",
                  fontSize: 16,
                  color: "rgba(255,255,255, 1)",
                }}
              >
                Invite friends to play
              </Text>
              <Text
                style={{
                  fontFamily: "tex",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Copy the link and share with your friends
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "tex",
                fontSize: 12,
                color: "rgba(255,255,255, 1)",
              }}
            >
              {currentLeagueData.teamsPlaying.length} /{" "}
              {currentLeagueData.numPlayers}
            </Text>
          </View>
          <View style={{ marginTop: 14 }}>
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
                {currentLeagueID}
              </Text>
              <Pressable
                style={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: "#0B1124",
                }}
                onPress={() => {
                  Clipboard.setString(currentLeagueID);
                  setIsCoppied(true);
                  setTimeout(() => {
                    setIsCoppied(false);
                  }, 1000);
                }}
              >
                {isCoppied ? (
                  <MaterialIcons name="check" size={24} color="white" />
                ) : (
                  <MaterialIcons name="content-copy" size={24} color="white" />
                )}
              </Pressable>
            </View>
          </View>
        </View>

        {currentLeagueData.teamsPlaying.length ===
          currentLeagueData.numPlayers && userDataForCurrentLeague.isAdmin ? (
          <View>
            <Text
              style={{
                color: "white",
                marginVertical: 20,
                fontFamily: "tex",
                fontSize: 16,
              }}
            >
              Begin Drafting
            </Text>
            <View style={width > 768 ? { flexDirection: "row" } : null}>
              <View
                style={[
                  {
                    padding: 10,
                    borderRadius: 10,
                  },
                  !currentLeagueData.seedGenerated
                    ? { backgroundColor: "#5A3EA1" }
                    : { backgroundColor: colors.subtext },
                  width > 768
                    ? { width: "50%", marginHorizontal: 5 }
                    : { width: "100%", marginBottom: 10 },
                ]}
              >
                {!currentLeagueData.seedGenerated ? (
                  <Pressable
                    onPress={() => {
                      generateDraftSeeding();
                    }}
                  >
                    <Text style={[styles.listText, { textAlign: "center" }]}>
                      Generate Seeding
                    </Text>
                  </Pressable>
                ) : (
                  <View>
                    <Text style={[styles.listText, { textAlign: "center" }]}>
                      Generate Seeding
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  {
                    padding: 10,
                    borderRadius: 10,
                  },
                  currentLeagueData.seedGenerated
                    ? { backgroundColor: "#5A3EA1" }
                    : { backgroundColor: colors.subtext },
                  width > 768
                    ? { width: "50%", marginHorizontal: 5 }
                    : { width: "100%" },
                ]}
              >
                {currentLeagueData.seedGenerated ? (
                  <Pressable onPress={() => {
                    navigation.navigate("Draft");
                    async function startDraft() {
                      await database.from("leagues").update({ isDrafting: true }).eq("leagueID", currentLeagueID);
                      const clDataClone = { ...currentLeagueData };
                      clDataClone.isDrafting = true;
                      setCurrentLeagueData(clDataClone);
                    }
                    startDraft();
                  }}>
                    <Text style={[styles.listText, { textAlign: "center" }]}>
                      Start Draft
                    </Text>
                  </Pressable>
                ) : (
                  <View>
                    <Text style={[styles.listText, { textAlign: "center" }]}>
                      Start Draft
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : null}
        <Text
          style={{
            color: "white",
            marginVertical: 20,
            fontFamily: "tex",
            fontSize: 16,
          }}
        >
          Teams in League
        </Text>
        <ScrollView
          style={{
            paddingHorizontal: 12,
            paddingVertical: 21,
            backgroundColor: "#574869",
            borderRadius: 10,
          }}
        >
          {usersInLeague}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listText: {
    color: "white",
    fontSize: 16,
    fontFamily: "tex",
  },
});
