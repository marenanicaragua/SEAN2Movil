import { useLocalSearchParams, useRouter } from "expo-router";
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";

const { height } = Dimensions.get("window");

export default function ModalScreen() {
  const router = useRouter();
  const { title, options, selectedValue } = useLocalSearchParams();

  const parsedOptions = options ? JSON.parse(options as string) : [];
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");

  // Valores compartidos para Reanimated
  const translateY = useSharedValue(height);
  const overlayOpacity = useSharedValue(0);
  const isClosing = useRef(false);
  const pendingCallback = useRef<(() => void) | null>(null);

  // Animación de entrada
  useEffect(() => {
    translateY.value = withSpring(0, { damping: 68, stiffness: 900 });
    overlayOpacity.value = withTiming(1, { duration: 150 });
  }, []);

  const closeWithAnimation = (callback?: () => void) => {
    if (isClosing.current) return;
    isClosing.current = true;
    
    if (callback) {
      pendingCallback.current = callback;
    }

    // Animación de salida
    translateY.value = withTiming(height, { duration: 250 });
    overlayOpacity.value = withTiming(0, { duration: 200 });
    
    // Cerrar después de la animación
    setTimeout(() => {
      if (pendingCallback.current) {
        pendingCallback.current();
      }
      router.back();
    }, 250);
  };

  const handleSelect = (value: string) => {
    const currentId = title;
    closeWithAnimation(() => {
      DeviceEventEmitter.emit("onValueSelected", { id: currentId, value });
    });
  };

  const handleDismiss = () => {
    closeWithAnimation();
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable style={styles.dismissArea} onPress={handleDismiss} />

      <Animated.View style={[styles.modalContainer, modalStyle]}>
        <ThemedView style={styles.container}>
          <View style={styles.handle} />

          {title && (
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {title}
            </ThemedText>
          )}

          <FlatList
            data={parsedOptions}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleSelect(item.value)}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    {
                      color:
                        item.value === selectedValue ? primaryColor : textColor,
                    },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </ThemedView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  modalContainer: {
    width: "100%",
  },
  container: {
    maxHeight: height * 0.7,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 15,
    paddingBottom: 20,
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  optionItem: {
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
  },
});