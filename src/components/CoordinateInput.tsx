import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ThemedButton } from "./ui/ThemedButton";
import { ThemedDropdownInput } from "./ui/ThemedDropdownInput";
import { ThemedInput } from "./ui/ThemedInput";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

// Librería correcta para conversión UTM
import Utm from "utm-latlng";

interface Point {
  latitude: number;
  longitude: number;
}

interface CoordinateInputProps {
  onPointsChange: (points: Point[]) => void;
  initialPoints?: Point[]; // Nueva prop para puntos iniciales
}

type CoordinateType = "latlng" | "utm";

export function CoordinateInput({ onPointsChange, initialPoints }: CoordinateInputProps) {
  const [coordType, setCoordType] = useState<CoordinateType>("latlng");
  const [pointMode, setPointMode] = useState("1"); // '1' | '3+'
  const [points, setPoints] = useState<Point[]>(initialPoints || []);

  // Sincronizar puntos iniciales si cambian desde las props
  useEffect(() => {
    setPoints(initialPoints || []);
    // No llamar onPointsChange aquí para evitar bucles o llamadas innecesarias
    // El padre (SelectCoordinatesScreen) ya maneja el estado de los puntos.
  }, [initialPoints]);

  // States para Lat/Lng
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // States para UTM
  const [easting, setEasting] = useState(""); // X (metros)
  const [northing, setNorthing] = useState(""); // Y (metros)
  const [zone, setZone] = useState("16"); // Zona UTM (Nicaragua usa 16)
  const [hemisphere, setHemisphere] = useState<"N" | "S">("N");

  // Estados para GMS (mantengo tu funcionalidad existente)
  const [format, setFormat] = useState("decimal");
  const [latDeg, setLatDeg] = useState("");
  const [latMin, setLatMin] = useState("");
  const [latSec, setLatSec] = useState("");
  const [lngDeg, setLngDeg] = useState("");
  const [lngMin, setLngMin] = useState("");
  const [lngSec, setLngSec] = useState("");

  // Instancia del convertidor UTM
  const utmConverter = new Utm();

  const convertGMSToDecimal = (d: string, m: string, s: string) => {
    const deg = parseFloat(d) || 0;
    const min = parseFloat(m) || 0;
    const sec = parseFloat(s) || 0;
    return deg + min / 60 + sec / 3600;
  };

  // Convertir UTM a Lat/Lng usando la librería utm-latlng
  const convertUTMtoLatLng = (
    e: string,
    n: string,
    z: string,
    h: "N" | "S",
  ): Point | null => {
    try {
      const eastingNum = parseFloat(e);
      const northingNum = parseFloat(n);
      const zoneNum = parseInt(z);
      const zoneLetter = h; // 'N' o 'S'

      if (isNaN(eastingNum) || isNaN(northingNum) || isNaN(zoneNum)) {
        return null;
      }

      // Usar la librería utm-latlng (convertUtmToLatLng)
      const result = utmConverter.convertUtmToLatLng(
        eastingNum,
        northingNum,
        zoneNum,
        zoneLetter,
      );

      // Verificamos que result no sea un string para que TypeScript permita acceder a lat y lng
      if (result && typeof result !== "string") {
        return {
          latitude: parseFloat(result.lat.toFixed(6)),
          longitude: parseFloat(result.lng.toFixed(6)),
        }; 
      }
      return null;
    } catch (error) {
      console.error("Error converting UTM:", error);
      return null;
    }
  };

  // Función para obtener el punto actual según el tipo de coordenada
  const getCurrentPoint = (): Point | null => {
    if (coordType === "latlng") {
      if (format === "decimal") {
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lng);
        if (isNaN(newLat) || isNaN(newLng)) return null;
        return { latitude: newLat, longitude: newLng };
      } else {
        const newLat = convertGMSToDecimal(latDeg, latMin, latSec);
        const newLng = convertGMSToDecimal(lngDeg, lngMin, lngSec);
        if (isNaN(newLat) || isNaN(newLng)) return null;
        return { latitude: newLat, longitude: newLng };
      }
    } else {
      // UTM
      return convertUTMtoLatLng(easting, northing, zone, hemisphere);
    }
  };

  // Limpiar todos los campos
  const clearInputs = () => {
    setLat("");
    setLng("");
    setEasting("");
    setNorthing("");
    setZone("16");
    setHemisphere("N");
    setLatDeg("");
    setLatMin("");
    setLatSec("");
    setLngDeg("");
    setLngMin("");
    setLngSec("");
  };

  const handleAddPoint = () => {
    const newPoint = getCurrentPoint();

    if (!newPoint) {
      Alert.alert("Error", "Por favor ingrese coordenadas válidas");
      return;
    }

    if (pointMode === "1") {
      const updatedPoints = [newPoint];
      setPoints(updatedPoints);
      onPointsChange(updatedPoints);
    } else {
      const updatedPoints = [...points, newPoint];
      setPoints(updatedPoints);
      if (updatedPoints.length !== 2) {
        onPointsChange(updatedPoints);
      }
    }

    clearInputs();
  };

  const handleDeletePoint = (index: number) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);
    onPointsChange(updatedPoints);
  };

  const handleEditPoint = (index: number) => {
    const point = points[index];
    setCoordType("latlng");
    setFormat("decimal");
    setLat(point.latitude.toString());
    setLng(point.longitude.toString());
    handleDeletePoint(index);
  };

  const handleClear = () => {
    setPoints([]);
    onPointsChange([]);
    clearInputs();
  };

  const isInvalidQuantity = points.length === 2;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Configuración de Coordenadas</ThemedText>

      {/* Selector de tipo de coordenada */}
      <ThemedDropdownInput
        label="Tipo de Coordenada"
        value={coordType}
        onChange={(val) => setCoordType(val as CoordinateType)}
        options={[
          { label: "Latitud / Longitud", value: "latlng" },
          { label: "UTM (Metros)", value: "utm" },
        ]}
      />

      <ThemedDropdownInput
        label="Cantidad de Puntos"
        value={pointMode}
        onChange={(val) => {
          setPointMode(val);
          handleClear();
        }}
        options={[
          { label: "Un solo punto", value: "1" },
          { label: "Múltiples (3 o más)", value: "3+" },
        ]}
      />

      {coordType === "latlng" && (
        <>
          <ThemedDropdownInput
            label="Formato"
            value={format}
            onChange={setFormat}
            options={[
              { label: "Decimal (Lat, Lng)", value: "decimal" },
              { label: "GMS (Grados, Minutos, Segundos)", value: "gms" },
            ]}
          />

          <ThemedView style={styles.inputGroup}>
            {format === "decimal" ? (
              <>
                <ThemedInput
                  label="Latitud"
                  value={lat}
                  onChangeText={setLat}
                  keyboardType="numeric"
                  placeholder="12.1326"
                />
                <ThemedInput
                  label="Longitud"
                  value={lng}
                  onChangeText={setLng}
                  keyboardType="numeric"
                  placeholder="-86.2534"
                />
              </>
            ) : (
              <View>
                <ThemedText type="label">Latitud (GMS)</ThemedText>
                <View style={styles.row}>
                  <ThemedInput
                    style={styles.smallInput}
                    placeholder="°"
                    value={latDeg}
                    onChangeText={setLatDeg}
                    keyboardType="numeric"
                  />
                  <ThemedInput
                    style={styles.smallInput}
                    placeholder="'"
                    value={latMin}
                    onChangeText={setLatMin}
                    keyboardType="numeric"
                  />
                  <ThemedInput
                    style={styles.smallInput}
                    placeholder='"'
                    value={latSec}
                    onChangeText={setLatSec}
                    keyboardType="numeric"
                  />
                </View>
                <ThemedText type="label">Longitud (GMS)</ThemedText>
                <View style={styles.row}>
                  <ThemedInput
                    style={styles.smallInput}
                    placeholder="°"
                    value={lngDeg}
                    onChangeText={setLngDeg}
                    keyboardType="numeric"
                  />
                  <ThemedInput
                    style={styles.smallInput}
                    placeholder="'"
                    value={lngMin}
                    onChangeText={setLngMin}
                    keyboardType="numeric"
                  />
                  <ThemedInput
                    style={styles.smallInput}
                    placeholder='"'
                    value={lngSec}
                    onChangeText={setLngSec}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
          </ThemedView>
        </>
      )}

      {coordType === "utm" && (
        <ThemedView style={styles.inputGroup}>
          <ThemedInput
            label="Easting (X) - Metros"
            value={easting}
            onChangeText={setEasting}
            keyboardType="numeric"
            placeholder="ej: 600000"
          />
          <ThemedInput
            label="Northing (Y) - Metros"
            value={northing}
            onChangeText={setNorthing}
            keyboardType="numeric"
            placeholder="ej: 1300000"
          />
          <ThemedInput
            label="Zona UTM"
            value={zone}
            onChangeText={setZone}
            keyboardType="numeric"
            placeholder="16 (Nicaragua)"
          />
          <ThemedDropdownInput
            label="Hemisferio"
            value={hemisphere}
            onChange={(val) => setHemisphere(val as "N" | "S")}
            options={[
              { label: "Norte (N)", value: "N" },
              { label: "Sur (S)", value: "S" },
            ]}
          />
          <ThemedText type="bodySmall" style={styles.hintText}>
            💡 Nicaragua se encuentra en la zona 16 Norte
          </ThemedText>
        </ThemedView>
      )}

      <View style={styles.actions}>
        <ThemedButton
          title={pointMode === "1" ? "Establecer Punto" : "Añadir Punto"}
          onPress={handleAddPoint}
          style={styles.button}
        />
        {pointMode === "3+" && (
          <ThemedButton
            title="Limpiar Todo"
            onPress={handleClear}
            variant="secondary"
            style={styles.button}
          />
        )}
      </View>

      {isInvalidQuantity && (
        <ThemedText style={styles.errorText}>
          ⚠️ No se pueden guardar 2 puntos. Debe agregar 3 o más.
        </ThemedText>
      )}

      <ThemedView style={styles.list}>
        <ThemedText type="label" style={styles.listTitle}>
          Puntos registrados ({points.length})
        </ThemedText>

        <View style={styles.tableHeader}>
          <ThemedText style={[styles.headerText, { flex: 0.5 }]}>#</ThemedText>
          <ThemedText style={[styles.headerText, { flex: 2 }]}>
            Latitud
          </ThemedText>
          <ThemedText style={[styles.headerText, { flex: 2 }]}>
            Longitud
          </ThemedText>
          <ThemedText
            style={[styles.headerText, { flex: 2, textAlign: "center" }]}
          >
            Acciones
          </ThemedText>
        </View>

        {points.map((p, i) => (
          <View key={i} style={styles.tableRow}>
            <ThemedText style={[styles.cellText, { flex: 0.5 }]}>
              {i + 1}
            </ThemedText>
            <ThemedText style={[styles.cellText, { flex: 2 }]}>
              {p.latitude.toFixed(4)}
            </ThemedText>
            <ThemedText style={[styles.cellText, { flex: 2 }]}>
              {p.longitude.toFixed(4)}
            </ThemedText>
            <View style={styles.rowActions}>
              <Pressable
                onPress={() => handleEditPoint(i)}
                style={styles.actionBtn}
              >
                <ThemedText
                  style={{ color: "#2196F3", fontSize: 12, fontWeight: "bold" }}
                >
                  EDIT
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => handleDeletePoint(i)}
                style={styles.actionBtn}
              >
                <ThemedText
                  style={{ color: "#FF5252", fontSize: 12, fontWeight: "bold" }}
                >
                  DEL
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

import { Pressable } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
    gap: 10,
  },
  inputGroup: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  smallInput: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  list: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  listTitle: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    opacity: 0.7,
  },
  cellText: {
    fontSize: 12,
  },
  rowActions: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionBtn: {
    padding: 4,
  },
  hintText: {
    marginTop: 5,
    opacity: 0.6,
    fontSize: 11,
    textAlign: "center",
  },
});
