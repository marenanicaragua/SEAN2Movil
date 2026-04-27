import { Dimensions, StyleSheet } from "react-native";
import { GoogleMaps } from "expo-maps";

const { width, height } = Dimensions.get("window");

interface MapProps {
  points?: { latitude: number; longitude: number }[];
}

export function Map({ points = [] }: MapProps) {
  // Centro del mapa: primer punto o Managua
  const initialRegion = points.length > 0
    ? { latitude: points[0].latitude, longitude: points[0].longitude }
    : { latitude: 12.132652, longitude: -86.253475 };

  // Convertir puntos al formato que espera expo-maps
  const markers = points.map((point, index) => ({
    coordinates: point,
    title: `Punto ${index + 1}`,
    // icon: markerIcon, // opcional
  }));

  return (
    <GoogleMaps.View
      style={styles.map}
      cameraPosition={{
        coordinates: initialRegion,
        zoom: 12,
      }}
      markers={markers}  // ← Los marcadores van aquí, no como hijos
    />
  );
}

const styles = StyleSheet.create({
  map: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 10,
  },
});