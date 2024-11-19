import { create } from "zustand";

export const useModalStore = create((set) => ({
     isOpened: false,
     setIsOpened: (value) => set({ isOpened: value }),
     isPicked: null,
     setIsPicked: (value) => set({ isPicked: value }),
     isDeletedLeagueOpened: false,
     setIsDeletedLeagueOpened: (value) => set({ isDeletedLeagueOpened: (value) }),
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