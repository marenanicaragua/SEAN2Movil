// src/components/ui/ThemedView.tsx
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { type ViewProps } from "react-native";
import Animated from "react-native-reanimated";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "secondary" | "primary";
  padding?: number;
  entering?: any;
  exiting?: any;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "default",
  padding,
  entering,
  exiting,
  ...otherProps
}: ThemedViewProps) {
  const getBackgroundKey = () => {
    switch (variant) {
      case "secondary":
        return "backgroundSecondary";
      case "primary":
        return "primary";
      default:
        return "background";
    }
  };

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getBackgroundKey(),
  );

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={[
        {
          backgroundColor,
          // 👇 Propiedades CSS nativas de Reanimated 4.1.1
          transitionProperty: "background-color, opacity, transform",
          transitionDuration: "350ms",
          transitionTimingFunction: "ease-in-out",
        },
        padding !== undefined && { padding },
        style,
      ]}
      {...otherProps}
    />
  );
}
