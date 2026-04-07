import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useAuth } from "@/src/hooks/useAuth";
import React from "react";
import { StyleSheet } from "react-native";

export function HomeContent() {
  const { signOut } = useAuth();

  return (
    <ThemedView style={{ flex: 1 }}>
      <HeaderBar />

      <ThemedView style={styles.content}>
        <ThemedText type="title">Hola desde index</ThemedText>
        <ThemedText style={styles.description}>
          Has iniciado sesión correctamente.
        </ThemedText>

        <ThemedButton
          title="Cerrar Sesión"
          variant="danger"
          onPress={signOut}
          style={styles.button}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  description: {
    marginBottom: 30,
    opacity: 0.6,
  },
  button: {
    width: "100%",
    maxWidth: 300,
  },
});
