import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import { database } from "../js/supabaseClient";
import { useEffect, useState } from "react";
import { useData } from "../components/UserDataProvider";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

type LeagueCardProps = {
  leagueName: string;
  teams: number;
  onPress: () => void;
};

type League = {
  "league-name": string;
  leagueID: string;
  numPlayers: number;
};

const LeagueCard: React.FC<LeagueCardProps> = ({
  leagueName,
  teams,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress}>
      <Text
        style={[{ color: "#fff", fontSize: 16, marginTop: 10 }, styles.visby]}
      >
        {leagueName}
      </Text>
      <Text
        style={[{ color: "#A9A9B0", fontSize: 12, marginTop: 2 }, styles.visby]}
      >
        {teams}-Team League
      </Text>
    </Pressable>
  );
};

function HomeScreen() {
  const { userData, loading } = useData();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const [leaguesData, setLeaguesData] = useState<League[]>([]);

  useEffect(() => {
    let fetchedLeagues: League[] = [];

    async function fetchLeagues() {
      if (userData?.leaguesIsInIDS && userData.leaguesIsInIDS.length > 0) {
        for (const id of userData.leaguesIsInIDS) {
          const leagueData = await database
            .from("leagues")
            .select("*")
            .eq("leagueID", id);

          if (leagueData?.data && leagueData.data.length > 0) {
            const league = leagueData.data[0];
            fetchedLeagues.push({
              "league-name": league["league-name"],
              leagueID: league.leagueID,
              numPlayers: league.numPlayers,
            });
          }
        }
      }

      // Update state with the fetched leagues
      setLeaguesData(fetchedLeagues);
    }

    fetchLeagues();
  }, [userData]);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2E1A47", "#0B1124"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient} // Add a style for LinearGradient
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 60,
            justifyContent: "flex-start",
            width: "100%",
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[{ fontSize: 24, color: "#fff" }, styles.tex]}>
              Leagues
            </Text>
            <Pressable style={styles.btn}>
              <MaterialIcons
                name="add-circle-outline"
                size={16}
                color="black"
              />
              <Text
                style={[
                  styles.tex,
                  {
                    lineHeight: 16,
                    fontSize: 14,
                    textAlignVertical: "center",
                    marginTop: 1,
                  },
                ]}
              >
                ADD
              </Text>
            </Pressable>
          </View>
          {leaguesData.length > 0 ? (
            leaguesData.map((league) => (
              <LeagueCard
                key={league.leagueID}
                leagueName={league["league-name"]}
                teams={league.numPlayers}
                onPress={() => {
                  console.log(league.leagueID);
                }}
              />
            ))
          ) : (
            <View style={{ margin: "auto" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "tex",
                  color: "#fff",
                  fontSize: 38,
                }}
              >
                You're not in any Leagues!
              </Text>
              <Text
                style={{ textAlign: "center", marginTop: 10, color: "#A9A9B0" }}
              >
                To get started press the "Add" button in the top right!
              </Text>
            </View>
          )}
        </View>
        <StatusBar style="auto" />
      </LinearGradient>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1, // This makes the gradient cover the full area
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Full width to match the parent container
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  visby: {
    fontFamily: "VisbyCF",
  },
  bold: {
    fontFamily: "The-Bold-Font",
  },
  tex: {
    fontFamily: "tex",
  },
  btn: {
    padding: 7,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
