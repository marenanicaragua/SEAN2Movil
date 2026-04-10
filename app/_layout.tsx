// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import "react-native-reanimated";

import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { AuthProvider } from "@/src/context/authContext";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useAuth } from "@/src/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

function LoadingScreen({ message = "Cargando..." }: { message?: string }) {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={primaryColor} />
      <ThemedText type="bodySmall" style={{ marginTop: 20 }}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isAuthenticating } = useAuth();

  if (isLoading) return <LoadingScreen message="Iniciando aplicación..." />;
  if (isAuthenticating) return <LoadingScreen message="Iniciando sesión..." />;

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      
      animation: "slide_from_bottom",
      animationDuration: 300,
      }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Manrope-Light": require("@/assets/fonts/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Bold": require("@/assets/fonts/Manrope-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
