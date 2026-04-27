import { useAuth } from "@/src/hooks/useAuth";
import { Redirect, Tabs } from "expo-router";

import { TabBar } from "@/src/components/layout/TabBar";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Si la aplicación está verificando el estado de autenticación (ej. cargando token de storage)
  // podrías retornar un componente de carga o null.
  if (isLoading) {
    return null;
  }

  // Si no está autenticado, redirigimos a la pantalla de login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarLabel: "Inicio",
        }}
      />
      <Tabs.Screen
        name="Registro"
        options={{
          title: "Registro",
          tabBarLabel: "Registro",
        }}
      />
      <Tabs.Screen
        name="Test"
        options={{
          title: "Test",
          tabBarLabel: "Test",
        }}
      />
    </Tabs>
  );
}
