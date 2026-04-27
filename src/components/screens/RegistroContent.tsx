import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";

import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

import { useAuth } from "@/src/hooks/useAuth";

const { width, height } = Dimensions.get("window");

export function RegistroContent() {
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const shadowColor = useThemeColor({}, "primary");

    const { token, user } = useAuth(); // 👈 obtén token y user

  console.log("Token en HomeContent:", token); // ✅ ya no será null después del login

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <HeaderBar />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
         
           
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  content: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    marginVertical: height * 0.03,
    marginRight: width * 0.11,
    textAlign: "left",
    fontFamily: "Manrope-Bold",
  },
  subtitle: {
    marginTop: height * 0.01,
    marginBottom: height * 0.05,
    marginHorizontal: width * 0.05,
    textAlign: "left",
    opacity: 0.4,
    lineHeight: 16,
    fontFamily: "Manrope-Light",
    fontSize: width * 0.037,
  },
  card: {
    width: width * 0.9,
    padding: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
  },
  description: {
    marginTop: 10,
    textAlign: "center",
    opacity: 0.6,
  },
});
