import Svg, { Path } from "react-native-svg";

export const InfoI = ({
  color = "currentColor",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <Path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4" />
      <Path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />
    </Svg>
  );
};
