import { useThemeColor } from "@/src/hooks/use-theme-color";
import { ThemedInputProps } from "@/src/models/types/ThemedInput";
import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  icon: Icon,
  containerStyle,
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundSecondary",
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "border",
  );
  const iconColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon",
  );
  const placeholderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textSecondary",
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, borderColor },
        containerStyle,
      ]}
    >
      {Icon && (
        <View style={styles.icon}>
          <Icon color={iconColor as string} size={20} />
        </View>
      )}
      <TextInput
        style={[styles.input, { color }, style]}
        placeholderTextColor={placeholderColor}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
});
