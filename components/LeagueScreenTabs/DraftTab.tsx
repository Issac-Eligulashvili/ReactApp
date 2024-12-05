import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useCurrentLeagueStore, userDataState } from "@/states/StoreStates";
import { MaterialIcons } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import * as Clipboard from "expo-clipboard";

export default function DraftTab() {
  const userData = userDataState((state) => state.userData);
  const userDataForCurrentLeague = userDataState(
    (state) => state.userDataForCurrentLeague
  );
  const currentLeagueData = useCurrentLeagueStore(
    (state) => state.currentLeagueData
  );
  const currentLeagueID = useCurrentLeagueStore(
    (state) => state.currentLeagueID
  );
  const [isCoppied, setIsCoppied] = useState(false);

  let players = [];

  for (let i = 0; i < currentLeagueData.numPlayers; i++) {
    let crown: any = [];

    if (currentLeagueData.teamsPlaying[i]) {
      if (currentLeagueData.teamsPlaying[i].isAdmin) {
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

      const playerId = currentLeagueData.teamsPlaying[i].id || `player-${i}`;

      players.push(
        <View
          key={playerId}
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
            },
            i != 0 ? { marginTop: 10 } : {},
          ]}
        >
          <Text style={styles.listText}>
            {i + 1}. {currentLeagueData.teamsPlaying[i].playerName}
          </Text>
          {crown[0]}
        </View>
      );
    } else {
      players.push(
        <Text key={`team-${i}`} style={[styles.listText, { marginTop: 10 }]}>
          {i + 1}. Team {i + 1}
        </Text>
      );
    }
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
          <View
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: "#5A3EA1",
              borderRadius: 10,
            }}
          >
            <Pressable style={{}}>
              <Text style={[styles.listText, { textAlign: "center" }]}>
                Start Draft
              </Text>
            </Pressable>
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
          {players}
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
