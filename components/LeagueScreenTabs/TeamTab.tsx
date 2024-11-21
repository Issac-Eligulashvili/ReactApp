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
} from "@/states/StoreStates";
import Feather from "@expo/vector-icons/Feather";
import Svg, { Path } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "@/assets/colors";

export default function TeamTab() {
  const userData = userDataState((state) => state.userData);
  const userDataForCL = userDataState(
    (state) => state.userDataForCurrentLeague
  );
  const livePlayerData = liveData((state) => state.livePlayerData);
  const [starterData, setStarterData] = useState([]);
  const [currentTeam, setCurrentTeam] = useState<any>([]);

  // let starterData: any[] = [];

  useEffect(() => {
    console.log(livePlayerData);
    const getLiveTeamData = () => {
      setStarterData(
        livePlayerData.filter((playerRow: any) => {
          return userDataForCL.team.starters.includes(playerRow.player);
        })
      );
    };
    getLiveTeamData();
  }, [livePlayerData]);

  useEffect(() => {
    console.log(starterData);
  }, [starterData]);

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
          <View
            style={{
              height: 32,
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={[
                {
                  backgroundColor: colors.IGL,
                },
                styles.positionBox,
              ]}
            >
              <Image
                source={require("@/assets/img/icons/IGLClassSymbol.png")}
                style={styles.positionImage}
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
                  style={[
                    starterData.find((player: any) =>
                      player.position.includes("IGL")
                    )
                      ? styles.playerName
                      : styles.empty,
                    { marginTop: -8 },
                  ]}
                >
                  {starterData.find((player: any) =>
                    player.position.includes("IGL")
                  )?.player ?? "Empty"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: -4,
                  }}
                >
                  <Text style={[styles.playerInfoText, { color: colors.IGL }]}>
                    IGL{" "}
                  </Text>
                  <Text style={[styles.playerInfoText, { color: "#ABABAB" }]}>
                    •{" "}
                    {
                      starterData.find((player: any) =>
                        player.position.includes("IGL")
                      )?.teamAbbr
                    }
                  </Text>
                </View>
              </View>
              <Text
                style={
                  starterData.find((player: any) =>
                    player.position.includes("IGL")
                  )?.points != null
                    ? styles.playerName
                    : styles.empty
                }
              >
                {starterData.find((player: any) =>
                  player.position.includes("IGL")
                )?.points ?? "-"}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 32,
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={[
                {
                  backgroundColor: colors.IGL,
                },
                styles.positionBox,
              ]}
            >
              <Image
                source={require("@/assets/img/icons/IGLClassSymbol.png")}
                style={styles.positionImage}
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
                  style={[
                    starterData.find((player: any) =>
                      player.position.includes("IGL")
                    )
                      ? styles.playerName
                      : styles.empty,
                    { marginTop: -8 },
                  ]}
                >
                  {starterData.find((player: any) =>
                    player.position.includes("IGL")
                  )?.player ?? "Empty"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: -4,
                  }}
                >
                  <Text style={[styles.playerInfoText, { color: colors.IGL }]}>
                    IGL{" "}
                  </Text>
                  <Text style={[styles.playerInfoText, { color: "#ABABAB" }]}>
                    •{" "}
                    {
                      starterData.find((player: any) =>
                        player.position.includes("IGL")
                      )?.teamAbbr
                    }
                  </Text>
                </View>
              </View>
              <Text
                style={
                  starterData.find((player: any) =>
                    player.position.includes("IGL")
                  )?.points != null
                    ? styles.playerName
                    : styles.empty
                }
              >
                {starterData.find((player: any) =>
                  player.position.includes("IGL")
                )?.points ?? "-"}
              </Text>
            </View>
          </View>
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
});
