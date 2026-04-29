import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";

interface CheckboxOption {
  label: string;
  value: string;
}

interface ThemedCheckboxProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  error?: string;
}

export function ThemedCheckbox({
  label,
  options,
  selectedValues,
  onChange,
  required,
  error,
}: ThemedCheckboxProps) {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="label" style={styles.label}>
        {label}
        {required && <ThemedText style={styles.required}> *</ThemedText>}
      </ThemedText>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
              selectedValues.includes(option.value) && styles.optionSelected,
            ]}
            onPress={() => toggleOption(option.value)}
          >
            <View style={styles.checkbox}>
              {selectedValues.includes(option.value) && (
                <View style={styles.checkboxSelected} />
              )}
            </View>
            <ThemedText style={styles.optionLabel}>{option.label}</ThemedText>
          </Pressable>
        ))}
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  optionsContainer: {
    flexDirection: "column",
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionSelected: {
    backgroundColor: "rgba(0,122,255,0.1)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#007AFF",
  },
  optionLabel: {
    fontSize: 14,
  },
  error: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
});