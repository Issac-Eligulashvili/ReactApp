import React, { useEffect, useState } from 'react';
import { database } from '@/js/supabaseClient';
import { liveData } from '@/states/StoreStates';

export const RealTimeListener = () => {
     const setLivePlayerData = liveData((state) => state.setLivePlayerData);
     const updatePlayerData = liveData((state) => state.updatePlayerData);

     useEffect(() => {
          async function fetchTableData() {
               const { data, error } = await database.from('players').select('*');
               if (error) {
                    console.error('Error fetching players:', error);
               } else {
                    setLivePlayerData(data); // Store the entire table
               }
          }

          fetchTableData();

          const subscription = database
               .channel('players-updates')
               .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'players' },
                    (payload) => {
                         console.log('Change received:', payload);
                         updatePlayerData(payload.new); // Store the updated row in Zustand
                    }
               )
               .subscribe();

          return () => {
               database.removeChannel(subscription);
          };
     }, [setLivePlayerData, updatePlayerData]);

     return null; // This component doesn't render anything
}