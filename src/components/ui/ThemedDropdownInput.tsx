import { ChevronDownI } from "@/assets/icons/ChevronDownI"; // Importamos el nuevo icono
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useRouter } from "expo-router";
import React, { type ComponentType, useEffect } from "react";
import {
  DeviceEventEmitter,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, { BounceIn, ZoomOut } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

const { width, height } = Dimensions.get("window");

interface DropdownOption {
  label: string;
  value: string;
}

interface ThemedDropdownInputProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: ComponentType<{ color: string; size: number }>;
  containerStyle?: object;
  lightColor?: string;
  darkColor?: string;
  error?: string;
  entering?: any;
  exiting?: any;
}

export function ThemedDropdownInput({
  value,
  onChange,
  containerStyle,
  lightColor,
  darkColor,
  label, // Mantenemos label y placeholder para la UI del input
  icon: Icon,
  placeholder,
  options,
  error,
  entering = BounceIn.duration(300),
  exiting = ZoomOut.duration(300),
}: ThemedDropdownInputProps) {
  const router = useRouter();

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onValueSelected",
      (data) => {
        if (data.id === label) onChange(data.value);
      },
    );
    return () => subscription.remove();
  }, [label, onChange]);

  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );
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
  const errorColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "error"
  );
  const primaryColor = useThemeColor({}, "primary");

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  const handleOpenModal = () => {
    router.push({
      pathname: "/modal",
      params: {
        title: label,
        options: JSON.stringify(options),
        selectedValue: value,
      },
    });
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <ThemedText type="label" style={styles.labelText}>
          {label}
        </ThemedText>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.container,
          { backgroundColor, borderColor },
          pressed && { opacity: 0.7 },
        ]}
        onPress={handleOpenModal}
      >
        {Icon && (
          <View style={styles.iconLeft}>
            <Icon color={iconColor as string} size={20} />
          </View>
        )}
        <ThemedText
          style={[
            styles.inputValue,
            { color: value ? textColor : placeholderColor },
          ]}
        >
          {selectedLabel}
        </ThemedText>
        <View style={styles.iconRight}>
          <ChevronDownI color={iconColor as string} size={20} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
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
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  inputValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
  },
  errorContainer: {
    marginTop: 4,
    paddingLeft: 12,
  },
  errorText: {
    fontFamily: "Manrope-Regular",
  },
});
