import Svg, { Path } from "react-native-svg";

export const EyeI = ({
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
      <Path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <Path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </Svg>
  );
};
