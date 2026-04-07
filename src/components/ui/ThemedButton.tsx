// src/components/ui/ThemedButton.tsx
import { useThemeColor } from "@/src/hooks/use-theme-color";
import React, { type ComponentType, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from "react-native";

export type ThemedButtonProps = PressableProps & {
  // Soporta tanto title como children
  title?: string;
  icon?: ComponentType<{ color: string; size: number }>;
  iconPosition?: "left" | "right";
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedButton({
  title,
  children,
  icon: Icon,
  iconPosition = "left",
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedButtonProps) {
  const primaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "primary",
  );
  const secondaryColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "secondary",
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );
  const errorColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "error",
  );

  const getButtonColor = () => {
    if (disabled) return "#9CA3AF";

    switch (variant) {
      case "secondary":
        return secondaryColor;
      case "outline":
      case "ghost":
        return "transparent";
      case "danger":
        return errorColor;
      default:
        return primaryColor;
    }
  };

  const getTextColor = () => {
    if (disabled) return "#6B7280";

    switch (variant) {
      case "outline":
      case "ghost":
        return primaryColor;
      case "danger":
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  };

  const getBorderColor = () => {
    if (variant === "outline") {
      return primaryColor;
    }
    return "transparent";
  };

  const getButtonSize = () => {
    switch (size) {
      case "small":
        return styles.buttonSmall;
      case "large":
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return styles.textSmall;
      case "large":
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 24;
      default:
        return 20;
    }
  };

  // Determinar el contenido a mostrar
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} />;
    }

    return (
      <>
        {Icon && iconPosition === "left" && (
          <Icon color={getTextColor()} size={getIconSize()} />
        )}

        {children ? (
          children
        ) : title ? (
          <Text style={[styles.text, getTextSize(), { color: getTextColor() }]}>
            {title}
          </Text>
        ) : null}

        {Icon && iconPosition === "right" && (
          <Icon color={getTextColor()} size={getIconSize()} />
        )}
      </>
    );
  };

  return (
    <Pressable
      style={(state) => [
        styles.button,
        getButtonSize(),
        {
          backgroundColor: getButtonColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
          opacity: disabled ? 0.6 : state.pressed ? 0.8 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {renderContent()}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Importante para iconos + texto
    gap: 8, // Espaciado entre elementos
  },
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
  },
  buttonMedium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 120,
  },
  buttonLarge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minWidth: 160,
  },
  text: {
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
});
