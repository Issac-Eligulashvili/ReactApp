import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import { database } from "../js/supabaseClient";
import { useEffect, useState } from "react";
import { useData } from "../components/UserDataProvider";
import React from "react";

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

const LeagueCard: React.FC<LeagueCardProps> = ({ leagueName, teams }) => {
  return (
    <Pressable>
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
          <View>
            <Text style={[{ fontSize: 24, color: "#fff" }, styles.tex]}>
              Leagues
            </Text>
            {leaguesData.map((league) => (
              <LeagueCard
                key={league.leagueID}
                leagueName={league["league-name"]}
                teams={league.numPlayers}
                onPress={() => {
                  console.log("Pressed");
                }}
              />
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => {
            async function signOut() {
              const { error } = await database.auth.signOut();
            }
            signOut();
          }}
        >
          <Text>SignOut</Text>
        </Pressable>
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
});
