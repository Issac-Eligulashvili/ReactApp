import { View, Text, FlatList, StyleSheet, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { LogoSVGComponent } from "../FetchLeagueSVG";
import colors from "@/assets/colors";
import { positionAbbriviations, positionIcons } from "@/assets/positionIcons";
import Foundation from '@expo/vector-icons/Foundation';
import { useCurrentLeagueStore, userDataState } from "@/states/StoreStates";
import { database } from "@/js/supabaseClient";
import { set } from "lodash";

const navOrder = ["All", "IGL", "Duelist", "Initiator", "Sentinel", "Flex", "Controller"];

export default function PlayersTab() {
     const userData = userDataState((state) => state.userData);
     const userDataForCL = userDataState(
          (state) => state.userDataForCurrentLeague
     );
     const currentLeagueData = useCurrentLeagueStore((state) => state.currentLeagueData);
     const currentLeagueID = useCurrentLeagueStore((state) => state.currentLeagueID);
     const [currentFilter, setCurrentFilter] = useState("All");
     const [filteredArray, setFilteredArray] = useState<any>(currentLeagueData["available_players"]);

     useEffect(() => {
          console.log(filteredArray);
     }, [filteredArray])

     useEffect(() => {
          async function setCurrentPlayers() {
               if (currentFilter === "All") {
                    const playerData = await database.from("players").select("*")
                         .in('player', currentLeagueData["available_players"]);
                    if (playerData.data) {
                         setFilteredArray(playerData.data);
                    }
               } else {
                    const playerData = await database.from("players").select("*")
                         .in("position", [currentFilter]);
                    if (playerData.data) {
                         setFilteredArray(playerData.data);
                    }
               }
          }
          setCurrentPlayers();
     }, [currentFilter])

     return (
          <View style={{ flexDirection: "row", width: "80%", justifyContent: "space-between", marginTop: 20 }}>
               {navOrder.map((nav, index) => (
                    <Pressable key={index} style={{ padding: 10 }}
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
                              {positionIcons[nav as keyof typeof positionIcons] != null ?
                                   <Image
                                        source={positionIcons[nav as keyof typeof positionIcons]}
                                        style={styles.positionImage}
                                   /> :
                                   <Foundation name="torsos-all" size={32} color="white" />
                              }
                         </View>
                         <Text style={styles.navText}> {positionAbbriviations[nav as keyof typeof positionAbbriviations] ?? nav}</Text>
                    </Pressable>
               ))}
          </View>
     )
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
          position: "relative"
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
          alignSelf: 'flex-start',
          margin: "auto"
     }
})