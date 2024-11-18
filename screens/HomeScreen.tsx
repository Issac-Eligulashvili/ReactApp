import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView
} from "react-native";
import { database } from "../js/supabaseClient";
import { useEffect, useState } from "react";
import { useData } from "../components/UserDataProvider";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import CustomModal from "../components/ModalComponent";
import { useModalStore, useCurrentLeagueStore, allLeaguesData } from "@/states/StoreStates";
import CreateLeaugeModalContent from "@/components/CreateLeagueModalContent";
import Footer from "@/components/Footer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/components/type";
import JoinLeagueModalContent from "@/components/JoinLeagueModalContent";

type AuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type LeagueCardProps = {
  leagueName: string;
  teams: number;
  onPress: () => void;
};

type League = {
  "league-name": string;
  leagueID: string;
  numPlayers: number;
  teamsPlaying: [];
  availablePlayers: string[];
  isDrafted: boolean;
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
  const setIsOpened = useModalStore((state) => state.setIsOpened);
  const isOpened = useModalStore((state) => state.isOpened);
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const leaguesData = allLeaguesData((state) => state.fetchedLeagues)
  const setLeaguesData = allLeaguesData((state) => state.setLeaguesData);
  const setCurrentLeagueID = useCurrentLeagueStore((state) => state.setCurrentLeagueID);
  const isLoading = allLeaguesData((state) => state.loading);
  const setLoading = allLeaguesData((state) => state.setLoading);
  const setCurrentLeagueData = useCurrentLeagueStore((state) => state.setCurrentLeagueData);
  const isPicked = useModalStore((state) => state.isPicked);
  const setIsPicked = useModalStore((state) => state.setIsPicked);


  useEffect(() => {
    if (loading || !userData) return;

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
              isDrafted: league.isDrafted,
              availablePlayers: league['available_players'],
              teamsPlaying: league.teamsPlaying,
            });
          }
        }
      }

      // Update state with the fetched leagues
      console.log(fetchedLeagues);

      setLeaguesData(fetchedLeagues);
      setLoading(false);
    }

    fetchLeagues();
  }, [userData, loading]);

  useEffect(() => {
    console.log(isPicked);
  }, [isPicked])

  if (loading || !userData) {
    return <Text>Loading...</Text>;
  }



  return (
    <LinearGradient
      colors={["#2E1A47", "#0B1124"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient} // Add a style for LinearGradient
    >
      <SafeAreaView style={styles.container}>

        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
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
            <View style={{
              flexDirection: 'row',
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Pressable
                style={styles.btn}
                onPress={() => {
                  console.log("Opening modal");
                  setIsOpened(true);
                }}
              >
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
              <Pressable
                style={{
                  marginLeft: 10,
                  backgroundColor: "red",
                  padding: 4,
                  borderRadius: 5
                }}
                onPress={async () => {
                  await database.auth.signOut();
                }}
              >
                <MaterialIcons name="logout" size={24} color="white" />
              </Pressable>
            </View>
          </View>
          {!isLoading ? (
            <FlatList<League>
              data={leaguesData}
              keyExtractor={(item) => item.leagueID.toString()}
              renderItem={({ item }) => (
                <LeagueCard
                  leagueName={item["league-name"]}
                  teams={item.numPlayers}
                  onPress={async () => {
                    setCurrentLeagueID(item.leagueID);
                    const response = await database.from("leagues").select("").eq('leagueID', item.leagueID);

                    if (!response.error) {
                      setCurrentLeagueData(response.data[0]);
                      navigation.navigate("Leagues");
                    }
                  }}
                />
              )}
              ListEmptyComponent={
                <View style={{ margin: "auto", flex: 1, alignItems: "center", justifyContent: "center" }}>
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
              }
              style={{ flexGrow: 1 }}
              contentContainerStyle={leaguesData.length === 0 ? { flexGrow: 1, } : null}
            />
          ) : (
            <Text>Loading...</Text>
          )}
          <CustomModal isOpen={isOpened}>
            {isPicked === 'create' ? <CreateLeaugeModalContent />
              : isPicked === 'join' ? <JoinLeagueModalContent />
                : <View
                  style={{
                    backgroundColor: "#2E1A47",
                    padding: 20,
                    borderRadius: 10,
                    width: "80%",
                  }
                  }
                >
                  <Text style={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "tex",
                    fontSize: 24
                  }}>Create or Join a League!</Text>
                  <Text style={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "VisbyCF",
                    fontSize: 16,
                    marginTop: 10,
                  }}>Get started to play the game with your friends or family!</Text>
                  <Pressable
                    style={[styles.btn, { marginTop: 10, backgroundColor: "#5A3EA1" }]}
                    onPress={() => {
                      setIsPicked("create");
                    }}
                  >
                    <Text style={{
                      fontFamily: "tex",
                      fontSize: 16,
                      textAlign: "center",
                      color: "white"
                    }}>
                      Create League
                    </Text>
                  </Pressable>
                  <Pressable style={[styles.btn,
                  {
                    marginTop: 10,
                    backgroundColor: "transparent",
                    borderColor: "#5A3EA1",
                    borderWidth: 2,
                  }]}
                    onPress={() => {
                      setIsPicked("join");
                    }}>
                    <Text style={{
                      fontFamily: "tex",
                      fontSize: 16,
                      textAlign: "center",
                      color: "#5A3EA1"
                    }}>
                      Join League
                    </Text>
                  </Pressable>
                </View>}
          </CustomModal>
        </View>
        <StatusBar style="auto" />
        <Footer></Footer>
      </SafeAreaView >
    </LinearGradient>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
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
