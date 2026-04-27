import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useState } from "react";

import { useThemeColor } from "@/src/hooks/use-theme-color";
import { HeaderBar } from "../layout/HeaderBar";

import { Map } from "@/src/components/Map";
import { CoordinateInput } from "../CoordinateInput";

import { Dimensions, ScrollView, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export function TestContent() {
  const [mapPoints, setMapPoints] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <HeaderBar />
      <ThemedView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Registro Geográfico
          </ThemedText>
          <CoordinateInput onPointsChange={setMapPoints} />
          <Map points={mapPoints} />
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 180,
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginVertical: height * 0.03,
    fontFamily: "Manrope-Bold",
  },
});
