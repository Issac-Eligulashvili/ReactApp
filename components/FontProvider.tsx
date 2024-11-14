import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as Font from "expo-font";

const FontContext = createContext(false);

export const useFontsLoaded = () => useContext(FontContext);

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Load the fonts asynchronously using expo-font
        await Font.loadAsync({
          VisbyCF: require("../assets/fonts/VisbyCF.ttf"),
          "The-Bold-Font": require("../assets/fonts/The-Bold-Font.ttf"),
          tex: require("../assets/fonts/tex.otf"),
        });
        setFontsLoaded(true); // Once fonts are loaded, set fontsLoaded to true
        console.log("Fonts loaded successfully!");
      } catch (error) {
        console.error("Error loading fonts", error);
      }
    }

    loadFonts(); // Call the async function to load fonts
  }, []); // The empty dependency array ensures this runs once when the app starts

  return (
    <FontContext.Provider value={fontsLoaded}>{children}</FontContext.Provider>
  );
};
