// src/components/ui/ThemedText.tsx
import { useThemeColor } from "@/src/hooks/use-theme-color";
import React from "react";
import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 
    | "title" 
    | "subtitle" 
    | "body" 
    | "bodyLarge" 
    | "bodySmall" 
    | "caption" 
    | "button" 
    | "label"
    | "link";
  align?: "auto" | "left" | "right" | "center" | "justify";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  align = "auto",
  children,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const getTypeStyles = () => {
    switch (type) {
      case "title":
        return styles.title;
      case "subtitle":
        return styles.subtitle;
      case "bodyLarge":
        return styles.bodyLarge;
      case "bodySmall":
        return styles.bodySmall;
      case "caption":
        return styles.caption;
      case "button":
        return styles.button;
      case "label":
        return styles.label;
      default:
        return styles.body;
    }
  };

  return (
    <Text
      style={[
        getTypeStyles(),
        { color, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: "#6B7280",
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 4,
  },
});