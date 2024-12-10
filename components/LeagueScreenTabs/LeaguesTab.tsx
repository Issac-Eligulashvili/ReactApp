import { View, Text, FlatList, StyleSheet, useWindowDimensions, Platform } from "react-native";
import React from "react";
import { useCurrentLeagueStore } from "@/states/StoreStates";
import colors from "@/assets/colors";

export default function LeaguesTab() {
     const currentLeagueData = useCurrentLeagueStore(
          (state) => state.currentLeagueData
     );
     const { height } = useWindowDimensions();
     let renderHeight;
     renderHeight = height - 288;

     let usersInLeague = [];

     for (let i = 0; i < currentLeagueData.numPlayers; i++) {
          if (currentLeagueData.teamsPlaying[i]) {
               usersInLeague.push(
                    {
                         name: currentLeagueData.teamsPlaying[i].playerName,
                         record: `${currentLeagueData.teamsPlaying[i].wins} - ${currentLeagueData.teamsPlaying[i].losses}`
                    }
               );
          } else {
               usersInLeague.push(
                    {
                         name: `Team ${i + 1}`,
                         record: "0 - 0"
                    }
               );
          }
     }

     return (
          <View style={{ width: "100%", padding: 10 }}>
               <Text style={styles.listText}>
                    Standings
               </Text>
               <FlatList
                    data={usersInLeague}
                    keyExtractor={(index) => index.toString()}
                    renderItem={({ item, index }) => (
                         <View style={[{ height: 48, flexDirection: "row", padding: 10 }, index === 0 ? { paddingTop: 0 } : null]}>
                              <Text style={styles.listText}>
                                   {index + 1}
                              </Text>
                              <View style={{ marginLeft: 10 }}>
                                   <Text style={styles.listText}>
                                        {item.name}
                                   </Text>
                                   <Text style={{
                                        color: colors.subtext,
                                        fontFamily: "The-Bold-Font",
                                        fontSize: 10,
                                   }}>
                                        {item.record}
                                   </Text>
                              </View>
                         </View>
                    )}
                    style={{ height: renderHeight, marginTop: 10 }}
               />
          </View>
     )
}

const styles = StyleSheet.create({
     listText: {
          color: "white",
          fontSize: 16,
          fontFamily: "tex",
     },
});