import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";

import { useThemeColor } from "@/src/hooks/use-theme-color";
import { HeaderBar } from "../layout/HeaderBar";

import { FormRequest, Question } from "@/src/components/forms/FormRequest"; // Mantén la importación de la interfaz Question
import { questions as allQuestions } from "@/src/services/database/Question"; // Importa el array de preguntas

import { Dimensions, ScrollView, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export function TestContent() {
  const backgroundColor = useThemeColor({}, "background");

  const formQuestions: Question[] = allQuestions as Question[]; // Usa el array importado

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("Datos del formulario:", data);
    // Los puntos estarán en data.ubicacion_gps
  };

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

          <FormRequest
            title="Información de Campo"
            questions={formQuestions} // Pasa el array importado
            onSubmit={handleFormSubmit}
          />
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
