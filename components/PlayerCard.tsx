import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import colors, { teamBGColors } from "@/assets/colors";
import Svg, { Pattern, Image as I, Rect } from "react-native-svg";
import { positionAbbriviations } from "@/assets/positionIcons";
import Feather from "@expo/vector-icons/Feather";
import { playerCardModal } from "@/states/StoreStates";
import { FlatList, ScrollView } from "react-native-gesture-handler";

type Player = {
  position: string;
  player: string;
  image_link: string;
  team: string;
  teamAbbr: string;
  points?: number;
  match_data?: match[];
  region: string;
};

type PlayerData = {
  acs: number | string;
  plus_minus: number | string;
  points: number | string;
  r_squared: number | string;
};
type PlayerDataValArr = {
  acs: number[];
  plus_minus: number[];
  points: number[];
  r_squared: number[];
};

type match = {
  vs: string;
  event: string;
  series: string;
  stats: {
    fd: number;
    fk: number;
    acs: number;
    adr: number;
    "hs%": number;
    kast: number;
    kills: number;
    deaths: number;
    points: number;
    r_squared: number;
    plus_minus: number;
    assits: number;
  };
};

type column = {
  statType: string;
  stats: number[];
};

export default function PlayerCard({ player }: { player: Player }) {
  const regionShort = {
    Americas: "na",
    Europe: "eu",
    CN: "cn",
    APAC: "ap",
  };
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState<PlayerData>();
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const setShowPlayerCard = playerCardModal((state) => state.setIsShowing);

  useEffect(() => {
    function calcAvg(val: number[]) {
      let sum = 0;
      for (const v of val) {
        sum += v;
      }
      const avg = sum / val.length;
      return avg;
    }
    const pDataValArr = {
      acs: [] as number[],
      plus_minus: [] as number[],
      points: [] as number[],
      r_squared: [] as number[],
    } as PlayerDataValArr;
    if (player.match_data) {
      player.match_data.forEach((match: match) => {
        pDataValArr["acs"].push(match.stats.acs);
        pDataValArr["plus_minus"].push(match.stats.plus_minus);
        pDataValArr["points"].push(match.stats.points);
        pDataValArr["r_squared"].push(match.stats.r_squared);
      });
      const pData = {
        acs: Math.round(calcAvg(pDataValArr.acs)),
        plus_minus: Math.round(calcAvg(pDataValArr.plus_minus)),
        points: Number(calcAvg(pDataValArr.points).toFixed(2)),
        r_squared: Number(calcAvg(pDataValArr.r_squared).toFixed(2)),
      };
      setPlayerData(pData);
    } else {
    }
  }, []);

  const fixedHeight = 40;
  let svgUrl;

  Platform.OS === "web"
    ? (svgUrl = `https://issac-eligulashvili.github.io/logo-images/${player?.team}.svg`)
    : (svgUrl = `https://issac-eligulashvili.github.io/Logo-Images-PNG/${player?.team}.png`);

  useEffect(() => {
    Image.getSize(svgUrl, (width, height) => {
      const aspectRatio = width / height;
      setSvgDimensions({
        width: fixedHeight * aspectRatio, // Calculate width based on aspect ratio
        height: fixedHeight, // Fixed height for uniformity
      });
    });
  }, [svgUrl]);

  function renderRow({ item }: { item: match }) {
    function getBGColor(
      value: number,
      range: { upper: number; lower: number },
      stat: string
    ) {
      const green = "rgb(145 255 145)";
      const red = "rgb(255 97 97)";
      const yellow = "rgb(255 255 103)";
      if (stat === "fd") {
        if (value < range.lower) {
          return green;
        } else if (value > range.upper) {
          return red;
        } else {
          return yellow;
        }
      }
      if (value > range.upper) {
        return green;
      } else if (value < range.lower) {
        return red;
      } else {
        return yellow;
      }
    }

    const kda = (item.stats.kills + item.stats.assits) / item.stats.deaths;

    const averages = {
      r_squared: { lower: 0.8, upper: 1.0 },
      acs: { lower: 180, upper: 220 },
      kda: { lower: 1.0, upper: 2.3 },
      plus_minus: { lower: -5, upper: 5 },
      kast: { lower: 65, upper: 75 },
      adr: { lower: 140, upper: 160 },
      hs: { lower: 20, upper: 40 },
      fk: { lower: 3, upper: 5 },
      fd: { lower: 3, upper: 5 },
    };

    return (
      <View style={styles.row}>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: "transparent",
              color: "white",
              width: 38,
              textAlign: "center",
            },
          ]}
        >
          {item.vs}
        </Text>
        <Text style={[styles.cell, { backgroundColor: "rgb(211 211 211)" }]}>
          {item.stats.points}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(
                item.stats.r_squared,
                averages.r_squared,
                "r_squared"
              ),
            },
          ]}
        >
          {item.stats.r_squared}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(item.stats.acs, averages.acs, "acs"),
            },
          ]}
        >
          {item.stats.acs}
        </Text>
        <View
          style={[
            styles.cell,
            {
              flexDirection: "row",
              width: "auto",
              backgroundColor: getBGColor(kda, averages.kda, ""),
            },
          ]}
        >
          <Text style={[styles.cellText, { marginLeft: 5, width: 28 }]}>
            {item.stats.kills}
          </Text>
          <Text style={styles.cellText}>/</Text>
          <Text style={[styles.cellText, { marginHorizontal: 2, width: 28 }]}>
            {item.stats.deaths}
          </Text>
          <Text style={styles.cellText}>/</Text>
          <Text style={[styles.cellText, { marginRight: 5, width: 28 }]}>
            {item.stats.assits}
          </Text>
        </View>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(
                item.stats.plus_minus,
                averages.plus_minus,
                "plus_minus"
              ),
            },
          ]}
        >
          {item.stats.plus_minus}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(
                item.stats.kast,
                averages.kast,
                "kast"
              ),
            },
          ]}
        >
          {item.stats.kast}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(item.stats.adr, averages.adr, "adr"),
            },
          ]}
        >
          {item.stats.adr}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(item.stats["hs%"], averages.hs, "hs"),
            },
          ]}
        >
          {item.stats["hs%"]}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(item.stats.fk, averages.fk, "fk"),
            },
          ]}
        >
          {item.stats.fk}
        </Text>
        <Text
          style={[
            styles.cell,
            {
              backgroundColor: getBGColor(item.stats.fd, averages.fd, "fd"),
            },
          ]}
        >
          {item.stats.fd}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          width: "100%",
          backgroundColor: teamBGColors[
            `${player.team}BG`
          ] as keyof typeof teamBGColors,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <Pressable
          style={{ position: "absolute", right: 10, top: 10, zIndex: 100 }}
          onPress={() => {
            setShowPlayerCard(false);
          }}
        >
          <Feather name="x" size={20} color="white" />
        </Pressable>
        <Svg
          height="100%"
          width="100%"
          style={{ position: "absolute", left: 0, top: 0, opacity: 0.43 }}
        >
          {/* Define a pattern to repeat */}
          <Pattern
            id="pattern"
            patternUnits="userSpaceOnUse"
            width={svgDimensions.width + 10} // Width of the pattern tile
            height={fixedHeight + 10} // Height of the pattern tile
          >
            <I
              xlinkHref={svgUrl} // Replace with your SVG URL
              height={40} // Set a consistent height
              width={svgDimensions.width}
              preserveAspectRatio="xMidYMid meet" // Ensures aspect ratio is preserved
            />
          </Pattern>
          {/* Fill the whole background with the pattern */}
          <Rect width="100%" height="100%" fill="url(#pattern)" />
        </Svg>
        <View
          style={{ width: "35%", justifyContent: "flex-end", maxWidth: 220 }}
        >
          {player?.image_link?.substring(0, 2) === "//" ? (
            <Image
              source={{ uri: `https:${player?.image_link}` }}
              style={styles.playerImage}
            />
          ) : (
            <Image
              source={require("@/assets/img/base/ph/sil.png")}
              style={styles.playerImage}
            />
          )}
          <View
            style={{
              backgroundColor: "#27183f",
              width: "100%",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              position: "absolute",
              bottom: 0,
              left: 0,
              padding: 10,
              paddingBottom: 0,
            }}
          >
            <Text style={[styles.statText, { fontSize: 14 }]}>
              {player.team.replace("_", " ")}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text
                style={[
                  styles.playerInfoText,
                  {
                    color: colors[player?.position as keyof typeof colors],
                  },
                ]}
              >
                {positionAbbriviations[
                  player?.position as keyof typeof positionAbbriviations
                ]?.toUpperCase()}{" "}
              </Text>
              <Text style={[styles.playerInfoText, { color: "#ABABAB" }]}>
                • {player?.teamAbbr}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: "65%",
            height: "100%",
            paddingLeft: 20,
            paddingTop: 20,
          }}
        >
          <Text style={{ fontFamily: "tex", fontSize: 24, color: "white" }}>
            {player.player}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.statCont}>
              <Text style={styles.statName}>PTS</Text>
              <Text style={styles.statText}>
                {playerData?.points ? playerData.points : "N/A"}
              </Text>
            </View>
            <View style={styles.statCont}>
              <Text style={styles.statName}>ACS</Text>
              <Text style={styles.statText}>
                {playerData?.acs ? playerData.acs : "N/A"}
              </Text>
            </View>
            <View style={styles.statCont}>
              <Text style={styles.statName}>+/-</Text>
              <Text style={styles.statText}>
                {playerData?.plus_minus ? playerData?.plus_minus : "N/A"}
              </Text>
            </View>
            <View style={styles.statCont}>
              <Text style={styles.statName}>R²</Text>
              <Text style={styles.statText}>
                {playerData?.r_squared ? playerData.r_squared : "N/A"}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.subtext,
              {
                fontStyle: "italic",
                marginTop: 5,
              },
            ]}
          >
            *AVGS Over Last 5 games*
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#27183f",
          flexGrow: 1,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      >
        <ScrollView
          nestedScrollEnabled={true}
          style={{
            flexGrow: 1,
            paddingBottom: 8,
            paddingRight: 8,
          }}
          contentContainerStyle={{ width: "100%", flexDirection: "column" }}
        >
          <Text style={[styles.text, { marginLeft: 10, marginTop: 10 }]}>
            Stats
          </Text>
          <FlatList
            scrollEnabled={true}
            data={player.match_data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRow}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 2,
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={[
                    styles.cell,
                    {
                      backgroundColor: "transparent",
                      color: "white",
                      width: 38,
                      textAlign: "center",
                    },
                    styles.cellHeader,
                  ]}
                >
                  OPP
                </Text>
                <Text style={[styles.cell, styles.cellHeader]}>PTS</Text>
                <Text style={[styles.cell, styles.cellHeader]}>R²</Text>
                <Text style={[styles.cell, styles.cellHeader]}>ACS</Text>
                <View
                  style={[
                    styles.cell,
                    {
                      flexDirection: "row",
                      width: "auto",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      { marginLeft: 5, width: 28 },
                      styles.cellHeader,
                    ]}
                  >
                    K
                  </Text>
                  <Text style={[styles.cellText, styles.cellHeader]}>/</Text>
                  <Text
                    style={[
                      styles.cellText,
                      { marginHorizontal: 2, width: 28 },
                      styles.cellHeader,
                    ]}
                  >
                    D
                  </Text>
                  <Text style={[styles.cellText, styles.cellHeader]}>/</Text>
                  <Text
                    style={[
                      styles.cellText,
                      { marginRight: 5, width: 28 },
                      styles.cellHeader,
                    ]}
                  >
                    A
                  </Text>
                </View>
                <Text style={[styles.cell, styles.cellHeader]}>+/-</Text>
                <Text style={[styles.cell, styles.cellHeader]}>KAST</Text>
                <Text style={[styles.cell, styles.cellHeader]}>ADR</Text>
                <Text style={[styles.cell, styles.cellHeader]}>HS%</Text>
                <Text style={[styles.cell, styles.cellHeader]}>FK</Text>
                <Text style={[styles.cell, styles.cellHeader]}>FD</Text>
              </View>
            }
            contentContainerStyle={{ flexDirection: "column" }}
            horizontal
            bounces={false}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={Platform.OS === "ios" ? { flex: 0 } : { flex: 1 }}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  playerImage: {
    height: 130,
    width: 130,
  },
  svgStyles: {
    height: 100,
    position: "absolute",
    left: 40,
    top: 70,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: -1,
  },
  subtext: {
    fontSize: 8,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "The-Bold-Font",
  },
  statName: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "The-Bold-Font",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
  statCont: {
    width: "25%",
    padding: 2,
  },
  statText: {
    fontFamily: "The-Bold-Font",
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  playerInfoText: {
    fontFamily: "tex",
    fontSize: 11,
  },
  row: {
    height: 20,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cell: {
    borderRadius: 2,
    color: "black",
    marginLeft: 2,
    padding: 2,
    width: 37,
    textAlign: "center",
    fontFamily: "VisbyCF",
    fontSize: 12,
  },
  cellText: {
    textAlign: "center",
    fontFamily: "VisbyCF",
    color: "black",
  },
  cellHeader: {
    textAlign: "center",
    fontFamily: "VisbyCF",
    color: "white",
  },
  text: {
    color: "white",
    fontFamily: "tex",
    fontSize: 16,
  },
});
