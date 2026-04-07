import { useThemeColor } from "@/src/hooks/use-theme-color";
import { ThemedInputProps } from "@/src/models/types/ThemedInput";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Extendemos la interfaz localmente para incluir el label si no está en ThemedInputProps
interface Props extends ThemedInputProps {
  label?: string;
}

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  icon: Icon,
  label,
  containerStyle,
  ...rest
}: Props) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
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
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <ThemedText type="label" style={styles.labelText}>
          {label}
        </ThemedText>
      )}
      <View style={[styles.container, { backgroundColor, borderColor }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: height * 0.02,
  },
  labelText: {
    marginLeft: 4, // Un pequeño margen para alinear con el borde redondeado
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: height * 0.06,
    borderWidth: width * 0.005,
    borderRadius: width * 0.08,
    paddingHorizontal: 12,
    paddingVertical: height * 0.027,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: height * 0.1,
  },
});
