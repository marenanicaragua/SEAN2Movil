import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useAuth } from "@/src/hooks/useAuth";

import { SlideInDown, SlideInUp } from "react-native-reanimated";
import { useForm, Controller } from "react-hook-form";

import { CalendarI } from "@/assets/icons/CalendarI";
import { CarI } from "@/assets/icons/CarI";
import { DepI } from "@/assets/icons/DepI";
import { GasI } from "@/assets/icons/GasI";
import { InfoI } from "@/assets/icons/InfoI";
import { LeftI } from "@/assets/icons/LeftI";
import { RouteI } from "@/assets/icons/RouteI";
import { SendI } from "@/assets/icons/SendI";
import { TaskI } from "@/assets/icons/TaskI";
import { TimePinI } from "@/assets/icons/TimePin";
import { UserI } from "@/assets/icons/UserI";

import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedDropdownInput } from "../ui/ThemedDropdownInput";

import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";

const { width, height } = Dimensions.get("window");

// Definir el tipo del formulario
type FormData = {
  nombre: string;
  departamento: string;
  nombreActividad: string;
  fechaSolicitud: string;
  fechaHoraSalida: string;
  fechaHoraRegreso: string;
  municipio: string;
  placaVehiculo: string;
  kilometrajeSalida: string;
  kilometrajeEntrada: string;
  justificacion: string;
};

export function HomeContent() {
  const { signOut } = useAuth();
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Estados para los DateTimePicker
  const [showPickerSolicitud, setShowPickerSolicitud] = useState(false);
  const [selectedDateSolicitud, setSelectedDateSolicitud] = useState<
    Date | undefined
  >(undefined);
  const [showPickerSalida, setShowPickerSalida] = useState(false);
  const [showTimePickerSalida, setShowTimePickerSalida] = useState(false);
  const [selectedDateSalida, setSelectedDateSalida] = useState<
    Date | undefined
  >(undefined);
  const [showPickerRegreso, setShowPickerRegreso] = useState(false);
  const [showTimePickerRegreso, setShowTimePickerRegreso] = useState(false);
  const [selectedDateRegreso, setSelectedDateRegreso] = useState<
    Date | undefined
  >(undefined);

  // Estado para filtrar municipios
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const shadowColor = useThemeColor({}, "primary");

  // Configurar React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      departamento: "",
      nombreActividad: "",
      fechaSolicitud: "",
      fechaHoraSalida: "",
      fechaHoraRegreso: "",
      municipio: "",
      placaVehiculo: "",
      kilometrajeSalida: "",
      kilometrajeEntrada: "",
      justificacion: "",
    },
  });

  // Observar valores para validaciones
  const watchDepartamento = watch("departamento");

  // Data para Departamentos y Municipios
  const allDepartments = [
    { label: "Managua", value: "Managua" },
    { label: "Masaya", value: "Masaya" },
    { label: "Granada", value: "Granada" },
    { label: "León", value: "Leon" },
    { label: "Estelí", value: "Esteli" },
  ];

  const allMunicipalitiesByDepartment: Record<
    string,
    { label: string; value: string }[]
  > = {
    Managua: [
      { label: "Managua", value: "Managua" },
      { label: "Ciudad Sandino", value: "Ciudad Sandino" },
      { label: "Tipitapa", value: "Tipitapa" },
    ],
    Masaya: [
      { label: "Masaya", value: "Masaya" },
      { label: "Nindirí", value: "Nindiri" },
      { label: "Catarina", value: "Catarina" },
    ],
    Granada: [
      { label: "Granada", value: "Granada" },
      { label: "Nandaime", value: "Nandaime" },
    ],
    Leon: [
      { label: "León", value: "Leon" },
      { label: "Nagarote", value: "Nagarote" },
    ],
    Esteli: [
      { label: "Estelí", value: "Esteli" },
      { label: "Condega", value: "Condega" },
    ],
    "": [],
  };

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

  // Enviar formulario
  const onSubmit = async (data: FormData) => {
    setIsFormLoading(true);

    // Validar municipio según departamento
    if (!data.municipio) {
      Alert.alert("Atención", "Por favor seleccione un municipio");
      setIsFormLoading(false);
      return;
    }

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Datos del formulario:", data);
    Alert.alert("Éxito", "Formulario enviado correctamente!");

    // Resetear formulario
    // Limpiar campos manualmente
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
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={styles.content}
          entering={SlideInDown.duration(300).delay(100)}
          exiting={SlideInUp.duration(300)}
        >
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

            {/* Nombre Completo */}
            <Controller
              control={control}
              name="nombre"
              rules={{ required: "El nombre completo es requerido" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Nombre Completo"
                  placeholder="Ej: Juan Pedro Perez Perez"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  icon={UserI}
                  containerStyle={styles.formInput}
                  error={errors.nombre?.message}
                />
              )}
            />

            {/* Departamento */}
            <Controller
              control={control}
              name="departamento"
              rules={{ required: "El departamento es requerido" }}
              render={({ field: { onChange, value } }) => (
                <ThemedDropdownInput
                  label="Departamento"
                  placeholder="Seleccione un departamento"
                  value={value}
                  onChange={(val) => {
                    onChange(val);
                    setSelectedDepartment(val);
                    setValue("municipio", "");
                  }}
                  icon={DepI}
                  options={allDepartments}
                  containerStyle={styles.formInput}
                  error={errors.departamento?.message}
                />
              )}
            />

            <View style={styles.cardTitle}>
              <RouteI color={primaryColor} size={25} />
              <ThemedText type="subtitle">Informacion del Viaje</ThemedText>
            </View>

            {/* Nombre de Actividad */}
            <Controller
              control={control}
              name="nombreActividad"
              rules={{ required: "El nombre de la actividad es requerido" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Nombre de Actividad"
                  placeholder="Ej: Entrega de documentos"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="sentences"
                  icon={TaskI}
                  containerStyle={styles.formInput}
                  error={errors.nombreActividad?.message}
                />
              )}
            />

            {/* Fecha de Solicitud */}
            <Controller
              control={control}
              name="fechaSolicitud"
              rules={{ required: "La fecha de solicitud es requerida" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    onPress={() => setShowPickerSolicitud(true)}
                    style={styles.datePickerPressable}
                  >
                    <ThemedInput
                      label="Fecha de Solicitud"
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#888"
                      value={value}
                      icon={CalendarI}
                      editable={false}
                      error={errors.fechaSolicitud?.message}
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
                          const formattedDate = formatDate(date);
                          onChange(formattedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />

            {/* Fecha y Hora de Salida */}
            <Controller
              control={control}
              name="fechaHoraSalida"
              rules={{ required: "La fecha y hora de salida es requerida" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    onPress={() => setShowPickerSalida(true)}
                    style={styles.datePickerPressable}
                  >
                    <ThemedInput
                      label="Fecha y Hora de Salida"
                      placeholder="DD/MM/AAAA HH:MM"
                      placeholderTextColor="#888"
                      value={value}
                      icon={TimePinI}
                      editable={false}
                      error={errors.fechaHoraSalida?.message}
                    />
                  </Pressable>
                  {/* DatePicker y TimePicker - mantener tu lógica existente */}
                </>
              )}
            />

            {/* Municipio */}
            <Controller
              control={control}
              name="municipio"
              rules={{ required: "El municipio es requerido" }}
              render={({ field: { onChange, value } }) => (
                <ThemedDropdownInput
                  label="Municipio"
                  placeholder="Ej: Managua"
                  value={value}
                  onChange={onChange}
                  icon={DepI}
                  options={
                    allMunicipalitiesByDepartment[watchDepartamento] || []
                  }
                  containerStyle={styles.formInput}
                  error={errors.municipio?.message}
                />
              )}
            />

            {/* Placa del Vehículo */}
            <Controller
              control={control}
              name="placaVehiculo"
              rules={{ required: "La placa del vehículo es requerida" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Placa del Vehículo"
                  placeholder="Ej: M 123 456"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="characters"
                  icon={CarI}
                  containerStyle={styles.formInput}
                  error={errors.placaVehiculo?.message}
                />
              )}
            />

            {/* Kilometraje de Salida */}
            <Controller
              control={control}
              name="kilometrajeSalida"
              rules={{ required: "El kilometraje de salida es requerido" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Kilometraje de Salida"
                  placeholder="Ej: 123456"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  icon={GasI}
                  containerStyle={styles.formInput}
                  error={errors.kilometrajeSalida?.message}
                />
              )}
            />

            {/* Kilometraje de Entrada */}
            <Controller
              control={control}
              name="kilometrajeEntrada"
              rules={{ required: "El kilometraje de entrada es requerido" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Kilometraje de Entrada"
                  placeholder="Ej: 123500"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  icon={GasI}
                  containerStyle={styles.formInput}
                  error={errors.kilometrajeEntrada?.message}
                />
              )}
            />

            {/* Justificación */}
            <Controller
              control={control}
              name="justificacion"
              rules={{ required: "La justificación es requerida" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Justificación"
                  placeholder="Describa brevemente el motivo del viaje..."
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline={true}
                  numberOfLines={4}
                  icon={InfoI}
                  containerStyle={styles.formInput}
                  error={errors.justificacion?.message}
                />
              )}
            />

            <ThemedButton
              title="Enviar Solicitud"
              onPress={handleSubmit(onSubmit)}
              loading={isFormLoading}
              icon={SendI}
              iconPosition="right"
              style={styles.formButton}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Botón de Cerrar Sesión */}
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  formInput: {
    marginBottom: 15,
    width: "100%",
  },
  datePickerPressable: {
    width: "100%",
    marginBottom: 15,
  },
  formButton: {
    borderRadius: 25,
    marginTop: 20,
    width: "100%",
  },
});
