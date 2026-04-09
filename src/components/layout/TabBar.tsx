import TabBarButton from "@/src/components/layout/TabBarButton";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet, View } from "react-native";

// Constantes fuera del componente para mejor rendimiento
const EXCLUDED_ROUTES = ["_sitemap", "+not-found"] as const;

type ExcludedRoute = (typeof EXCLUDED_ROUTES)[number];

// Tipos para las props del componente
interface TabBarProps extends BottomTabBarProps {
  // Puedes agregar props personalizadas aquí si las necesitas
}

// Tipo para las opciones de la ruta
interface RouteOptions {
  tabBarLabel?: string;
  title?: string;
}

// Tipo para la ruta
interface Route {
  key: string;
  name: string;
  params?: any;
}

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  // Obtenemos los colores directamente del tema
  const activeColor = useThemeColor({}, "primary");
  const inactiveColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "backgroundSecondary");
  const shadowColor = useThemeColor({}, "text"); // Usamos el color de texto para una sombra sutil en dark mode

  const handleTabPress = (route: Route, isFocused: boolean) => {
    const canPreventDefault = true;
    const emitEvent = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault,
    });

    if (!isFocused && !emitEvent.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const handleTabLongPress = (route: Route) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const getTabLabel = (options: RouteOptions, route: Route): string => {
    if (options.tabBarLabel !== undefined) {
      return options.tabBarLabel;
    }
    if (options.title !== undefined) {
      return options.title;
    }
    return route.name;
  };

  const shouldRenderTab = (routeName: string): routeName is ExcludedRoute => {
    return !EXCLUDED_ROUTES.includes(routeName as ExcludedRoute);
  };

  return (
    <View
      style={[
        styles.tabbar,
        {
          backgroundColor,
          shadowColor: Platform.OS === "android" ? "#000" : shadowColor,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if (!shouldRenderTab(route.name)) return null;

        const isFocused = state.index === index;
        const label = getTabLabel(options as RouteOptions, route);

        return (
          <TabBarButton
            key={route.name}
            style={styles.tabbarItem}
            onPress={() => handleTabPress(route, isFocused)}
            onLongPress={() => handleTabLongPress(route)}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? activeColor : inactiveColor}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 15 : 12,
    paddingHorizontal: 8,
    borderRadius: 30,
    borderCurve: "continuous",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
        shadowColor: "#000",
      },
    }),
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
