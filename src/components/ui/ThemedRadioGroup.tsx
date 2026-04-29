import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Pressable, StyleSheet, View } from "react-native";

interface RadioOption {
  label: string;
  value: string;
}

interface ThemedRadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  critical?: boolean;
}

export function ThemedRadioGroup({
  label,
  options,
  value,
  onChange,
  required,
  error,
  critical,
}: ThemedRadioGroupProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="label" style={styles.label}>
        {label}
        {required && <ThemedText style={styles.required}> *</ThemedText>}
        {critical && <ThemedText style={styles.critical}> (Crítica)</ThemedText>}
      </ThemedText>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
              value === option.value && styles.optionSelected,
              critical && value === "No" && value === option.value && styles.criticalOption,
            ]}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.radio}>
              {value === option.value && <View style={styles.radioSelected} />}
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
  critical: {
    color: "#f44336",
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
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
  criticalOption: {
    backgroundColor: "rgba(244,67,54,0.1)",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
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