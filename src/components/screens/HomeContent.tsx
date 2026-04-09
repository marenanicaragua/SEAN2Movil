import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useAuth } from "@/src/hooks/useAuth";

import { CalendarI } from "@/assets/icons/CalendarI"; // Para fechas
import { CarI } from "@/assets/icons/CarI"; // Para placa
import { DepI } from "@/assets/icons/DepI";
import { GasI } from "@/assets/icons/GasI"; // Para kilometraje
import { InfoI } from "@/assets/icons/InfoI"; // Para justificación
import { LeftI } from "@/assets/icons/LeftI";
import { RouteI } from "@/assets/icons/RouteI";
import { SendI } from "@/assets/icons/SendI"; // Para el nuevo botón
import { TaskI } from "@/assets/icons/TaskI";
import { TimePinI } from "@/assets/icons/TimePin"; // Para fecha y hora de salida/regreso
import { UserI } from "@/assets/icons/UserI";

import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importar DateTimePicker
import { ThemedDropdownInput } from "../ui/ThemedDropdownInput"; // Importamos el nuevo componente

import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Alert } from "react-native";

const { width, height } = Dimensions.get("window");

export function HomeContent() {
  const { signOut } = useAuth();
  const [Nombre, setNombre] = useState("");
  const [departamentoSolicitante, setDepartamentoSolicitante] = useState(""); // Renombrado para evitar conflicto
  const [nombreActividad, setNombreActividad] = useState("");
  const [fechaSolicitud, setFechaSolicitud] = useState(""); // String para mostrar
  const [fechaHoraSalida, setFechaHoraSalida] = useState(""); // String para mostrar
  const [fechaHoraRegreso, setFechaHoraRegreso] = useState(""); // String para mostrar
  const [municipio, setMunicipio] = useState("");
  const [placaVehiculo, setPlacaVehiculo] = useState("");
  const [kilometrajeSalida, setKilometrajeSalida] = useState("");
  const [kilometrajeEntrada, setKilometrajeEntrada] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Obtenemos el color 'primary' definido en nuestro tema automáticamente
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");

  // Estados para el DateTimePicker
  const [showPickerSolicitud, setShowPickerSolicitud] = useState(false);
  const [selectedDateSolicitud, setSelectedDateSolicitud] = useState<
    Date | undefined
  >(undefined);

  const [showPickerSalida, setShowPickerSalida] = useState(false);
  const [showTimePickerSalida, setShowTimePickerSalida] = useState(false); // Para Android
  const [selectedDateSalida, setSelectedDateSalida] = useState<
    Date | undefined
  >(undefined);

  const [showPickerRegreso, setShowPickerRegreso] = useState(false);
  const [showTimePickerRegreso, setShowTimePickerRegreso] = useState(false); // Para Android
  const [selectedDateRegreso, setSelectedDateRegreso] = useState<
    Date | undefined
  >(undefined);

  // --- Data para Departamentos y Municipios ---
  const allDepartments = [
    { label: "Managua", value: "Managua" },
    { label: "Masaya", value: "Masaya" },
    { label: "Granada", value: "Granada" },
    { label: "León", value: "Leon" },
    { label: "Estelí", value: "Esteli" },
    // Agrega más departamentos según sea necesario
  ];

  const allMunicipalitiesByDepartment: Record<
    string,
    { label: string; value: string }[]
  > = {
    Managua: [
      { label: "Managua", value: "Managua" },
      { label: "Ciudad Sandino", value: "Ciudad Sandino" },
      { label: "Tipitapa", value: "Tipitapa" },
      { label: "San Rafael del Sur", value: "San Rafael del Sur" },
      { label: "El Crucero", value: "El Crucero" },
    ],
    Masaya: [
      { label: "Masaya", value: "Masaya" },
      { label: "Nindirí", value: "Nindiri" },
      { label: "Catarina", value: "Catarina" },
      { label: "San Juan de Oriente", value: "San Juan de Oriente" },
      { label: "Niquinohomo", value: "Niquinohomo" },
    ],
    Granada: [
      { label: "Granada", value: "Granada" },
      { label: "Nandaime", value: "Nandaime" },
      { label: "Diriá", value: "Diria" },
      { label: "Diriomo", value: "Diriomo" },
    ],
    Leon: [
      { label: "León", value: "Leon" },
      { label: "Nagarote", value: "Nagarote" },
      { label: "La Paz Centro", value: "La Paz Centro" },
      { label: "Quezalguaque", value: "Quezalguaque" },
    ],
    Esteli: [
      { label: "Estelí", value: "Esteli" },
      { label: "Condega", value: "Condega" },
      { label: "Pueblo Nuevo", value: "Pueblo Nuevo" },
      { label: "San Juan de Limay", value: "San Juan de Limay" },
    ],
    "": [], // Default empty array if no department is selected or found
  };

  const shadowColor = useThemeColor({}, "text");

  // Estado para el departamento seleccionado (para filtrar municipios)
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Función auxiliar para formatear fechas
  const formatDate = (
    date: Date | null | undefined,
    includeTime: boolean = false,
  ): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return `${day}/${month}/${year}`;
  };

  const handleForm = async () => {
    setIsFormLoading(true);
    if (
      !Nombre || // Nombre del solicitante
      !selectedDepartment || // Usar el estado del dropdown para el departamento
      !nombreActividad ||
      !fechaSolicitud ||
      !fechaHoraSalida ||
      !fechaHoraRegreso ||
      !municipio ||
      !placaVehiculo ||
      !kilometrajeSalida ||
      !kilometrajeEntrada ||
      !justificacion
    ) {
      Alert.alert(
        "Atención",
        "Por favor complete todos los campos del formulario.",
      );
      setIsFormLoading(false);
      return;
    }

    // Simular envío de formulario o alguna operación asíncrona
    await new Promise((resolve) => setTimeout(resolve, 1500));

    Alert.alert("Éxito", "Formulario enviado correctamente!");
    setNombre("");
    setDepartamentoSolicitante("");
    setNombreActividad("");
    setFechaSolicitud(""); // Limpiar string
    setFechaHoraSalida(""); // Limpiar string
    setFechaHoraRegreso(""); // Limpiar string
    setMunicipio("");
    setSelectedDepartment(""); // Limpiar también el departamento seleccionado
    setPlacaVehiculo("");
    setKilometrajeSalida("");
    setKilometrajeEntrada("");
    setJustificacion("");
    setIsFormLoading(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <HeaderBar />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Solicitud de Vehiculo
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            Complete la informacion solicitada a continuacion para programar su
            unidad de transporte
          </ThemedText>

          <ThemedView
            variant="secondary"
            style={[
              styles.card,
              { boxShadow: `0px 5px 15px ${shadowColor}33` },
            ]}
          >
            <View style={styles.cardTitle}>
              <UserI color={primaryColor} size={25} />
              <ThemedText type="subtitle">
                Informacion del Solicitante
              </ThemedText>
            </View>

            {/* Primer Input */}
            <ThemedInput
              label="Nombre Completo"
              placeholder="Ej: Juan Pedro Perez Perez"
              placeholderTextColor="#888"
              value={Nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
              icon={UserI}
              containerStyle={styles.formInput}
            />

            {/* Segundo Input: Departamento del Solicitante ahora es un Dropdown */}
            <ThemedDropdownInput
              label="Departamento"
              placeholder="Seleccione un departamento"
              value={selectedDepartment}
              onChange={(value) => {
                setSelectedDepartment(value);
                setDepartamentoSolicitante(value);
                setMunicipio(""); // Limpiar el municipio cuando cambia el departamento
              }}
              icon={DepI}
              options={allDepartments}
              containerStyle={styles.formInput}
            />

            <View style={styles.cardTitle}>
              <RouteI color={primaryColor} size={25} />
              <ThemedText type="subtitle">Informacion del Viaje</ThemedText>
            </View>

            {/* Nuevos Inputs */}
            <ThemedInput
              label="Nombre de Actividad"
              placeholder="Ej: Entrega de documentos"
              placeholderTextColor="#888"
              value={nombreActividad}
              onChangeText={setNombreActividad}
              autoCapitalize="sentences"
              icon={TaskI}
              containerStyle={styles.formInput}
            />

            {/* Fecha de Solicitud */}
            <Pressable
              onPress={() => setShowPickerSolicitud(true)}
              style={styles.datePickerPressable}
            >
              <ThemedInput
                label="Fecha de Solicitud"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#888"
                value={fechaSolicitud}
                icon={CalendarI}
                editable={false} // No permitir edición directa
              />
            </Pressable>
            {showPickerSolicitud && (
              <DateTimePicker
                value={selectedDateSolicitud || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowPickerSolicitud(false);
                  if (event.type === "set" && date) {
                    setSelectedDateSolicitud(date);
                    setFechaSolicitud(formatDate(date));
                  }
                }}
              />
            )}

            {/* Fecha y Hora de Salida */}
            <Pressable
              onPress={() => setShowPickerSalida(true)}
              style={styles.datePickerPressable}
            >
              <ThemedInput
                label="Fecha y Hora de Salida"
                placeholder="DD/MM/AAAA HH:MM"
                placeholderTextColor="#888"
                value={fechaHoraSalida}
                icon={TimePinI}
                editable={false}
              />
            </Pressable>
            {showPickerSalida && (
              <DateTimePicker
                value={selectedDateSalida || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowPickerSalida(false);
                  if (event.type === "set" && date) {
                    setSelectedDateSalida(date);
                    if (Platform.OS === "android") {
                      setShowTimePickerSalida(true); // Mostrar picker de hora después en Android
                    } else {
                      setFechaHoraSalida(formatDate(date, true)); // iOS puede seleccionar ambos
                    }
                  }
                }}
              />
            )}
            {showTimePickerSalida && Platform.OS === "android" && (
              <DateTimePicker
                value={selectedDateSalida || new Date()}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowTimePickerSalida(false);
                  if (event.type === "set" && time && selectedDateSalida) {
                    const newDateTime = new Date(selectedDateSalida);
                    newDateTime.setHours(time.getHours());
                    newDateTime.setMinutes(time.getMinutes());
                    setSelectedDateSalida(newDateTime);
                    setFechaHoraSalida(formatDate(newDateTime, true));
                  }
                }}
              />
            )}

            {/* Fecha y Hora de Regreso */}
            <Pressable
              onPress={() => setShowPickerRegreso(true)}
              style={styles.datePickerPressable}
            >
              <ThemedInput
                label="Fecha y Hora de Regreso"
                placeholder="DD/MM/AAAA HH:MM"
                placeholderTextColor="#888"
                value={fechaHoraRegreso}
                icon={TimePinI}
                editable={false}
              />
            </Pressable>
            {showPickerRegreso && (
              <DateTimePicker
                value={selectedDateRegreso || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowPickerRegreso(false);
                  if (event.type === "set" && date) {
                    setSelectedDateRegreso(date);
                    if (Platform.OS === "android") {
                      setShowTimePickerRegreso(true);
                    } else {
                      setFechaHoraRegreso(formatDate(date, true));
                    }
                  }
                }}
              />
            )}
            {showTimePickerRegreso && Platform.OS === "android" && (
              <DateTimePicker
                value={selectedDateRegreso || new Date()}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowTimePickerRegreso(false);
                  if (event.type === "set" && time && selectedDateRegreso) {
                    const newDateTime = new Date(selectedDateRegreso);
                    newDateTime.setHours(time.getHours());
                    newDateTime.setMinutes(time.getMinutes());
                    setSelectedDateRegreso(newDateTime);
                    setFechaHoraRegreso(formatDate(newDateTime, true));
                  }
                }}
              />
            )}

            <ThemedDropdownInput
              label="Municipio"
              placeholder="Ej: Managua"
              value={municipio}
              onChange={setMunicipio}
              icon={DepI} // Aseguramos que el icono se pase
              options={allMunicipalitiesByDepartment[selectedDepartment] || []} // Opciones filtradas
              containerStyle={styles.formInput}
            />

            <ThemedInput
              label="Placa del Vehículo"
              placeholder="Ej: M 123 456"
              placeholderTextColor="#888"
              value={placaVehiculo}
              onChangeText={setPlacaVehiculo}
              autoCapitalize="characters"
              icon={CarI}
              containerStyle={styles.formInput} // Aplicar formInput style aquí
            />

            <ThemedInput
              label="Kilometraje de Salida"
              placeholder="Ej: 123456"
              placeholderTextColor="#888"
              value={kilometrajeSalida}
              onChangeText={setKilometrajeSalida}
              keyboardType="numeric"
              icon={GasI}
              containerStyle={styles.formInput} // Aplicar formInput style aquí
            />

            <ThemedInput
              label="Kilometraje de Entrada"
              placeholder="Ej: 123500"
              placeholderTextColor="#888"
              value={kilometrajeEntrada}
              onChangeText={setKilometrajeEntrada}
              keyboardType="numeric"
              icon={GasI}
              containerStyle={styles.formInput} // Aplicar formInput style aquí
            />

            <ThemedInput
              label="Justificación"
              placeholder="Describa brevemente el motivo del viaje..."
              placeholderTextColor="#888"
              value={justificacion}
              onChangeText={setJustificacion}
              multiline={true}
              numberOfLines={4} // Permite que el input crezca hasta 4 líneas
              icon={InfoI}
              containerStyle={styles.formInput} // Aplicar formInput style aquí
            />

            <ThemedButton
              title="Enviar Solicitud"
              onPress={handleForm}
              loading={isFormLoading}
              icon={SendI}
              iconPosition="right"
              style={styles.formButton}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Botón de Cerrar Sesión como FAB redondo */}
      <ThemedButton
        variant="danger"
        onPress={signOut}
        style={styles.fabButton}
        icon={(props) => <LeftI {...props} size={32} />}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Asegura que el ScrollView ocupe todo el espacio disponible
    marginBottom: 70, // Aumentado para asegurar que el botón de login no quede oculto
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
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  cardTitle: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  description: {
    marginBottom: 30,
    opacity: 0.6,
  },
  fabButton: {
    position: "absolute",
    bottom: 85,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    paddingHorizontal: 0,
    minWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  formInput: {
    // Este estilo ahora definirá el espaciado *después* de cada bloque de entrada
    marginBottom: 15, // Espaciado consistente entre inputs
  },
  datePickerPressable: {
    // Nuevo estilo para los Pressable que envuelven los selectores de fecha
    width: "100%",
    marginBottom: 15, // Espaciado consistente entre inputs
  },
  formButton: {
    borderRadius: 25,
    marginTop: 20,
    width: "100%",
  },
});
