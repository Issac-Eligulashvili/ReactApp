import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
     View,
     StyleSheet,
     SafeAreaView,
     TextInput,
     Text,
     ScrollView,
     Pressable,
     useWindowDimensions,
     Image,
     FlatList,
} from "react-native";
import {
     liveData,
     useCurrentLeagueStore,
     userDataState,
} from "@/states/StoreStates";
import { database } from "@/js/supabaseClient";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/type";
import { useNavigation } from "@react-navigation/native";
import colors from "@/assets/colors";
import {
     positionAbbriviations,
     regionAbbr,
     positionIcons,
} from "@/assets/positionIcons";
import Animated, {
     useSharedValue,
     useAnimatedStyle,
     withTiming,
} from "react-native-reanimated";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LogoSVGComponent } from "@/components/FetchLeagueSVG";

type AuthScreenNavigationProp = StackNavigationProp<
     RootStackParamList,
     "Draft"
>;

const navOrder = [
     "All",
     "IGL",
     "Duelist",
     "Initiator",
     "Sentinel",
     "Flex",
     "Controller",
];

export default function DraftScreen() {
     const navigation = useNavigation<AuthScreenNavigationProp>();
     const clData = useCurrentLeagueStore((state) => state.currentLeagueData);
     const [playerNames, setPlayerNames] = useState<string[]>([]);
     const [forward, setForward] = useState(true);
     const [draftedPlayersGrid, setDraftedPlayersGrid] = useState<any[]>([]);
     const [takenPlayerData, setTakenPlayerData] = useState<any[]>([]);
     const takenPlayers = liveData((state) => state.liveLeagueData);
     const setTakenPlayers = liveData((state) => state.setLiveLeagueData);
     const currentLeagueID = useCurrentLeagueStore(
          (state) => state.currentLeagueID
     );
     const [open, setOpen] = useState(true);
     const [currentFilter, setCurrentFilter] = useState("All");
     const [filteredArray, setFilteredArray] = useState<any>(
          clData["availablePlayers"]
     );
     const [search, setSearch] = useState("");
     const userDataForCL = userDataState(
          (state) => state.userDataForCurrentLeague
     );
     const setUserDataForCurrentLeague = userDataState(
          (state) => state.setUserDataForCurrentLeague
     );
     const userData = userDataState((state) => state.userData);
     const [currentTurn, setCurrentTurn] = useState<number | null>(null);
     const setCurrentLeagueData = useCurrentLeagueStore(
          (state) => state.setCurrentLeagueData
     );
     const [amtPlayersLeft, setAmtPlayersLeft] = useState<any>({})

     const { height } = useWindowDimensions();
     const translateY = useSharedValue(height * 0.7);

     function animateTranslateModal() {
          translateY.value = withTiming(open ? height * 0 : height * 0.7, {
               duration: 500,
          });
          setOpen(!open);
     }

     const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateY: translateY.value }],
     }));

     async function setCurrentPlayers() {
          if (currentFilter === "All") {
               const playerData = await database
                    .from("players")
                    .select("*")
                    .in("player", takenPlayers?.availablePlayers);
               if (playerData.data) {
                    setFilteredArray(playerData.data);
               }
          } else {
               const playerPositionData = await database
                    .from("players")
                    .select("*")
                    .in("position", [currentFilter]);
               const playerData = playerPositionData?.data?.filter((p: any) =>
                    takenPlayers.availablePlayers.includes(p.player)
               );
               setFilteredArray(playerData);
          }
     }

     function getPlayerNames() {
          let arr = [] as string[];

          const orderedUsersBySeed = clData.teamsPlaying.sort(
               (a: any, b: any) => a.seed - b.seed
          );

          orderedUsersBySeed.forEach((user: any) => {
               arr.push(user.playerName);
          });

          setPlayerNames(arr);
     }

     function generateGrid() {
          let count = 0;
          let arr = [];
          for (let i = 0; i < 9; i++) {
               let rowArr = [];
               for (let j = 0; j < clData.numPlayers; j++) {
                    if (takenPlayerData[count]) {
                         const currentPlayer = takenPlayerData[count];
                         rowArr.push(
                              <View style={[{ width: 128, height: 64, padding: 1 }]} key={i + j}>
                                   <View
                                        style={{
                                             flex: 1,
                                             padding: 2,
                                             borderRadius: 5,
                                             backgroundColor:
                                                  colors[currentPlayer.position as keyof typeof colors],
                                        }}
                                   >
                                        <View
                                             style={{
                                                  flexDirection: "row",
                                                  justifyContent: "space-between",
                                             }}
                                        >
                                             <Text
                                                  style={[
                                                       styles.subtext,
                                                       { color: "rgb(118 118 118)", fontSize: 10 },
                                                  ]}
                                             >
                                                  {
                                                       positionAbbriviations[
                                                       currentPlayer.position as keyof typeof positionAbbriviations
                                                       ]
                                                  }{" "}
                                                  {"-"} {currentPlayer.teamAbbr} {"-"}{" "}
                                                  {
                                                       regionAbbr[
                                                       currentPlayer.region as keyof typeof regionAbbr
                                                       ]
                                                  }
                                             </Text>
                                             <Text style={styles.subtext}>
                                                  {i + 1}.{j + 1}
                                             </Text>
                                        </View>
                                        <Text
                                             style={{ fontSize: 16, color: "black", fontFamily: "tex" }}
                                        >
                                             {currentPlayer.player}
                                        </Text>
                                   </View>
                              </View>
                         );
                    } else {
                         rowArr.push(
                              <View style={[{ width: 128, height: 64, padding: 1 }]} key={i + j}>
                                   <View
                                        style={{
                                             flex: 1,
                                             backgroundColor: colors.subtext,
                                             borderRadius: 5,
                                             padding: 2,
                                        }}
                                   >
                                        <View
                                             style={{
                                                  flexDirection: "row",
                                                  justifyContent: "space-between",
                                             }}
                                        >
                                             <View style={{ width: 1 }} />
                                             <Text style={styles.subtext}>
                                                  {i + 1}.{j + 1}
                                             </Text>
                                        </View>
                                   </View>
                              </View>
                         );
                    }
                    count++;
               }
               arr.push(
                    <View
                         key={i}
                         style={
                              i % 2 === 0
                                   ? { flexDirection: "row" }
                                   : { flexDirection: "row-reverse" }
                         }
                    >
                         {rowArr}
                    </View>
               );
          }
          setDraftedPlayersGrid(arr);
     }

     async function getTakenPlayersData(data: any) {
          const response = await database
               .from("players")
               .select("*")
               .in("player", data);
          if (response.data) {
               const sortedArray = response.data.sort(
                    (a: any, b: any) =>
                         takenPlayers?.takenPlayers.indexOf(a.player) -
                         takenPlayers?.takenPlayers.indexOf(b.player)
               );
               setTakenPlayerData(sortedArray);
          }
     }

     async function draftPlayer(player: any) {
          const playerData = await database.from("players").select();
          let currentAvailPlayers = takenPlayers.availablePlayers;
          let clDataClone = { ...clData };
          let starters = userDataForCL.team.starters;
          let bench = userDataForCL.team.bench;
          let maxPlayers = 1;
          let currentTakenPlayers = takenPlayers.takenPlayers;

          if (player.position === "Flex") {
               maxPlayers = 2;
          }
          const startersData = playerData?.data?.filter((p: any) => {
               return starters.includes(p.player);
          });

          const arr = startersData?.filter((p: any) => {
               return p.position === player.position;
          });

          if (bench.length === 2 && arr?.length === maxPlayers) {
               alert("Please draft someone of another position");
          } else {
               if (arr?.length === maxPlayers && bench.length < 2) {
                    bench.push(player.player);
                    let currentData = userDataForCL;
                    currentData.team.starters = starters;
                    currentData.team.bench = bench;
                    setUserDataForCurrentLeague(currentData);
                    const currentTeamsPlaying = takenPlayers.teamsPlaying;
                    const playerTeamIndex = currentTeamsPlaying.findIndex((player: any) => {
                         return player.playerID === userData.id;
                    });
                    currentTeamsPlaying[playerTeamIndex].team.starters = starters;
                    currentTeamsPlaying[playerTeamIndex].team.bench = bench;

                    const playerIndex = currentAvailPlayers.findIndex(
                         (p: any) => p === player.player
                    );
                    currentAvailPlayers.splice(playerIndex, 1);
                    currentTakenPlayers.push(player.player);
                    const response = await database
                         .from("leagues")
                         .update({
                              teamsPlaying: currentTeamsPlaying,
                              available_players: currentAvailPlayers,
                              taken_players: currentTakenPlayers,
                         })
                         .eq("leagueID", currentLeagueID);
                    clDataClone["available_players"] = currentAvailPlayers;
                    clDataClone.takenPlayers = currentTakenPlayers;
                    setCurrentLeagueData(clDataClone);
                    increaseCurrentTurn();
               } else {
                    starters.push(player.player);
                    let currentData = userDataForCL;

                    currentData.team.starters = starters;
                    currentData.team.bench = bench;
                    setUserDataForCurrentLeague(currentData);
                    const currentTeamsPlaying = takenPlayers.teamsPlaying;
                    const playerTeamIndex = currentTeamsPlaying.findIndex((player: any) => {
                         return player.playerID === userData.id;
                    });
                    currentTeamsPlaying[playerTeamIndex].team.starters = starters;
                    currentTeamsPlaying[playerTeamIndex].team.bench = bench;

                    const playerIndex = currentAvailPlayers.findIndex(
                         (p: any) => p === player.player
                    );
                    currentAvailPlayers.splice(playerIndex, 1);
                    currentTakenPlayers.push(player.player);
                    const response = await database
                         .from("leagues")
                         .update({
                              teamsPlaying: currentTeamsPlaying,
                              available_players: currentAvailPlayers,
                              taken_players: currentTakenPlayers,
                         })
                         .eq("leagueID", currentLeagueID);
                    clDataClone["available_players"] = currentAvailPlayers;
                    clDataClone.takenPlayers = currentTakenPlayers;
                    setCurrentLeagueData(clDataClone);
                    increaseCurrentTurn();
               }
          }
     }

     useEffect(() => {
          getPlayerNames();
          async function getTakenPlayers() {
               const response = await database
                    .from("leagues")
                    .select("*")
                    .eq("leagueID", currentLeagueID);
               if (response.data) {
                    setTakenPlayers({
                         takenPlayers: response.data[0].taken_players,
                         isDrafting: response.data[0].isDrafting,
                         currentTurn: response.data[0].currentTurn,
                         availablePlayers: response.data[0].available_players,
                         teamsPlaying: response.data[0].teamsPlaying,
                         isForward: response.data[0].forward,
                    });
               }
          }

          getTakenPlayers();
          getTakenPlayersData(clData.taken_players);
     }, []);

     useEffect(() => {
          setUserDataForCurrentLeague(
               clData.teamsPlaying.find(
                    (player: { playerID: any }) => player.playerID === userData.id
               )
          );
     }, [clData]);

     async function increaseCurrentTurn() {
          let turn = currentTurn;
          let f;
          if (forward) {
               if (turn) {
                    turn++;
                    if (turn > clData.numPlayers) {
                         turn = clData.numPlayers;
                         f = false;
                    }
               }
          } else {
               if (turn) {
                    turn--;
                    if (turn < 1) {
                         turn = 1;
                         f = true;
                    }
               }
          }
          const sigma = await database
               .from("leagues")
               .update({ currentTurn: turn, forward: f })
               .eq("leagueID", currentLeagueID);
     }

     useEffect(() => {
          generateGrid();
     }, [takenPlayerData, currentLeagueID]);

     useEffect(() => {
          if (takenPlayers?.takenPlayers) {
               getTakenPlayersData(takenPlayers?.takenPlayers);
               if (takenPlayers.takenPlayers.length === clData.numPlayers * 9) {
                    const clDataClone = { ...clData };
                    clDataClone.isDrafting = false;
                    setCurrentLeagueData(clDataClone);
                    async function isDraftingFalse() {
                         await database
                              .from("leagues")
                              .update({ isDrafting: false, isDrafted: true })
                              .eq("leagueID", currentLeagueID);
                    }
                    if (takenPlayers.isDrafting != false) {
                         isDraftingFalse();
                    }
               }
          }
          if (takenPlayers?.currentTurn) {
               setCurrentTurn(takenPlayers?.currentTurn);
          }
          if (takenPlayers?.teamsPlaying) {
               const uData = takenPlayers?.teamsPlaying.filter((u: any) => {
                    return u.playerID === userData?.id;
               });
               setUserDataForCurrentLeague(uData[0]);
               const wholeTeam = uData[0].team.starters.concat(uData[0].team.bench);
               async function getTeamData() {
                    const response = await database.from("players").select("*").in("player", wholeTeam);
                    return response.data
               }
               getTeamData().then(result => {
                    let numOfPlayersForPos = {
                         "All": { num: result?.length }
                    } as any;
                    result?.forEach((p: any) => {
                         if (numOfPlayersForPos[p.position]) {
                              numOfPlayersForPos[p.position].num++;
                         } else {
                              numOfPlayersForPos[p.position] = { num: 1 };
                         }
                    });
                    navOrder.forEach((pos: any) => {
                         let maxPlayers = 1;
                         if (pos === "All") {
                              maxPlayers = 9;
                         }
                         if (pos === "Flex") {
                              maxPlayers = 2;
                         }
                         numOfPlayersForPos[pos].max = maxPlayers;
                    })

                    setAmtPlayersLeft(numOfPlayersForPos)
               });
          }
          setForward(takenPlayers?.isForward);
     }, [takenPlayers, userData]);

     useEffect(() => {
          setCurrentPlayers();
     }, [currentFilter, clData, takenPlayers]);

     useEffect(() => {
          async function doSearch() {
               const playerSearch = await database
                    .from("players")
                    .select("*")
                    .ilike("player", `%${search}%`);
               const playerData = playerSearch?.data?.filter((p: any) =>
                    takenPlayers?.availablePlayers.includes(p.player)
               );
               setFilteredArray(playerData);
               if (playerData) {
                    setFilteredArray(playerData);
               }
          }
          setCurrentFilter("All");

          doSearch();
     }, [search]);

     return (
          <LinearGradient
               colors={["#2E1A47", "#0B1124"]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={styles.gradient}
          >
               <SafeAreaView style={styles.container}>
                    <View
                         style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                         }}
                    >
                         <View style={{ width: 18, height: 24 }} />
                         <Text
                              style={{
                                   color: "white",
                                   fontFamily: "tex",
                                   fontSize: 16,
                                   textAlign: "center",
                              }}
                         >
                              {clData["league-name"]}
                         </Text>
                         {!takenPlayers?.isDrafting ? (
                              <Pressable
                                   onPress={() => {
                                        navigation.navigate("Leagues");
                                        const clDataClone = { ...clData };
                                        clDataClone.isDrafted = true;
                                        setCurrentLeagueData(clDataClone);
                                   }}
                              >
                                   <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                              </Pressable>
                         ) : (
                              <View style={{ width: 18, height: 24 }} />
                         )}
                    </View>
                    <ScrollView
                         style={{
                              flex: 1,
                              width: "100%",
                         }}
                         contentContainerStyle={{
                              alignItems: "center",
                              width: "100%",
                              flexDirection: "column",
                         }}
                         horizontal={true}
                         nestedScrollEnabled={true}
                    >
                         <View style={{ flexDirection: "row", paddingLeft: 10 }}>
                              {playerNames.map((p: any) => (
                                   <View style={{ width: 128, height: 32, marginTop: 10 }} key={p}>
                                        <Text
                                             style={{
                                                  fontSize: 14,
                                                  fontFamily: "tex",
                                                  color: "white",
                                                  textAlign: "center",
                                             }}
                                             numberOfLines={1}
                                        >
                                             {p}
                                        </Text>
                                   </View>
                              ))}
                         </View>
                         <ScrollView horizontal={false}>{draftedPlayersGrid}</ScrollView>
                    </ScrollView>
               </SafeAreaView>
               <Animated.View style={[styles.modal, animatedStyle]}>
                    <View
                         style={{
                              backgroundColor: "rgb(46, 26, 71)",
                              borderTopRightRadius: 10,
                              borderTopLeftRadius: 10,
                              width: "100%",
                              paddingBottom: 10,
                              height: "80%",
                         }}
                    >
                         <Pressable
                              style={{
                                   padding: 20,
                                   width: "100%",
                              }}
                              onPress={() => {
                                   animateTranslateModal();
                              }}
                         >
                              <View
                                   style={{
                                        height: 5,
                                        width: "50%",
                                        backgroundColor: "rgba(255,255,255,0.4)",
                                        marginHorizontal: "auto",
                                        borderRadius: 5,
                                   }}
                              />
                         </Pressable>
                         <View
                              style={{
                                   flexDirection: "row",
                                   width: "100%",
                                   justifyContent: "space-between",
                                   marginBottom: 5,
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
                                             {positionAbbriviations[
                                                  nav as keyof typeof positionAbbriviations
                                             ] ?? nav}
                                        </Text>
                                        <Text style={styles.navText}>
                                             {amtPlayersLeft[nav]?.num} / {amtPlayersLeft[nav]?.max}
                                        </Text>
                                   </Pressable>
                              ))}
                         </View>
                         <View
                              style={{ paddingHorizontal: 10, width: "100%", marginBottom: 15 }}
                         >
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
                                   }}
                              >
                                   <MaterialIcons
                                        name="person-search"
                                        size={24}
                                        color="white"
                                        style={{ width: 24 }}
                                   />
                                   <TextInput
                                        style={[{ flexGrow: 1, marginLeft: 5 }, styles.text]}
                                        placeholder={"Search..."}
                                        placeholderTextColor={colors.subtext}
                                        onChangeText={(newText) => setSearch(newText)}
                                        value={search}
                                   ></TextInput>
                              </View>
                         </View>
                         <View style={{ flex: 1, height: "100%" }}>
                              <FlatList
                                   data={filteredArray}
                                   keyExtractor={(player, index) => player.id || index.toString()}
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
                                             {currentTurn === userDataForCL?.seed && clData.isDrafting ? (
                                                  <Pressable
                                                       style={{
                                                            marginRight: 10,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 5,
                                                            backgroundColor: "#5A3EA1",
                                                            borderRadius: 15,
                                                       }}
                                                       onPress={() => {
                                                            draftPlayer(item);
                                                       }}
                                                  >
                                                       <Text style={{ fontFamily: "tex", color: "white" }}>
                                                            DRAFT
                                                       </Text>
                                                  </Pressable>
                                             ) : (
                                                  <View
                                                       style={{
                                                            marginRight: 10,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 5,
                                                            backgroundColor: colors.subtext,
                                                            borderRadius: 15,
                                                       }}
                                                  >
                                                       <Text style={{ fontFamily: "tex", color: "white" }}>
                                                            DRAFT
                                                       </Text>
                                                  </View>
                                             )}
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
                                                                 item.player != "Empty"
                                                                      ? [styles.playerName]
                                                                      : styles.empty
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
                                                                                color:
                                                                                     colors[item?.position as keyof typeof colors],
                                                                           },
                                                                      ]}
                                                                 >
                                                                      {positionAbbriviations[
                                                                           item?.position as keyof typeof positionAbbriviations
                                                                      ]?.toUpperCase()}{" "}
                                                                 </Text>
                                                                 <Text
                                                                      style={[
                                                                           styles.playerInfoText,
                                                                           { color: "#ABABAB" },
                                                                      ]}
                                                                 >
                                                                      • {item?.teamAbbr}
                                                                 </Text>
                                                            </View>
                                                       ) : null}
                                                  </View>
                                                  <Text
                                                       style={
                                                            item.points != null ? [styles.playerName] : styles.empty
                                                       }
                                                  >
                                                       {item?.points ?? "-"}
                                                  </Text>
                                             </View>
                                        </View>
                                   )}
                                   contentContainerStyle={{ padding: 10 }}
                                   style={{ height: 300 }}
                              />
                         </View>
                    </View>
               </Animated.View>
          </LinearGradient>
     );
}

const styles = StyleSheet.create({
     gradient: {
          flex: 1, // This makes the gradient cover the full area
          alignItems: "center",
          justifyContent: "center",
          width: "100%", // Full width to match the parent container
          overflow: "hidden",
     },
     container: {
          flex: 1,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          position: "relative",
          overflow: "hidden",
     },
     subtext: {
          fontSize: 12,
          fontFamily: "tex",
          color: "#828282",
     },
     modal: {
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
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
