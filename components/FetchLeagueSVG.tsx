import { SvgXml } from "react-native-svg";
import { useState } from "react";
import React from "react";

export function LogoSVGComponent({
  uri,
  style,
  add,
  ...props
}: {
  uri: string;
  style?: object; // Optional style prop
  add?: object;
}) {
  const [transformedSvg, setTransformedSVG] = useState("");

  async function fetchLeagueSVG() {
    const response = await fetch(uri);
    let svgContent = await response.text();

    setTransformedSVG(svgContent);
  }

  React.useEffect(() => {
    fetchLeagueSVG();
  }, []);

  if (transformedSvg) {
    return <SvgXml xml={transformedSvg} style={style} {...props} />;
  } else {
    return null;
  }
}
