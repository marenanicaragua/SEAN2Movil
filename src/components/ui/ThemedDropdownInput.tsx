import { ChevronDownI } from "@/assets/icons/ChevronDownI"; // Importamos el nuevo icono
import { useThemeColor } from "@/src/hooks/use-theme-color";
import React, { type ComponentType, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
}: ThemedDropdownInputProps) {
  const [modalVisible, setModalVisible] = useState(false);

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
  const primaryColor = useThemeColor({}, "primary");

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  const renderOption = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => {
        onChange(item.value);
        setModalVisible(false);
      }}
    >
      <ThemedText
        style={[
          styles.optionText,
          { color: item.value === value ? primaryColor : textColor },
        ]}
      >
        {item.label}
      </ThemedText>
    </TouchableOpacity>
  );

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
        onPress={() => setModalVisible(true)}
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

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor }]}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.8,
    maxHeight: height * 0.5,
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)", // Separador ligero
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Manrope-Regular",
  },
});
