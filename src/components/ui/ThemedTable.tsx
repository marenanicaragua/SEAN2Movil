import { ThemedButton } from "./ThemedButton";
import { ThemedInput } from "./ThemedInput";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { ThemedDropdownInput } from "./ThemedDropdownInput";
import { Pressable, StyleSheet, View, ScrollView } from "react-native";
import { useState } from "react";

interface Column {
  key: string;
  label: string;
  type: "text" | "number" | "dropdown";
  options?: string[];
  placeholder?: string;
}

interface ThemedTableProps {
  label: string;
  columns: Column[];
  data: Record<string, any>[];
  onChange: (data: Record<string, any>[]) => void;
  required?: boolean;
  error?: string;
}

export function ThemedTable({
  label,
  columns,
  data,
  onChange,
  required,
  error,
}: ThemedTableProps) {
  const addRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.key] = "";
      return acc;
    }, {} as Record<string, any>);
    onChange([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    onChange(newData);
  };

  const updateCell = (rowIndex: number, columnKey: string, value: any) => {
    const newData = [...data];
    newData[rowIndex][columnKey] = value;
    onChange(newData);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="label" style={styles.label}>
        {label}
        {required && <ThemedText style={styles.required}> *</ThemedText>}
      </ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map((column) => (
              <View key={column.key} style={[styles.cell, styles.headerCell]}>
                <ThemedText type="defaultSemiBold" style={styles.headerText}>
                  {column.label}
                </ThemedText>
              </View>
            ))}
            <View style={[styles.cell, styles.actionCell]}>
              <ThemedText type="defaultSemiBold">Acciones</ThemedText>
            </View>
          </View>

          {/* Rows */}
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {columns.map((column) => (
                <View key={column.key} style={styles.cell}>
                  {column.type === "dropdown" ? (
                    <ThemedDropdownInput
                      options={column.options?.map(opt => ({ label: opt, value: opt })) || []}
                      value={row[column.key]}
                      onChange={(value) => updateCell(rowIndex, column.key, value)}
                      placeholder={column.placeholder || `Seleccionar ${column.label}`}
                    />
                  ) : (
                    <ThemedInput
                      placeholder={column.placeholder || `Ingresar ${column.label}`}
                      value={row[column.key]}
                      onChangeText={(value) => updateCell(rowIndex, column.key, value)}
                      keyboardType={column.type === "number" ? "numeric" : "default"}
                    />
                  )}
                </View>
              ))}
              <View style={[styles.cell, styles.actionCell]}>
                <Pressable onPress={() => removeRow(rowIndex)}>
                  <ThemedText style={styles.deleteButton}>🗑️ Eliminar</ThemedText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <ThemedButton
        title="+ Agregar Fila"
        onPress={addRow}
        variant="secondary"
        style={styles.addButton}
      />

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
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: {
    flex: 1,
    padding: 8,
    minWidth: 120,
  },
  headerCell: {
    backgroundColor: "#e0e0e0",
  },
  headerText: {
    fontWeight: "bold",
  },
  actionCell: {
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    color: "#f44336",
  },
  addButton: {
    marginTop: 10,
  },
  error: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
});