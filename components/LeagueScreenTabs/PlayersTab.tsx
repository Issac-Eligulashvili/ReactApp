import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LogoSVGComponent } from "../FetchLeagueSVG";
import colors from "@/assets/colors";
import { positionAbbriviations, positionIcons } from "@/assets/positionIcons";
import Foundation from "@expo/vector-icons/Foundation";
import { useCurrentLeagueStore, userDataState } from "@/states/StoreStates";
import { database } from "@/js/supabaseClient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const navOrder = [
  "All",
  "IGL",
  "Duelist",
  "Initiator",
  "Sentinel",
  "Flex",
  "Controller",
];

export default function PlayersTab() {
  const userData = userDataState((state) => state.userData);
  const userDataForCL = userDataState(
    (state) => state.userDataForCurrentLeague
  );
  const setUserDataForCurrentLeague = userDataState(
    (state) => state.setUserDataForCurrentLeague
  );
  const currentLeagueData = useCurrentLeagueStore(
    (state) => state.currentLeagueData
  );
  const currentLeagueID = useCurrentLeagueStore(
    (state) => state.currentLeagueID
  );
  const [currentFilter, setCurrentFilter] = useState("All");
  const [filteredArray, setFilteredArray] = useState<any>(
    currentLeagueData["available_players"]
  );

  useEffect(() => {
    async function setCurrentPlayers() {
      if (currentFilter === "All") {
        const playerData = await database
          .from("players")
          .select("*")
          .in("player", currentLeagueData["available_players"]);
        if (playerData.data) {
          setFilteredArray(playerData.data);
        }
      } else {
        const playerData = await database
          .from("players")
          .select("*")
          .in("position", [currentFilter]);
        if (playerData.data) {
          setFilteredArray(playerData.data);
        }
      }
    }
    setCurrentPlayers();
  }, [currentFilter]);

  async function addPlayer(player: any) {
    const playerData = await database.from("players").select();
    let currentAvailPlayers = currentLeagueData["available_players"];

    let starters = userDataForCL.team.starters;
    let bench = userDataForCL.team.bench;

    let maxPlayers = 1;

    if (player.position === "Flex") {
      maxPlayers = 2;
    }
    const startersData = playerData?.data?.filter((p: any) => {
      return starters.includes(p.player);
    });

    const arr = startersData?.filter((p: any) => {
      return p.position === player.position;
    });

    if (arr?.length === maxPlayers && bench.length <= 2) {
      bench.push(player.player);
    } else {
      starters.push(player.player);
    }
    let currentData = userDataForCL;
    currentData.team.starters = starters;
    currentData.team.bench = bench;
    setUserDataForCurrentLeague(currentData);
    const currentTeamsPlaying = currentLeagueData.teamsPlaying;
    const playerTeamIndex = currentTeamsPlaying.findIndex((player: any) => {
      return player.playerID === userData.id;
    });
    currentTeamsPlaying[playerTeamIndex].team.starters = starters;
    currentTeamsPlaying[playerTeamIndex].team.bench = bench;

    const response = await database
      .from("leagues")
      .update({ teamsPlaying: currentTeamsPlaying })
      .eq("leagueID", currentLeagueID);

    const playerIndex = currentAvailPlayers.findIndex((p: any) => {
      p === player;
    });
  }

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          marginVertical: 20,
        }}
      >
        {navOrder.map((nav, index) => (
          <Pressable
            key={index}
            style={{ padding: 10 }}
            onPress={() => {
              setCurrentFilter(nav);
            }}
          >
            <View
              style={[
                {
                  backgroundColor: colors[nav as keyof typeof colors],
                },
                styles.positionBox,
              ]}
            >
              {positionIcons[nav as keyof typeof positionIcons] != null ? (
                <Image
                  source={positionIcons[nav as keyof typeof positionIcons]}
                  style={styles.positionImage}
                />
              ) : (
                <Foundation name="torsos-all" size={32} color="white" />
              )}
            </View>
            <Text style={styles.navText}>
              {" "}
              {positionAbbriviations[
                nav as keyof typeof positionAbbriviations
              ] ?? nav}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filteredArray}
        keyExtractor={(player) => player.player}
        renderItem={({ item, index }) => (
          <View
            style={[
              {
                height: 32,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              },
              index === 0 ? {} : { marginTop: 15 },
            ]}
            key={index}
          >
            <Pressable
              style={{ marginRight: 10 }}
              onPress={() => {
                addPlayer(item);
              }}
            >
              <MaterialIcons
                name="add-circle-outline"
                size={24}
                color="white"
              />
            </Pressable>
            <Text style={styles.text}>{index + 1}</Text>
            <View style={{ marginHorizontal: 16 }}>
              <View style={styles.playerImageContainer}>
                {item?.image_link?.substring(0, 2) === "//" ? (
                  <Image
                    source={{ uri: `https:${item?.image_link}` }}
                    style={styles.playerImage}
                  />
                ) : (
                  <Image
                    source={require("@/assets/img/base/ph/sil.png")}
                    style={styles.playerImage}
                  />
                )}
              </View>
              <LogoSVGComponent
                uri={`https://issac-eligulashvili.github.io/logo-images/${item?.team}.svg`}
                style={{
                  height: 20,
                  width: 20,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  transform: [{ translateX: "25%" }, { translateY: "25%" }],
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              <View>
                <Text
                  style={
                    item.player != "Empty" ? [styles.playerName] : styles.empty
                  }
                >
                  {item.player}
                </Text>
                {item.player != "Empty" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: -4,
                    }}
                  >
                    <Text
                      style={[
                        styles.playerInfoText,
                        {
                          color: colors[item?.position as keyof typeof colors],
                        },
                      ]}
                    >
                      {positionAbbriviations[
                        item?.position as keyof typeof positionAbbriviations
                      ]?.toUpperCase()}{" "}
                    </Text>
                    <Text style={[styles.playerInfoText, { color: "#ABABAB" }]}>
                      • {item?.teamAbbr}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={item.points != null ? [styles.playerName] : styles.empty}
              >
                {item?.points ?? "-"}
              </Text>
            </View>
          </View>
        )}
        style={{ flexGrow: 1, width: "100%", padding: 10 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  playerImage: {
    height: 32,
    width: 32,
  },
  playerImageContainer: {
    height: 32,
    width: 32,
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "white",
    position: "relative",
  },
  positionBox: {
    height: 32,
    width: 32,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  positionImage: {
    height: 14,
    width: 14,
  },
  navText: {
    color: "white",
    fontFamily: "The-Bold-Font",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
    alignSelf: "flex-start",
    margin: "auto",
  },
  playerName: {
    fontFamily: "tex",
    color: "white",
    fontSize: 16,
  },
  empty: {
    fontFamily: "tex",
    color: colors.subtext,
    fontSize: 16,
  },
  playerInfoText: {
    fontFamily: "tex",
    fontSize: 8,
  },
  text: {
    fontFamily: "tex",
    color: "white",
    fontSize: 16,
  },
});
