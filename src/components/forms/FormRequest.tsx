import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedDropdownInput } from "@/src/components/ui/ThemedDropdownInput";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DeviceEventEmitter, StyleSheet } from "react-native";
import { Map } from "../Map"; // Importa el componente Map

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "dropdown" | "map"; // Añadido tipo 'map'
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

interface FormRequestProps {
  title: string;
  questions: Question[];
  onSubmit?: (data: Record<string, any>) => void;
}

interface Point {
  latitude: number;
  longitude: number;
}

export function FormRequest({ title, questions, onSubmit }: FormRequestProps) {
  const router = useRouter();

  // Inicializamos los valores por defecto basados en los IDs de las preguntas
  const {
    control,
    handleSubmit,
    setValue, // Necesitamos setValue para actualizar los puntos del mapa
    getValues, // Usamos getValues para obtener los datos actuales de forma segura
    formState: { errors },
  } = useForm<Record<string, any>>({
    defaultValues: questions.reduce((acc, q) => {
      if (q.type === "map") {
        return { ...acc, [q.id]: [] }; // Inicializar el campo del mapa con un array vacío
      }
      return { ...acc, [q.id]: "" };
    }, {}),
  });

  // Escuchar el evento cuando se seleccionan puntos en la pantalla de coordenadas
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
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form Data:", data);
    }
  };

  // Función para navegar a la pantalla de selección de coordenadas
  const handleSelectPoints = (questionId: string) => {
    router.push({
      pathname: "/select-coordinates" as any,
      params: {
        // Pasamos los puntos actuales para que CoordinateInput pueda pre-llenarse
        initialPoints: JSON.stringify(getValues(questionId) || []),
        // Pasamos el ID de la pregunta para saber a qué campo del formulario pertenecen los puntos
        callbackId: questionId,
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>

      {questions.map((question) => (
        <ThemedView key={question.id}>
          {question.type === "map" ? (
            <Controller
              control={control}
              name={question.id}
              rules={{
                required: question.required
                  ? "Debe seleccionar al menos un punto"
                  : false,
                validate: (value: Point[]) => {
                  if (question.required && (!value || value.length === 0)) {
                    return "Debe seleccionar al menos un punto";
                  }
                  return true;
                },
              }}
              render={({ field: { value } }) => (
                <ThemedView style={styles.mapSection}>
                  <ThemedText type="label" style={styles.labelText}>
                    {question.label}
                    {question.required && (
                      <ThemedText style={styles.requiredAsterisk}>
                        {" "}
                        *
                      </ThemedText>
                    )}
                  </ThemedText>
                  <Map points={value || []} />
                  <ThemedButton
                    title="Seleccionar Puntos en Mapa"
                    onPress={() => handleSelectPoints(question.id)}
                    style={styles.mapButton}
                  />
                  {errors[question.id] && (
                    <ThemedText style={styles.errorText}>
                      {errors[question.id]?.message as string}
                    </ThemedText>
                  )}
                </ThemedView>
              )}
            />
          ) : (
            <Controller
              control={control}
              name={question.id}
              rules={{
                required: question.required
                  ? "Este campo es obligatorio"
                  : false,
              }}
              render={({ field: { onChange, onBlur, value } }) =>
                question.type === "dropdown" ? (
                  <ThemedDropdownInput
                    label={question.label}
                    options={question.options || []}
                    value={value}
                    onChange={onChange}
                    placeholder={question.placeholder}
                  />
                ) : (
                  <ThemedInput
                    label={question.label}
                    placeholder={question.placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={question.type === "textarea"}
                    error={errors[question.id]?.message as string}
                  />
                )
              }
            />
          )}
        </ThemedView>
      ))}

      <ThemedButton
        title="Enviar Solicitud"
        onPress={handleSubmit(onFormSubmit)}
        style={styles.submitButton}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  title: {
    marginBottom: 15,
  },
  labelText: {
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 10,
  },
  mapSection: {
    marginVertical: 10,
    gap: 10,
  },
  mapButton: {
    marginTop: 5,
  },
  requiredAsterisk: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
  },
});
