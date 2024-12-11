import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { database } from "../js/supabaseClient";
import { userDataState } from "@/states/StoreStates";

type League = {
  teamsPlaying: []; // Array of players in this league
  // other league properties
  leagueID: string;
};

type LeaguesResponse = {
  data: League[] | null;
  // other properties
};

type UserData = {
  id: string;
  username: string;
  leaguesIsInIDS: string[];
};

interface DataContextType {
  userData: UserData | null;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const userData = userDataState((state) => state.userData);
  const setUserData = userDataState((state) => state.setUserData);

  useEffect(() => {
    async function getUserData() {
      let userData = {
        id: "",
        username: "",
        leaguesIsInIDS: [] as string[],
        friends: [] as string[],
        friend_requests: {}
      };

      const { data } = await database.auth.getUser();

      userData.id = data?.user?.id!;

      const response = await database
        .from("users")
        .select("*")
        .eq("id", userData.id);

      if (!response.error) {
        userData.username = response.data[0]?.username!;
        userData.friends = response.data[0]?.friends;
        userData.friend_requests = response.data[0]?.friendRequests;
      }

      const leagues: LeaguesResponse = await database
        .from("leagues")
        .select("");
      const leaguesUserIsIn = leagues.data?.filter((league) => {
        return league.teamsPlaying.find(
          (player: { playerID: string }) => player.playerID === userData.id
        );
      });

      userData.leaguesIsInIDS =
        leaguesUserIsIn?.map((league) => league.leagueID) ?? [];


      setLoading(false);

      setUserData(userData);
    }

    getUserData();
  }, []);

  return (
    <DataContext.Provider value={{ userData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to access context data
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
};
