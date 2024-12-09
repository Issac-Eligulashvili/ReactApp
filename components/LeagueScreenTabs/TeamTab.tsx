import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  useCurrentLeagueStore,
  userDataState,
  liveData,
  useModalStore,
} from "@/states/StoreStates";
import Feather from "@expo/vector-icons/Feather";
import Svg, { Path } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "@/assets/colors";
import { positionIcons, positionAbbriviations } from "@/assets/positionIcons";
import { SlideModal } from "../ModalComponent";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LogoSVGComponent } from "../FetchLeagueSVG";
import { database } from "@/js/supabaseClient";

type Player = {
  position: string;
  player: string;
  image_link: string;
  team: string;
  teamAbbr: string;
  points?: number;
};

export default function TeamTab() {
  const userData = userDataState((state) => state.userData);
  const userDataForCL = userDataState(
    (state) => state.userDataForCurrentLeague
  );
  const livePlayerData = liveData((state) => state.livePlayerData);
  const [starterData, setStarterData] = useState([]);
  const [starters, setStarters] = useState<any>([]);
  const [startersComponent, setStartersComponent] = useState<any>([]);
  const [benchData, setBenchData] = useState([]);
  const [bench, setBench] = useState<any>([]);
  const setIsSwapOpened = useModalStore((state) => state.setIsSwapOpened);
  const isSwapOpened = useModalStore((state) => state.isSwapOpened);
  const [posToSwap, setPosToSwap] = useState("");
  const [playerToSwap, setPlayerToSwap] = useState<Player | null>(null);
  const [starterSwappablePlayers, setStarterSwappablePlayers] = useState<any>(
    []
  );
  const [benchSwappablePlayers, setBenchSwappablePlayers] = useState<any>([]);
  const [isBench, setIsBench] = useState(false);
  const currentLeagueData = useCurrentLeagueStore(
    (state) => state.currentLeagueData
  );
  const currentLeagueID = useCurrentLeagueStore(
    (state) => state.currentLeagueID
  );
  const [benchComponent, setBenchComponent] = useState<any>([]);

  const startersOrder = [
    "IGL",
    "Flex",
    "Flex",
    "Duelist",
    "Initiator",
    "Controller",
    "Sentinel",
  ];
  const benchOrder = [0, 1];

  useEffect(() => {
    setStarters(userDataForCL.team.starters);
    setBench(userDataForCL.team.bench);
  }, []);

  useEffect(() => {
    const getLiveTeamData = () => {
      const filtered = livePlayerData
        .filter((playerRow: any) => {
          return starters.includes(playerRow.player);
        })
        .sort(
          (a: any, b: any) =>
            starters.indexOf(a.player) - starters.indexOf(b.player)
        );

      setStarterData(filtered);
    };
    getLiveTeamData();
  }, [livePlayerData, starters]);

  useEffect(() => {
    const getLiveTeamData = () => {
      const filtered = livePlayerData
        .filter((playerRow: any) => {
          return bench.includes(playerRow.player);
        })
        .sort(
          (a: any, b: any) => bench.indexOf(a.player) - bench.indexOf(b.player)
        );

      setBenchData(filtered);
    };
    getLiveTeamData();
  }, [livePlayerData, bench]);

  useEffect(() => {
    let players = starterData.filter((player: any) => {
      return player.position === posToSwap && player != playerToSwap;
    });
    setStarterSwappablePlayers(players);

    let benchPlayers = benchData.filter((player: any) => {
      return player.position === posToSwap && player != playerToSwap;
    });
    setBenchSwappablePlayers(benchPlayers);
  }, [playerToSwap, benchData]);

  async function swapStarters(name: string) {
    const startersClone = [...starters];
    const benchClone = [...bench];
    if (!isBench) {
      const toSwapName = playerToSwap?.player;
      const swappingName = name;
      const indexToSwap = startersClone.indexOf(toSwapName);
      const swappingIndex = startersClone.indexOf(swappingName);
      startersClone[indexToSwap] = swappingName;
      startersClone[swappingIndex] = toSwapName;
      setStarters(startersClone);
      setBench(benchClone);
    } else {
      const toSwapName = playerToSwap?.player;
      const swappingName = name;
      const indexToSwap = bench.indexOf(toSwapName);
      const swappingIndex = startersClone.indexOf(swappingName);
      startersClone[swappingIndex] = toSwapName;
      benchClone[indexToSwap] = swappingName;
      setStarters(startersClone);
      setBench(benchClone);
    }

    userDataForCL.team.starters = startersClone;
    userDataForCL.team.bench = benchClone;

    const currentTeamsPlaying = currentLeagueData.teamsPlaying;
    const playerTeamIndex = currentTeamsPlaying.findIndex((player: any) => {
      return player.playerID === userData.id;
    });
    currentTeamsPlaying[playerTeamIndex].team.starters = startersClone;
    currentTeamsPlaying[playerTeamIndex].team.bench = benchClone;

    const response = await database
      .from("leagues")
      .update({ teamsPlaying: currentTeamsPlaying })
      .eq("leagueID", currentLeagueID);

    if (response.error) {
    }
  }

  async function swapBenchStarter(name: string) {
    const benchClone = [...bench];
    const startersClone = [...starters];
    const toSwapName = playerToSwap?.player;
    const swappingName = name;
    const indexToSwap = startersClone.indexOf(toSwapName);
    const swappingIndex = benchClone.indexOf(swappingName);
    if (indexToSwap === -1) {
      startersClone.push(swappingName);
      benchClone[swappingIndex] = "";
    } else {
      startersClone[indexToSwap] = swappingName;
      benchClone[swappingIndex] = toSwapName;
    }


    setStarters(startersClone);
    setBench(benchClone);

    userDataForCL.team.starters = startersClone;

    const currentTeamsPlaying = currentLeagueData.teamsPlaying;
    const playerTeamIndex = currentTeamsPlaying.findIndex((player: any) => {
      return player.playerID === userData.id;
    });
    currentTeamsPlaying[playerTeamIndex].team.starters = startersClone;
    currentTeamsPlaying[playerTeamIndex].team.bench = benchClone;


    const response = await database
      .from("leagues")
      .update({ teamsPlaying: currentTeamsPlaying })
      .eq("leagueID", currentLeagueID);

    if (response.error) {
    }
  }
  useEffect(() => {
    const remainingPlayers = [...starterData];

    let renderComponent = startersOrder.map((position) => {
      const index = remainingPlayers.findIndex((player: any) => {
        return player.position == position;
      });

      if (index != -1) {
        const [assignedPlayer] = remainingPlayers.splice(index, 1);
        return assignedPlayer;
      } else {
        return { player: "Empty", position: position };
      }
    });
    setStartersComponent(renderComponent);
  }, [starterData]);

  useEffect(() => {
    let renderComponent = benchOrder.map((i) => {
      if (benchData[i]) {
        const assignedPlayer = benchData[i];
        return assignedPlayer;
      } else {
        return { player: "Empty", position: null };
      }
    });
    setBenchComponent(renderComponent);
  }, [benchData]);

  const record = `${userDataForCL.wins} - ${userDataForCL.losses}`;
  return (
    <View style={{ width: "100%", flexGrow: 1 }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 33,
          paddingTop: 18,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 48,
            width: 48,
            marginRight: 8,
            backgroundColor: "white",
          }}
        />
        <View>
          <Text
            style={{ fontFamily: "The-Bold-Font", fontSize: 13, color: "#fff" }}
          >
            {userData.username}'s Team
          </Text>
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 10,
              color: "#A9A9B0",
              marginTop: 3,
            }}
          >
            {record}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 5,
        }}
      >
        <Pressable style={{ alignItems: "center" }}>
          <Feather name="calendar" size={24} color="white" />
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 10,
              color: "white",
              marginTop: 4,
            }}
          >
            Schedule
          </Text>
        </Pressable>
        <Pressable style={{ alignItems: "center", marginHorizontal: 65 }}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M13.98 13.98C14.15 13.99 14.33 14 14.5 14C18.09 14 21 11.09 21 7.5C21 3.91 18.09 1 14.5 1C10.91 1 8 3.91 8 7.5C8 7.67 8.00999 7.84999 8.01999 8.01999M13.98 13.98C13.73 10.81 11.19 8.26999 8.01999 8.01999M13.98 13.98C13.99 14.15 14 14.33 14 14.5C14 18.09 11.09 21 7.5 21C3.91 21 1 18.09 1 14.5C1 10.91 3.91 8 7.5 8C7.67 8 7.84999 8.00999 8.01999 8.01999M4.59 1H2C1.45 1 1 1.45 1 2V4.59C1 5.48 2.07999 5.92999 2.70999 5.29999L5.29999 2.70999C5.91999 2.07999 5.48 1 4.59 1ZM17.41 21H20C20.55 21 21 20.55 21 20V17.41C21 16.52 19.92 16.07 19.29 16.7L16.7 19.29C16.08 19.92 16.52 21 17.41 21Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 10,
              color: "white",
              marginTop: 4,
            }}
          >
            Trade
          </Text>
        </Pressable>
        <Pressable style={{ alignItems: "center" }}>
          <MaterialCommunityIcons
            name="clipboard-flow-outline"
            size={24}
            color="white"
          />
          <Text
            style={{
              fontFamily: "The-Bold-Font",
              fontSize: 10,
              color: "white",
              marginTop: 4,
            }}
          >
            Transfer
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          padding: 16,
          flexGrow: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "VisbyCF",
            color: "white",
            fontSize: 16,
          }}
        >
          Starters
        </Text>
        <ScrollView
          style={{
            marginTop: 23,
            flexDirection: "row",
            flexGrow: 1,
            width: "100%",
          }}
          contentContainerStyle={{
            width: "100%",
          }}
        >
          {startersComponent.map((player: any, index: number) => {
            return (
              <View
                style={[
                  {
                    height: 32,
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  },
                  index === 0 ? {} : { marginTop: 15 },
                ]}
                key={index}
              >
                <Pressable
                  style={[
                    {
                      backgroundColor:
                        colors[player?.position as keyof typeof colors],
                    },
                    styles.positionBox,
                  ]}
                  onPress={() => {
                    setPosToSwap(player?.position);
                    setPlayerToSwap(player);
                    setIsSwapOpened(true);
                    setIsBench(false);
                  }}
                >
                  <Image
                    source={
                      positionIcons[
                      player?.position as keyof typeof positionIcons
                      ]
                    }
                    style={styles.positionImage}
                  />
                </Pressable>
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
                        player.player != "Empty"
                          ? [styles.playerName]
                          : styles.empty
                      }
                    >
                      {player.player}
                    </Text>
                    {player.player != "Empty" ? (
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
                              color:
                                colors[player?.position as keyof typeof colors],
                            },
                          ]}
                        >
                          {positionAbbriviations[
                            player?.position as keyof typeof positionAbbriviations
                          ].toUpperCase()}{" "}
                        </Text>
                        <Text
                          style={[styles.playerInfoText, { color: "#ABABAB" }]}
                        >
                          • {player?.teamAbbr}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    style={
                      player.points != null ? [styles.playerName] : styles.empty
                    }
                  >
                    {player?.points ?? "-"}
                  </Text>
                </View>
              </View>
            );
          })}

          <Text
            style={{
              fontFamily: "VisbyCF",
              color: "white",
              fontSize: 16,
              marginVertical: 23,
            }}
          >
            Bench
          </Text>
          {benchComponent.map((player: any, index: number) => {
            return (
              <View
                style={[
                  {
                    height: 32,
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  },
                  index === 0 ? {} : { marginTop: 15 },
                ]}
                key={index}
              >
                <Pressable
                  style={[
                    {
                      backgroundColor: colors.Bench,
                    },
                    styles.positionBox,
                  ]}
                  onPress={() => {
                    setPosToSwap(player?.position);
                    setPlayerToSwap(player);
                    setIsSwapOpened(true);
                    setIsBench(true);
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "The-Bold-Font",
                      fontSize: 11,
                      color: "white",
                    }}
                  >
                    BN
                  </Text>
                </Pressable>
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
                        player.player != "Empty"
                          ? [styles.playerName]
                          : styles.empty
                      }
                    >
                      {player.player}
                    </Text>
                    {player.player != "Empty" ? (
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
                              color:
                                colors[player?.position as keyof typeof colors],
                            },
                          ]}
                        >
                          {positionAbbriviations[
                            player?.position as keyof typeof positionAbbriviations
                          ].toUpperCase()}{" "}
                        </Text>
                        <Text
                          style={[styles.playerInfoText, { color: "#ABABAB" }]}
                        >
                          • {player?.teamAbbr}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    style={
                      player.points != null ? [styles.playerName] : styles.empty
                    }
                  >
                    {player?.points ?? "-"}
                  </Text>
                </View>
              </View>
            );
          })}
          <SlideModal isOpen={isSwapOpened}>
            <View
              style={{
                backgroundColor: "rgb(46, 26, 71)",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                width: "100%",
                paddingBottom: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingTop: 10,
                }}
              >
                <View style={{ height: 24, width: 24 }} />
                <Text
                  style={{
                    color: "white",
                    fontFamily: "tex",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  Swap Players
                </Text>
                <Pressable
                  onPress={() => {
                    setIsSwapOpened(false);
                    setPlayerToSwap(null);
                  }}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                  paddingHorizontal: 20,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {!isBench ? (
                    <View
                      style={[
                        styles.positionBox,
                        {
                          backgroundColor:
                            colors[
                            playerToSwap?.position as keyof typeof colors
                            ],
                          margin: 0,
                        },
                      ]}
                    >
                      <Image
                        source={
                          positionIcons[
                          playerToSwap?.position as keyof typeof positionIcons
                          ]
                        }
                        style={styles.positionImage}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        {
                          backgroundColor: colors.Bench,
                          margin: 0,
                        },
                        styles.positionBox,
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: "The-Bold-Font",
                          fontSize: 11,
                          color: "white",
                        }}
                      >
                        BN
                      </Text>
                    </View>
                  )}
                  <View
                    style={
                      playerToSwap?.player === "Empty"
                        ? { width: 16 }
                        : { marginHorizontal: 16 }
                    }
                  >
                    {playerToSwap?.player === "Empty" ? null : (
                      <View style={styles.playerImageContainer}>
                        {playerToSwap?.image_link.substring(0, 2) === "//" ? (
                          <Image
                            source={{
                              uri: `https:${playerToSwap?.image_link}`,
                            }}
                            style={styles.playerImage}
                          />
                        ) : (
                          <Image
                            source={require("@/assets/img/base/ph/sil.png")}
                            style={styles.playerImage}
                          />
                        )}
                      </View>
                    )}
                    <LogoSVGComponent
                      uri={`https://issac-eligulashvili.github.io/logo-images/${playerToSwap?.team}.svg`}
                      style={{
                        height: 20,
                        width: 20,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        transform: [
                          { translateX: "25%" },
                          { translateY: "25%" },
                        ],
                      }}
                    />
                  </View>
                  <View style={{ justifyContent: "center" }}>
                    <Text
                      style={
                        playerToSwap?.player != "Empty"
                          ? [styles.playerName]
                          : styles.empty
                      }
                    >
                      {playerToSwap?.player}
                    </Text>
                    {playerToSwap?.player != "Empty" ? (
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
                              color:
                                colors[
                                playerToSwap?.position as keyof typeof colors
                                ],
                            },
                          ]}
                        >
                          {positionAbbriviations[
                            playerToSwap?.position as keyof typeof positionAbbriviations
                          ]?.toUpperCase()}{" "}
                        </Text>
                        <Text
                          style={[styles.playerInfoText, { color: "#ABABAB" }]}
                        >
                          • {playerToSwap?.teamAbbr}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Text
                  style={
                    playerToSwap?.points != null
                      ? [styles.playerName]
                      : styles.empty
                  }
                >
                  {playerToSwap?.points ?? "-"}
                </Text>
              </View>
              <View
                style={{
                  borderBottomColor: colors.subtext,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  width: "100%",
                  marginVertical: 15,
                }}
              />
              {starterSwappablePlayers.map((player: Player, index: number) => (
                <Pressable
                  style={[
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 20,
                    },
                    index === 0 ? {} : { marginTop: 10 },
                  ]}
                  onPress={() => {
                    swapStarters(player?.player);
                    setIsSwapOpened(false);
                  }}
                  key={index}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.positionBox,
                        {
                          backgroundColor:
                            colors[player?.position as keyof typeof colors],
                          margin: 0,
                        },
                      ]}
                    >
                      <Image
                        source={
                          positionIcons[
                          player?.position as keyof typeof positionIcons
                          ]
                        }
                        style={styles.positionImage}
                      />
                    </View>
                    <View style={{ marginHorizontal: 16 }}>
                      <View style={styles.playerImageContainer}>
                        <Image
                          source={{ uri: `https:${player?.image_link}` }}
                          style={styles.playerImage}
                        />
                      </View>
                      <LogoSVGComponent
                        uri={`https://issac-eligulashvili.github.io/logo-images/${player?.team}.svg`}
                        style={{
                          height: 20,
                          width: 20,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          transform: [
                            { translateX: "25%" },
                            { translateY: "25%" },
                          ],
                        }}
                      />
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={
                          player?.player != "Empty"
                            ? [styles.playerName]
                            : styles.empty
                        }
                      >
                        {player?.player}
                      </Text>
                      {player?.player != "Empty" ? (
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
                                color:
                                  colors[
                                  player?.position as keyof typeof colors
                                  ],
                              },
                            ]}
                          >
                            {positionAbbriviations[
                              player?.position as keyof typeof positionAbbriviations
                            ]?.toUpperCase()}{" "}
                          </Text>
                          <Text
                            style={[
                              styles.playerInfoText,
                              { color: "#ABABAB" },
                            ]}
                          >
                            • {player?.teamAbbr}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text
                    style={
                      player?.points != null
                        ? [styles.playerName]
                        : styles.empty
                    }
                  >
                    {player?.points ?? "-"}
                  </Text>
                </Pressable>
              ))}
              <View style={{ paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontFamily: "VisbyCF",
                    color: "white",
                    fontSize: 16,
                    marginVertical: 23,
                  }}
                >
                  Bench
                </Text>
              </View>
              {benchSwappablePlayers.map((player: Player, index: number) => (
                <Pressable
                  style={[
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 20,
                    },
                    index === 0 ? {} : { marginTop: 10 },
                  ]}
                  onPress={() => {
                    swapBenchStarter(player?.player);
                    setIsSwapOpened(false);
                  }}
                  key={index}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        {
                          backgroundColor: colors.Bench,
                          margin: 0,
                        },
                        styles.positionBox,
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: "The-Bold-Font",
                          fontSize: 11,
                          color: "white",
                        }}
                      >
                        BN
                      </Text>
                    </View>
                    <View style={{ marginHorizontal: 16 }}>
                      <View style={styles.playerImageContainer}>
                        <Image
                          source={{ uri: `https:${player?.image_link}` }}
                          style={styles.playerImage}
                        />
                      </View>
                      <LogoSVGComponent
                        uri={`https://issac-eligulashvili.github.io/logo-images/${player?.team}.svg`}
                        style={{
                          height: 20,
                          width: 20,
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          transform: [
                            { translateX: "25%" },
                            { translateY: "25%" },
                          ],
                        }}
                      />
                    </View>
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={
                          player?.player != "Empty"
                            ? [styles.playerName]
                            : styles.empty
                        }
                      >
                        {player?.player}
                      </Text>
                      {player?.player != "Empty" ? (
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
                                color:
                                  colors[
                                  player?.position as keyof typeof colors
                                  ],
                              },
                            ]}
                          >
                            {positionAbbriviations[
                              player?.position as keyof typeof positionAbbriviations
                            ]?.toUpperCase()}{" "}
                          </Text>
                          <Text
                            style={[
                              styles.playerInfoText,
                              { color: "#ABABAB" },
                            ]}
                          >
                            • {player?.teamAbbr}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text
                    style={
                      player?.points != null
                        ? [styles.playerName]
                        : styles.empty
                    }
                  >
                    {player?.points ?? "-"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </SlideModal>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  positionBox: {
    height: 32,
    width: 32,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  positionImage: {
    height: 14,
    width: 14,
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
});
