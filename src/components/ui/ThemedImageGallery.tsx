// src/components/ui/ThemedImageGallery.tsx
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";

// Importación condicional con manejo de errores
let ImagePicker: any = null;
try {
  // Solo importar si estamos en cliente
  if (typeof window !== "undefined") {
    // @ts-ignore
    const module = require("expo-image-picker");
    ImagePicker = module;
  }
} catch (error) {
  console.warn("expo-image-picker no está disponible:", error);
}

interface ThemedImageGalleryProps {
  label: string;
  value: string[];
  onChange: (uris: string[]) => void;
  required?: boolean;
  error?: string;
  maxImages?: number;
}

export function ThemedImageGallery({
  label,
  value = [],
  onChange,
  required,
  error,
  maxImages = 10,
}: ThemedImageGalleryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isImagePickerAvailable, setIsImagePickerAvailable] = useState(true);

  useEffect(() => {
    // Verificar si ImagePicker está disponible
    if (!ImagePicker) {
      setIsImagePickerAvailable(false);
      Alert.alert(
        "Error de configuración",
        "El módulo de cámara no está disponible. Por favor, reinstala la aplicación.",
      );
    }
  }, []);

  // Solicitar permisos de cámara y galería
  const requestPermissions = async () => {
    if (!ImagePicker) return false;

    try {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tu cámara y galería para tomar y seleccionar fotografías.",
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error en permisos:", error);
      return false;
    }
  };

  // Verificar si se puede agregar más imágenes
  const canAddMoreImages = () => {
    if (value.length >= maxImages) {
      Alert.alert(
        "Límite alcanzado",
        `Máximo ${maxImages} fotografías permitidas`,
      );
      return false;
    }
    return true;
  };

  // Tomar foto con cámara
  const takePhoto = async () => {
    if (!ImagePicker) {
      Alert.alert("Error", "El módulo de cámara no está disponible");
      return;
    }

    if (!canAddMoreImages()) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        onChange([...value, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
    } finally {
      setIsLoading(false);
    }
  };

  // Seleccionar de galería (múltiples imágenes)
  const pickFromGallery = async () => {
    if (!ImagePicker) {
      Alert.alert("Error", "El módulo de galería no está disponible");
      return;
    }

    if (!canAddMoreImages()) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const remainingSlots = maxImages - value.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newUris = result.assets.map((asset) => asset.uri);
        onChange([...value, ...newUris]);
      }
    } catch (error) {
      console.error("Error seleccionando de galería:", error);
      Alert.alert("Error", "No se pudieron seleccionar las imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar opciones para agregar imágenes
  const showAddOptions = () => {
    if (!isImagePickerAvailable) {
      Alert.alert("Error", "La funcionalidad de imágenes no está disponible");
      return;
    }

    if (!canAddMoreImages()) return;

    Alert.alert(
      "Agregar Fotografía",
      "Selecciona una opción",
      [
        { text: "📷 Tomar Foto", onPress: takePhoto },
        { text: "🖼️ Seleccionar de Galería", onPress: pickFromGallery },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  // Resto del componente igual...
  // (abrirPrevisualizacion, cerrarPrevisualizacion, navegarAnterior, etc.)
  const openPreview = (uri: string, index: number) => {
    setSelectedImageUri(uri);
    setSelectedImageIndex(index);
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setSelectedImageUri(null);
  };

  const goToPreviousImage = () => {
    if (selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImageUri(value[newIndex]);
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex < value.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      setSelectedImageUri(value[newIndex]);
    }
  };

  const deleteFromPreview = () => {
    Alert.alert(
      "Eliminar fotografía",
      "¿Estás seguro de que quieres eliminar esta fotografía?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const newUris = [...value];
            newUris.splice(selectedImageIndex, 1);
            onChange(newUris);
            closePreview();
          },
        },
      ],
    );
  };

  const removeImage = (index: number) => {
    Alert.alert(
      "Eliminar fotografía",
      "¿Estás seguro de que quieres eliminar esta fotografía?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const newUris = [...value];
            newUris.splice(index, 1);
            onChange(newUris);
          },
        },
      ],
    );
  };

  const removeAllImages = () => {
    if (value.length === 0) return;

    Alert.alert(
      "Eliminar todas las fotos",
      "¿Estás seguro de que quieres eliminar todas las fotografías?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onChange([]),
        },
      ],
    );
  };

  if (!isImagePickerAvailable) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="label" style={styles.label}>
          {label}
          {required && <ThemedText style={styles.required}> *</ThemedText>}
        </ThemedText>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            ⚠️ La funcionalidad de cámara no está disponible. Por favor,
            reinstala la aplicación.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="label" style={styles.label}>
            {label}
            {required && <ThemedText style={styles.required}> *</ThemedText>}
          </ThemedText>
          <ThemedText style={styles.counter}>
            {value.length}/{maxImages}
          </ThemedText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
        >
          <View style={styles.gallery}>
            {value.length < maxImages && (
              <Pressable
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
                onPress={showAddOptions}
                disabled={isLoading}
              >
                <ThemedText style={styles.addIcon}>+</ThemedText>
                <ThemedText style={styles.addButtonText}>
                  Agregar Foto
                </ThemedText>
              </Pressable>
            )}

            {value.map((uri, index) => (
              <View key={`${uri}_${index}`} style={styles.imageContainer}>
                <View style={styles.imageNumber}>
                  <ThemedText style={styles.imageNumberText}>
                    {index + 1}
                  </ThemedText>
                </View>
                <Pressable onPress={() => openPreview(uri, index)}>
                  <Image source={{ uri }} style={styles.image} />
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed,
                  ]}
                  onPress={() => removeImage(index)}
                >
                  <ThemedText style={styles.deleteButtonText}>✕</ThemedText>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>

        {value.length > 0 && (
          <Pressable onPress={removeAllImages} style={styles.removeAllButton}>
            <ThemedText style={styles.removeAllText}>
              🗑️ Eliminar todas las fotos
            </ThemedText>
          </Pressable>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>
              Procesando imágenes...
            </ThemedText>
          </View>
        )}

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      </ThemedView>

      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalCloseButton} onPress={closePreview}>
            <ThemedText style={styles.modalCloseText}>✕</ThemedText>
          </Pressable>

          <Pressable
            style={styles.modalDeleteButton}
            onPress={deleteFromPreview}
          >
            <ThemedText style={styles.modalDeleteText}>🗑️</ThemedText>
          </Pressable>

          <View style={styles.modalCounter}>
            <ThemedText style={styles.modalCounterText}>
              {selectedImageIndex + 1} / {value.length}
            </ThemedText>
          </View>

          {selectedImageIndex > 0 && (
            <Pressable style={styles.navLeft} onPress={goToPreviousImage}>
              <ThemedText style={styles.navText}>‹</ThemedText>
            </Pressable>
          )}

          {selectedImageIndex < value.length - 1 && (
            <Pressable style={styles.navRight} onPress={goToNextImage}>
              <ThemedText style={styles.navText}>›</ThemedText>
            </Pressable>
          )}

          {selectedImageUri && (
            <Pressable style={styles.modalContent} onPress={closePreview}>
              <Image
                source={{ uri: selectedImageUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </Pressable>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10, width: "100%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: { flex: 1 },
  required: { color: "red" },
  counter: { color: "#666", fontSize: 12, fontWeight: "500" },
  galleryScroll: { flexDirection: "row" },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingVertical: 8,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  addButtonPressed: {
    backgroundColor: "#e0e0e0",
    transform: [{ scale: 0.98 }],
  },
  addIcon: { fontSize: 32, color: "#007AFF", marginBottom: 4 },
  addButtonText: { fontSize: 11, color: "#007AFF", fontWeight: "500" },
  imageContainer: { position: "relative", width: 100, height: 100 },
  imageNumber: {
    position: "absolute",
    top: -8,
    left: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  imageNumberText: { color: "white", fontSize: 12, fontWeight: "bold" },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  deleteButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonPressed: {
    backgroundColor: "#cc0000",
    transform: [{ scale: 0.95 }],
  },
  deleteButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
  removeAllButton: { marginTop: 10, paddingVertical: 8, alignItems: "center" },
  removeAllText: { color: "#ff4444", fontSize: 14, fontWeight: "500" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 1000,
  },
  loadingText: { color: "white", marginTop: 10 },
  error: { color: "#ff4444", fontSize: 12, marginTop: 4 },
  errorContainer: {
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 10,
    marginTop: 8,
  },
  errorText: { color: "#c62828", fontSize: 14 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%" },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalCloseText: { color: "white", fontSize: 20, fontWeight: "bold" },
  modalDeleteButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,68,68,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalDeleteText: { color: "white", fontSize: 20 },
  modalCounter: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  modalCounterText: { color: "white", fontSize: 14, fontWeight: "500" },
  navLeft: {
    position: "absolute",
    left: 10,
    width: 50,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  navRight: {
    position: "absolute",
    right: 10,
    width: 50,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  navText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});
