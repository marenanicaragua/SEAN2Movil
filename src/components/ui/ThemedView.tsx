// src/components/ui/ThemedView.tsx
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "secondary" | "primary";
  padding?: number;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "default",
  padding,
  ...otherProps
}: ThemedViewProps) {
  // Mapeo simple de variantes a colores
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
    <View
      style={[
        { backgroundColor },
        padding !== undefined && { padding },
        style,
      ]}
      {...otherProps}
    />
  );
}