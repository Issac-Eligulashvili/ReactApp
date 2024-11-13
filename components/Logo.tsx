import React from "react";
import Svg, { Path } from "react-native-svg";

interface CustomProps {
  height: number;
  width: number;
  style?: object;
}

const Logo: React.FC<CustomProps> = ({ height, width, style }) => {
  return (
    <Svg
      viewBox="0 0 828.32 828.32"
      width={width}
      height={height}
      style={style}
    >
      <Path
        d="M327.75,0h172.82l43.75,43.75v187.65l-130.16,103.21-130.16-103.21V43.75L327.75,0h0ZM828.32,327.75v172.82l-43.75,43.75h-187.65l-103.21-130.16,103.21-130.16h187.65l43.75,43.75h0ZM500.57,828.32h-172.82l-43.75-43.75v-187.65l130.16-103.21,130.16,103.21v187.65l-43.75,43.75ZM0,500.57v-172.82l43.75-43.75h187.65l103.21,130.16-103.21,130.16H43.75L0,500.57Z"
        fillRule="evenodd"
        fill="white"
      />
    </Svg>
  );
};

export default Logo;
