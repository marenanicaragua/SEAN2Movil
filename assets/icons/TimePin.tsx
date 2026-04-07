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
      <Path d="M20.971 11.278a9 9 0 1 0 -8.313 9.698" />
      <Path d="M12 7v5l1.5 1.5" />
      <Path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879" />
      <Path d="M19 18v.01" />
    </Svg>
  );
};
