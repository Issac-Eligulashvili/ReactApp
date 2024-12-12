import React, { useEffect, useState } from "react";
import { database } from "@/js/supabaseClient";
import { liveData, useCurrentLeagueStore, userDataState } from "@/states/StoreStates";

export const RealTimeListener = () => {
  const setLivePlayerData = liveData((state) => state.setLivePlayerData);
  const updatePlayerData = liveData((state) => state.updatePlayerData);
  const setLLD = liveData((state) => state.setLiveLeagueData);
  const currentLeagueID = useCurrentLeagueStore(
    (state) => state.currentLeagueID
  );
  const setUserData = userDataState((state) => state.setUserData);

  useEffect(() => {
    async function fetchTableData() {
      const { data, error } = await database.from("players").select("*");
      if (error) {
        console.error("Error fetching players:", error);
      } else {
        setLivePlayerData(data); // Store the entire table
      }
    }

    fetchTableData();

    const subscription = database
      .channel("players-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        (payload) => {
          updatePlayerData(payload.new); // Store the updated row in Zustand
        }
      )
      .subscribe();

    return () => {
      database.removeChannel(subscription);
    };
  }, [setLivePlayerData, updatePlayerData]);

  useEffect(() => {
    const subscription = database
      .channel("CL-Draft")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leagues" },
        (payload: any) => {
          const rowID = payload.new.leagueID;
          const takenPlayers = payload.new.taken_players;
          const isDrafting = payload.new.isDrafting;
          const currentTurn = payload.new.currentTurn;
          const isForward = payload.new.forward;
          if (rowID === currentLeagueID) {
            setLLD({
              takenPlayers: takenPlayers,
              isDrafting: isDrafting,
              currentTurn: currentTurn,
              availablePlayers: payload.new.available_players,
              teamsPlaying: payload.new.teamsPlaying,
              isForward: isForward
            });
          }
        }
      )
      .subscribe();

    return () => {
      database.removeChannel(subscription);
    };
  }, [setLLD, currentLeagueID]);

  useEffect(() => {
    const subscription = database
      .channel("live-user-data")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        async (payload: any) => {
          const { data } = await database.auth.getUser();
          const userID = payload.new.id;
          if (userID === data?.user?.id) {
            setUserData(payload.new);
          }
        }
      ).subscribe()
  }, [setUserData])

  return null; // This component doesn't render anything
};
