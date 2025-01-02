import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  useWindowDimensions,
} from "react-native";
import { currentLeagueNav, useCurrentLeagueStore } from "@/states/StoreStates";
import { StatusBar } from "expo-status-bar";
import Footer from "@/components/Footer";
import LeagueScreenNav from "@/components/LeaugeScreenNav";
import DraftTab from "@/components/LeagueScreenTabs/DraftTab";
import MatchupTab from "@/components/LeagueScreenTabs/MatchupTab";
import LeaguesTab from "@/components/LeagueScreenTabs/LeaguesTab";
import TeamTab from "@/components/LeagueScreenTabs/TeamTab";
import PlayersTab from "@/components/LeagueScreenTabs/PlayersTab";
import { RootStackParamList } from "@/components/type";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
export default function CurrentLeagueScreen() {
  const currentTab = currentLeagueNav((state) => state.currentTab);
  const currentLeagueData = useCurrentLeagueStore(
    (state) => state.currentLeagueData
  );
  const navigation = useNavigation<AuthScreenNavigationProp>();

  if (currentLeagueData.isDrafting) {
    navigation.navigate("Draft");
  }

  const { height } = useWindowDimensions();

  const renderTabComponent = () => {
    switch (currentTab) {
      case "Draft":
        return <DraftTab />;
      case "Matchup":
        return <MatchupTab />;
      case "Team":
        return <TeamTab />;
      case "Players":
        return <PlayersTab />;
      case "League":
        return <LeaguesTab />;
    }
  };

  return (
    <>
      <LinearGradient
        colors={["#2E1A47", "#0B1124"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { height: height }]}
      >
        <SafeAreaView style={styles.container}>
          <LeagueScreenNav />
          {renderTabComponent()}
          <StatusBar style="auto" />
        </SafeAreaView>
      </LinearGradient>
      <Footer></Footer>
    </>
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
    paddingBottom: 64,
    height: "100%",
  },
});
