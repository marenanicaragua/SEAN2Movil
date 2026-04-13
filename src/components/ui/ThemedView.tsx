// src/components/ui/ThemedView.tsx
import { useThemeColor } from "@/src/hooks/use-theme-color";
import Animated from "react-native-reanimated";
import { type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "secondary" | "primary";
  padding?: number;
  enteringAnimation?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "default",
  padding,
  enteringAnimation = true,
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
    getBackgroundKey()
  );

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          // 👇 Propiedades CSS nativas de Reanimated 4.1.1
          transitionProperty: 'background-color, opacity, transform',
          transitionDuration: '350ms',
          transitionTimingFunction: 'ease-in-out',
          // Animación de entrada
          opacity: enteringAnimation ? 1 : 1,
          transform: [{ scale: enteringAnimation ? 1 : 1 }],
        },
        padding !== undefined && { padding },
        style,
      ]}
      {...otherProps}
    />
  );
}