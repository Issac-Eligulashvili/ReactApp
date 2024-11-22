import { Svg, Path, Polygon, G } from "react-native-svg";
import { View } from "react-native";

export function LogoSVGComponent({ uri }) {
     let transformedSvg;

     async function fetchLeagueSVG() {
          const response = await fetch(uri);
          const svgContent = await response.text();

          function parseHTML() {
               const parser = new DOMParser();

               const doc = parser.parseFromString(svgContent, 'text/html');

               const svg = doc.querySelector("svg");

               console.log(svg);
          }

          parseHTML();
     }

     fetchLeagueSVG();

     return <View>
          {transformedSvg}
     </View>;
}

