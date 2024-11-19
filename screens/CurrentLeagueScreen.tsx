import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { currentLeagueNav, useCurrentLeagueStore } from "@/states/StoreStates";
import { StatusBar } from "expo-status-bar";
import Footer from "@/components/Footer";
import LeagueScreenNav from "@/components/LeaugeScreenNav";
import DraftTab from "@/components/LeagueScreenTabs/DraftTab";
import MatchupTab from "@/components/LeagueScreenTabs/MatchupTab";
import LeaguesTab from "@/components/LeagueScreenTabs/LeaguesTab";
import TeamTab from "@/components/LeagueScreenTabs/TeamTab";
import PlayersTab from "@/components/LeagueScreenTabs/PlayersTab";

export default function CurrentLeagueScreen() {
     const currentTab = currentLeagueNav((state) => state.currentTab);

     const renderTabComponent = () => {
          switch (currentTab) {
               case "Draft":
                    return <DraftTab />
               case "Matchup":
                    return <MatchupTab />
               case "Team":
                    return <TeamTab />
               case "Players":
                    return <PlayersTab />
               case "League":
                    return <LeaguesTab />
          }
     }

     return (
          <LinearGradient
               colors={["#2E1A47", "#0B1124"]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={styles.gradient}
          >
               <SafeAreaView style={styles.container}>
                    <LeagueScreenNav />
                    {renderTabComponent()}
                    <StatusBar style="auto" />
                    <Footer></Footer>
               </SafeAreaView >
          </LinearGradient>
     )
}

const styles = StyleSheet.create({
     gradient: {
          flex: 1, // This makes the gradient cover the full area
          alignItems: "center",
          justifyContent: "center",
          width: "100%", // Full width to match the parent container
     },
     container: {
          flex: 1,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          position: "relative",
     },
})