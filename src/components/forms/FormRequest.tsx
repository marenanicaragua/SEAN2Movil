// src/components/ui/FormRequest.tsx
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedDropdownInput } from "@/src/components/ui/ThemedDropdownInput";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { ThemedImageGallery } from "@/src/components/ui/ThemedImageGallery";
// ✅ AGREGAR ESTAS IMPORTACIONES FALTANTES
import { ThemedRadioGroup } from "@/src/components/ui/ThemedRadioGroup";
import { ThemedCheckbox } from "@/src/components/ui/ThemedCheckbox";
import { ThemedTable } from "@/src/components/ui/ThemedTable";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DeviceEventEmitter, StyleSheet, ScrollView, View, Pressable } from "react-native";

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "dropdown" | "title" | "radio" | "checkbox" | "table";
  placeholder?: string;
  required?: boolean;
  critical?: boolean;
  options?: { label: string; value: string }[] | string[];
  columns?: { key: string; label: string; type: string; options?: string[] }[];
  dependsOn?: { field: string; value: any };
}

interface FormRequestProps {
  title: string;
  questions: Question[];
  onSubmit?: (data: Record<string, any>) => void;
  onCriticalFail?: (criticalQuestions: Question[]) => void;
  // Configuración del mapa
  mapRequired?: boolean;
  mapLabel?: string;
  // Configuración de galería
  galleryRequired?: boolean;
  galleryLabel?: string;
  maxImages?: number;
}

interface Point {
  latitude: number;
  longitude: number;
}

export function FormRequest({ 
  title, 
  questions, 
  onSubmit, 
  onCriticalFail,
  mapRequired = true,
  mapLabel = "Ubicación Geográfica",
  galleryRequired = true,
  galleryLabel = "Fotografías de la Inspección",
  maxImages = 20,
}: FormRequestProps) {
  const router = useRouter();
  const [criticalErrors, setCriticalErrors] = useState<string[]>([]);

  // Inicializar valores por defecto (incluyendo mapa y galería)
  const defaultValues = questions.reduce((acc, q) => {
    if (q.type === "table") return { ...acc, [q.id]: [] };
    if (q.type === "checkbox") return { ...acc, [q.id]: [] };
    if (q.type === "radio") return { ...acc, [q.id]: "" };
    return { ...acc, [q.id]: "" };
  }, {
    // Campos fijos que siempre existen
    ubicacion_gps: [], // Mapa
    fotografias: [],   // Galería
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Record<string, any>>({
    defaultValues,
  });

  const formValues = watch();

  // Verificar preguntas críticas
  useEffect(() => {
    const criticalQuestions = questions.filter(q => q.critical && q.required);
    const negativeAnswers: Question[] = [];
    
    criticalQuestions.forEach(question => {
      const answer = formValues[question.id];
      if (answer === "No" || answer === false) {
        negativeAnswers.push(question);
      }
    });
    
    if (negativeAnswers.length > 0 && onCriticalFail) {
      onCriticalFail(negativeAnswers);
    }
  }, [formValues, questions, onCriticalFail]);

  // Escuchar eventos del mapa
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "pointsSelected",
      ({ questionId, points }: { questionId: string; points: Point[] }) => {
        setValue(questionId, points, {
          shouldValidate: true,
          shouldDirty: true,
        });
      },
    );
    return () => subscription.remove();
  }, [setValue]);

  const onFormSubmit = (data: Record<string, any>) => {
    // Verificar preguntas críticas
    const criticalQuestions = questions.filter(q => q.critical && q.required);
    const hasNegativeCritical = criticalQuestions.some(q => {
      const answer = data[q.id];
      return answer === "No" || answer === false;
    });

    if (hasNegativeCritical) {
      setCriticalErrors(["No se puede proceder: Hay respuestas negativas en preguntas críticas"]);
      return;
    }

    // Verificar mapa requerido
    if (mapRequired && (!data.ubicacion_gps || data.ubicacion_gps.length === 0)) {
      setCriticalErrors(["Debe seleccionar una ubicación en el mapa"]);
      return;
    }

    // Verificar galería requerida
    if (galleryRequired && (!data.fotografias || data.fotografias.length === 0)) {
      setCriticalErrors(["Debe tomar al menos una fotografía"]);
      return;
    }

    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form Data:", JSON.stringify(data, null, 2));
    }
  };

  const handleSelectPoints = () => {
    router.push({
      pathname: "/select-coordinates" as any,
      params: {
        initialPoints: JSON.stringify(getValues("ubicacion_gps") || []),
        callbackId: "ubicacion_gps",
      },
    });
  };

  // Filtrar preguntas que dependen de otras
  const getVisibleQuestions = (formValues: Record<string, any>) => {
    return questions.filter(question => {
      if (!question.dependsOn) return true;
      const dependsValue = formValues[question.dependsOn.field];
      return dependsValue === question.dependsOn.value;
    });
  };

  const renderQuestion = (question: Question) => {
    // Tipos que no requieren Controller
    if (question.type === "title") {
      return (
        <ThemedView key={question.id} style={styles.titleSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {question.label}
          </ThemedText>
          <View style={styles.divider} />
        </ThemedView>
      );
    }

    // Radio buttons
    if (question.type === "radio") {
      const options = Array.isArray(question.options) 
        ? question.options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt)
        : [];
      
      return (
        <Controller
          key={question.id}
          control={control}
          name={question.id}
          rules={{ required: question.required ? "Este campo es obligatorio" : false }}
          render={({ field: { onChange, value } }) => (
            <ThemedRadioGroup
              label={question.label}
              options={options}
              value={value}
              onChange={onChange}
              required={question.required}
              error={errors[question.id]?.message as string}
              critical={question.critical}
            />
          )}
        />
      );
    }

    // Checkbox
    if (question.type === "checkbox") {
      const options = Array.isArray(question.options) 
        ? question.options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt)
        : [];
      
      return (
        <Controller
          key={question.id}
          control={control}
          name={question.id}
          rules={{ required: question.required ? "Seleccione al menos una opción" : false }}
          render={({ field: { onChange, value } }) => (
            <ThemedCheckbox
              label={question.label}
              options={options}
              selectedValues={value || []}
              onChange={onChange}
              required={question.required}
              error={errors[question.id]?.message as string}
            />
          )}
        />
      );
    }

    // Tabla dinámica
    if (question.type === "table") {
      return (
        <Controller
          key={question.id}
          control={control}
          name={question.id}
          rules={{ required: question.required ? "Debe agregar al menos una fila" : false }}
          render={({ field: { onChange, value } }) => (
            <ThemedTable
              label={question.label}
              columns={question.columns || []}
              data={value || []}
              onChange={onChange}
              required={question.required}
              error={errors[question.id]?.message as string}
            />
          )}
        />
      );
    }

    // Dropdown
    if (question.type === "dropdown") {
      const options = Array.isArray(question.options)
        ? question.options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt)
        : [];
      
      return (
        <Controller
          key={question.id}
          control={control}
          name={question.id}
          rules={{ required: question.required ? "Este campo es obligatorio" : false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedDropdownInput
              label={question.label}
              options={options}
              value={value}
              onChange={onChange}
              placeholder={question.placeholder}
              error={errors[question.id]?.message as string}
            />
          )}
        />
      );
    }

    // Text y Textarea
    return (
      <Controller
        key={question.id}
        control={control}
        name={question.id}
        rules={{ required: question.required ? "Este campo es obligatorio" : false }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            label={question.label}
            placeholder={question.placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={question.type === "textarea"}
            error={errors[question.id]?.message as string}
          />
        )}
      />
    );
  };

  const visibleQuestions = getVisibleQuestions(formValues);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>

        {/* ERRORES CRÍTICOS */}
        {criticalErrors.length > 0 && (
          <ThemedView style={styles.criticalErrorContainer}>
            {criticalErrors.map((error, index) => (
              <ThemedText key={index} style={styles.criticalErrorText}>
                ⚠️ {error}
              </ThemedText>
            ))}
          </ThemedView>
        )}

        {/* ============ MAPA (SIEMPRE PRESENTE) ============ */}
        <ThemedView style={styles.mapSection}>
          <ThemedText type="label" style={styles.labelText}>
            {mapLabel}
            {mapRequired && <ThemedText style={styles.requiredAsterisk}> *</ThemedText>}
          </ThemedText>
          <Controller
            control={control}
            name="ubicacion_gps"
            rules={{
              required: mapRequired ? "Debe seleccionar al menos un punto" : false,
              validate: (value: Point[]) => {
                if (mapRequired && (!value || value.length === 0)) {
                  return "Debe seleccionar al menos un punto";
                }
                return true;
              },
            }}
            render={({ field: { value } }) => (
              <>
                <ThemedView style={styles.pointsSummary}>
                  <ThemedText type="defaultSemiBold">
                    {value && value.length > 0
                      ? `📍 ${value.length} ${value.length === 1 ? "punto seleccionado" : "puntos seleccionados"}`
                      : "No se han seleccionado coordenadas"}
                  </ThemedText>
                </ThemedView>
                <ThemedButton
                  title={value && value.length > 0 ? "Modificar Ubicación" : "Seleccionar en Mapa"}
                  onPress={handleSelectPoints}
                  variant={value && value.length > 0 ? "secondary" : "primary"}
                  style={styles.mapButton}
                />
                {errors.ubicacion_gps && (
                  <ThemedText style={styles.errorText}>
                    {errors.ubicacion_gps?.message as string}
                  </ThemedText>
                )}
              </>
            )}
          />
        </ThemedView>

        {/* ============ PREGUNTAS DEL FORMULARIO ============ */}
        {visibleQuestions.map(renderQuestion)}

        {/* ============ GALERÍA DE FOTOS (SIEMPRE PRESENTE) ============ */}
        <ThemedView style={styles.gallerySection}>
          <ThemedText type="label" style={styles.labelText}>
            {galleryLabel}
            {galleryRequired && <ThemedText style={styles.requiredAsterisk}> *</ThemedText>}
          </ThemedText>
          <Controller
            control={control}
            name="fotografias"
            rules={{
              required: galleryRequired ? "Debe tomar al menos una fotografía" : false,
              validate: (value: string[]) => {
                if (galleryRequired && (!value || value.length === 0)) {
                  return "Debe tomar al menos una fotografía";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <ThemedImageGallery
                label=""
                value={value || []}
                onChange={onChange}
                required={galleryRequired}
                error={errors.fotografias?.message as string}
                maxImages={maxImages}
              />
            )}
          />
        </ThemedView>

        <ThemedButton
          title="Enviar Solicitud"
          onPress={handleSubmit(onFormSubmit)}
          style={styles.submitButton}
        />
      </ThemedView>
    </ScrollView>
  );
}

// Componentes auxiliares (ThemedRadioGroup, ThemedCheckbox, ThemedTable)
// ... (incluir los componentes que ya tienes)

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  title: {
    marginBottom: 20,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: "#ccc",
    width: "100%",
    marginTop: 5,
  },
  labelText: {
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  mapSection: {
    marginVertical: 10,
    gap: 10,
  },
  mapButton: {
    marginTop: 5,
  },
  pointsSummary: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  gallerySection: {
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
  },
  criticalErrorContainer: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  criticalErrorText: {
    color: "#c62828",
    fontSize: 14,
  },
});