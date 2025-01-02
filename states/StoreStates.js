import { create } from "zustand";

export const useModalStore = create((set) => ({
     isOpened: false,
     setIsOpened: (value) => set({ isOpened: value }),
     isPicked: null,
     setIsPicked: (value) => set({ isPicked: value }),
     isDeletedLeagueOpened: false,
     setIsDeletedLeagueOpened: (value) => set({ isDeletedLeagueOpened: (value) }),
     isSwapOpened: false,
     setIsSwapOpened: (value) => set({ isSwapOpened: value }),
}))

export const useModalDropdownStore = create((set) => ({
     selectedValue: null,
     setSelectedValue: (value) => set({ selectedValue: value }),
}))

export const userDataState = create((set) => ({
     userData: null,
     loading: true,
     setUserData: (data) => set({ userData: data }),
     setLoading: (isLoading) => set({ loading: isLoading }),
     userDataForCurrentLeague: null,
     setUserDataForCurrentLeague: (data) => set({ userDataForCurrentLeague: data }),
}))

export const useCurrentLeagueStore = create((set) => ({
     currentLeagueID: null,
     setCurrentLeagueID: (value) => set({ currentLeagueID: value }),
     currentLeagueData: null,
     setCurrentLeagueData: (value) => set({ currentLeagueData: value }),
}))

export const allLeaguesData = create((set) => ({
     fetchedLeagues: null,
     loading: true,
     setLeaguesData: (league) => set({ fetchedLeagues: league }),
     setLoading: (isLoading) => set({ loading: isLoading }),
}))

export const currentLeagueNav = create((set) => ({
     currnentTab: null,
     setCurrentTab: (tab) => set({ currentTab: tab }),
}))

export const liveData = create((set) => ({
     livePlayerData: [],
     setLivePlayerData: (data) => set({ livePlayerData: data }),
     updatePlayerData: (updatedRow) => set((state) => {
          const rowIndex = state.livePlayerData.findIndex(
               (row) => row.player === updatedRow.player
          )

          if (rowIndex != -1) {
               const updatedData = [...state.livePlayerData]
               updatedData[rowIndex] = updatedRow;
               return { livePlayerData: updatedData };
          } else {
               // Add the row if it doesn't exist
               return { livePlayerData: [...state.livePlayerData, updatedRow] };
          }
     }),
     liveLeagueData: null,
     setLiveLeagueData: (data) => set({ liveLeagueData: data }),
}))

export const navigation = create((set) => ({
     previousScreen: "",
     setPreviousScreen: (screen) => set({ previousScreen: screen }),
     currentScreen: "Home",
     setCurrentScreen: (screen) => set({ currentScreen: screen })
}))

export const playerCardModal = create((set) => ({
     isShowing: false,
     setIsShowing: (val) => set({isShowing: val})
}))