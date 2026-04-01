// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { AuthProvider } from "@/src/context/authContext";
import { useAuth } from "@/src/hooks/useAuth";

// Componente que maneja la navegación según autenticación
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Puedes mostrar un splash screen aquí
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // No autenticado: mostrar pantalla de login
        <Stack.Screen name="(auth)" />
      ) : (
        // Autenticado: mostrar tabs
        <Stack.Screen name="(tabs)" />
      )}
      {/* Modal siempre disponible (opcional) */}
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

// Layout principal con el provider y tema
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}