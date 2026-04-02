// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, Text } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { AuthProvider } from "@/src/context/authContext";
import { useAuth } from "@/src/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

function LoadingScreen({ message = "Cargando..." }: { message?: string }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 20, color: "#666", fontSize: 14 }}>
        {message}
      </Text>
    </View>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isAuthenticating } = useAuth();

  if (isLoading) return <LoadingScreen message="Iniciando aplicación..." />;
  if (isAuthenticating) return <LoadingScreen message="Iniciando sesión..." />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Manrope-Regular": require("@/assets/fonts/ManropeBody.ttf"),
    "Manrope-Medium": require("@/assets/fonts/ManropeHead.ttf"),
    "Manrope-Bold": require("@/assets/fonts/ManropeSubHead.ttf"),
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
