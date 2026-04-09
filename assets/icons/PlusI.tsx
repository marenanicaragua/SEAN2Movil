import Svg, { Path } from "react-native-svg";

export const PlusI = ({
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <Path d="M12 5l0 14" />
      <Path d="M5 12l14 0" />
    </Svg>
  );
};
