import { Dropdown } from 'react-native-element-dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { useCurrentLeagueStore, allLeaguesData, useModalStore } from '@/states/StoreStates';
import { userDataState } from '@/states/StoreStates';
import { database } from '@/js/supabaseClient';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import CustomModal from './ModalComponent';
import isEqual, { random } from 'lodash';

let navLinks: string[] = [];

type League = {
     "league-name": string; // Array of players in this league
     // other league properties
     leagueID: string;
};

export default function LeagueScreenNav() {
     const currentLeagueID = useCurrentLeagueStore((state) => state.currentLeagueID);
     const setCurrentLeagueID = useCurrentLeagueStore((state) => state.setCurrentLeagueID);
     const currentLeagueData = useCurrentLeagueStore((state) => state.currentLeagueData);
     const setCurrentLeagueData = useCurrentLeagueStore((state) => state.setCurrentLeagueData);
     const userData = userDataState((state) => state.userData);
     const userDataForCurrentLeague = userDataState((state) => state.userDataForCurrentLeague);
     const setUserDataForCurrentLeague = userDataState((state) => state.setUserDataForCurrentLeague);
     const isDeleteLeaugeOpened = useModalStore((state) => state.isDeletedLeagueOpened);
     const setIsDeleteLeagueOpened = useModalStore((state) => state.setIsDeletedLeagueOpened)
     const leaguesData = allLeaguesData((state) => state.fetchedLeagues);
     const setLeaguesData = allLeaguesData((state) => state.setLeaguesData);
     const isLoading = allLeaguesData((state) => state.loading);
     const setIsPicked = useModalStore((state) => state.setIsPicked);
     const [loading, setLoading] = useState(true);
     const [activeButton, setActiveButton] = useState<number>(1);
     const navigation = useNavigation();

     let data: any[] = [];



     if (!isLoading) {
          data = leaguesData.map((league: League) => ({
               label: league["league-name"],
               value: league.leagueID,
          }));
     }

     useEffect(() => {
          setIsPicked(null);
     }, [])

     useEffect(() => {
          setUserDataForCurrentLeague(currentLeagueData.teamsPlaying.find((player: { playerID: any; }) => player.playerID === userData.id));
          const isDrafted = currentLeagueData.isDrafted;
          navLinks = ["Teams", "", "Players", "League"];
          isDrafted ? navLinks[1] = "Matchup" : navLinks[1] = "Draft";
     }, [currentLeagueData]);

     useEffect(() => {
          setLoading(false);
          console.log(userDataForCurrentLeague);
     }, [userDataForCurrentLeague]);

     return (
          <View style={styles.container}>
               <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 43,
               }}>
                    <Pressable onPress={() => navigation.goBack()}>
                         <MaterialIcons name="keyboard-arrow-left" size={24} color="white" />
                    </Pressable>
                    <View style={{ justifyContent: 'center', width: "50%" }}>
                         <Dropdown
                              data={data || []}
                              labelField=""
                              valueField="value"
                              placeholder='Choose League'
                              value={currentLeagueID}
                              onChange={async (item) => {
                                   setCurrentLeagueID(item.value);

                                   const response = await database.from("leagues").select("").eq('leagueID', item.value);

                                   if (!response.error) {
                                        setCurrentLeagueData(response.data[0]);
                                   }
                                   console.log('Selected League ID', item.value);
                                   console.log(userDataForCurrentLeague);
                              }}
                              renderItem={(item) => (
                                   <View style={styles.item}>
                                        <Text style={styles.itemText}>{item.label}</Text>
                                   </View>
                              )}
                              renderRightIcon={() => (
                                   null
                              )}
                              containerStyle={{
                                   borderWidth: 0,
                                   backgroundColor: "rgb(46, 26, 71)"
                              }}
                              renderLeftIcon={() => (
                                   <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}>
                                        <Text style={{
                                             color: 'white',
                                             fontFamily: "VisbyCF",
                                             fontSize: 16,
                                        }}>{currentLeagueID ? data.find((item) => item.value === currentLeagueID)?.label : 'Select an item'}</Text>
                                        <MaterialIcons name="keyboard-arrow-down" size={16} color="white" />
                                   </View>
                              )}
                         />
                    </View>
                    {loading ? <Text>Loading...</Text> :
                         userDataForCurrentLeague.isAdmin ?
                              <Pressable onPress={() => { setIsDeleteLeagueOpened(true) }}>
                                   <Feather name="trash" size={20} color="white" />
                              </Pressable> :
                              <Pressable>
                                   <Feather name="log-out" size={20} color="white" />
                              </Pressable>
                    }
               </View>
               <View style={{ flexDirection: "row", marginTop: 33 }}>
                    {navLinks.map((link, index) => (
                         <Pressable key={index} style={[
                              styles.navLink,
                              activeButton === index ? { borderColor: "rgba(255,255,255,1)" } : { borderColor: "rgba(255,255,255,0.3)" }
                         ]}
                              onPress={() => {
                                   setActiveButton(index)
                              }}
                         >
                              <Text style={[{
                                   fontFamily: "VisbyCF",
                                   fontSize: 16,
                              }, activeButton === index ? { color: "white" } : { color: "#A9A9B0" }]}>
                                   {link}
                              </Text>
                         </Pressable>
                    ))}
               </View>
               <CustomModal isOpen={isDeleteLeaugeOpened}>
                    <View style={{
                         backgroundColor: "#2E1A47",
                         padding: 20,
                         borderRadius: 10,
                         width: "80%",
                    }}>
                         <View style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center"
                         }}>
                              <Text style={{
                                   fontFamily: "The-Bold-Font",
                                   color: "white",
                                   fontSize: 24
                              }}>
                                   Delete League
                              </Text>
                              <Pressable onPress={() => setIsDeleteLeagueOpened(false)}>
                                   <MaterialIcons name="close" size={24} color="white" />
                              </Pressable>
                         </View>
                         <Text style={{
                              fontFamily: "tex",
                              color: "#A9A9B0"
                         }}>
                              Are you sure you want to delete this league? You will loose all league data.
                         </Text>
                         <Pressable style={styles.btn} onPress={async () => {
                              await database.from("leagues").delete().eq("leagueID", currentLeagueID);
                              let data = leaguesData;
                              let index = data.findIndex(
                                   (league: any) => league.leagueID == currentLeagueID
                              )
                              data.splice(index, 1);

                              const randomIndex: number = Math.floor(Math.random() * data.length);
                              const randomLeagueID = data[randomIndex].leagueID;
                              setCurrentLeagueID(randomLeagueID);

                              const response = await database.from("leagues").select("").eq('leagueID', randomLeagueID);

                              if (!response.error) {
                                   setCurrentLeagueData(response.data[0]);
                              }

                              setLeaguesData(data);
                              setIsDeleteLeagueOpened(false);
                         }}>
                              <Text style={{
                                   fontFamily: "tex",
                                   fontSize: 16,
                                   letterSpacing: 2,
                                   textAlign: "center",
                                   color: "white"
                              }}>Delete League</Text>
                         </Pressable>
                    </View>
               </CustomModal >
               {/* TODO: Finish creating the league screen with a working functional leage navbar. */}
          </View >
     )
}

const styles = StyleSheet.create({
     container: {
          paddingTop: 45,
          width: "100%",
     },
     iconStyle: {
          width: 20,
          height: 20,
     },
     dropdown: {
          backgroundColor: '#f9f9f9',
          justifyContent: 'center', // Center content vertically
          width: '80%', // Set the dropdown button width to 80% of the parent container
     },
     selectedItemStyle: {
          backgroundColor: '#b0e0e6', // Background color for selected item
     },
     item: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: 'rgb(46, 26, 71)',
     },
     itemText: {
          fontSize: 16,
          color: "white"
     },
     navLink: {
          width: "25%",
          justifyContent: "center",
          alignItems: "center",
          borderBottomWidth: 2,
          paddingVertical: 15,
     },
     btn: {
          padding: 7,
          backgroundColor: "#FF0000",
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
     },
})