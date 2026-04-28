import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { DeviceEventEmitter, ScrollView, StyleSheet } from "react-native";
import { CoordinateInput } from "../src/components/CoordinateInput";
import { Map } from "../src/components/Map";
import { ThemedButton } from "../src/components/ui/ThemedButton";
import { ThemedView } from "../src/components/ui/ThemedView";

interface Point {
  latitude: number;
  longitude: number;
}

export default function SelectCoordinatesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { initialPoints, callbackId } = params;

  const [selectedPoints, setSelectedPoints] = React.useState<Point[]>([]);

  // Cargar puntos iniciales si se proporcionan al navegar
  React.useEffect(() => {
    if (initialPoints && typeof initialPoints === "string") {
      try {
        setSelectedPoints(JSON.parse(initialPoints));
      } catch (e) {
        console.error("Failed to parse initialPoints:", e);
      }
    }
  }, [initialPoints]);

  // Callback para recibir los puntos del CoordinateInput
  const handlePointsChange = (points: Point[]) => {
    setSelectedPoints(points);
  };

  // Función para confirmar y enviar los puntos de vuelta al formulario
  const handleConfirmPoints = () => {
    if (callbackId && typeof callbackId === "string") {
      DeviceEventEmitter.emit("pointsSelected", {
        questionId: callbackId,
        points: selectedPoints,
      });
    }
    router.back(); // Regresar a la pantalla anterior (FormRequest)
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Seleccionar Coordenadas" }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Map points={selectedPoints} />
        <CoordinateInput
          onPointsChange={handlePointsChange}
          initialPoints={selectedPoints}
        />
        <ThemedButton
          title="Confirmar Puntos"
          onPress={handleConfirmPoints}
          style={styles.confirmButton}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },
  confirmButton: {
    marginTop: 10,
  },
});
