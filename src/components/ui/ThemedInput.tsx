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
          textAlignVertical={rest.multiline ? "top" : "center"}
          {...rest}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: 10,
    // Eliminado paddingVertical para depender del marginBottom de formInput
  },
  labelText: {
    marginLeft: 4, // Un pequeño margen para alinear con el borde redondeado
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50, // Altura mínima en lugar de fija
    borderWidth: width * 0.005,
    borderRadius: width * 0.1, // Un radio más moderado para que no se corte el texto
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    fontFamily: "Manrope-Regular",
  },
});
