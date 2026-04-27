import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";

import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { FadeInDown } from "react-native-reanimated";
import { ThemedText } from "../ui/ThemedText";

import { useAuth } from "@/src/hooks/useAuth";

const { width, height } = Dimensions.get("window");

export function HomeContent() {
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const shadowColor = useThemeColor({}, "primary");

  const { token, user } = useAuth(); // 👈 obtén token y user

  console.log("Token en HomeContent:", token);
  console.log("Tipo de Token en HomeContent:", typeof token); // Esto mostrará 'string' o 'object' (para null)

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <HeaderBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.content}
        >
          <ThemedText type="title" style={styles.title}>
            Superviciones Pendientes
          </ThemedText>

          <ThemedView
            variant="secondary"
            style={[
              styles.card,
              { boxShadow: `0px 10px 20px ${shadowColor}33` },
            ]}
          >
            <ThemedText type="subtitle" style={{ color: primaryColor }}>
              Panel de Control
            </ThemedText>
            <ThemedText style={styles.description}>
              Has iniciado sesión correctamente. Desde aquí podrás gestionar
              todas tus solicitudes de transporte de manera rápida y segura.
            </ThemedText>
          </ThemedView>
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
    padding: 20,
  },
  title: {
    marginVertical: height * 0.03,
    fontFamily: "Manrope-Bold",
  },
  card: {
    marginTop: height * 0.05,
    width: width * 0.9,
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  description: {
    marginTop: 15,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 22,
  },
});
