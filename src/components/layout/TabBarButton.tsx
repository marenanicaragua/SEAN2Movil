import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useEffect } from 'react';

// Importa tus iconos aquí (ajusta las rutas según tu estructura)
import { HomeI } from '@/assets/icons/HomeI';
import { RegisterI } from '@/assets/icons/RegisterI';
import { TestI } from '@/assets/icons/TestI';


// Tipo para la función de icono
type IconComponent = (props: { color: string; size?: number }) => React.JSX.Element;

// Props del componente
interface TabBarButtonProps {
  isFocused: boolean;
  label: string;
  routeName: string;
  color: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
}

// 📌 ARRAY DE ICONOS - Sustituye los nombres por tus iconos reales
const ICON_ARRAY: { name: string; component: IconComponent }[] = [
  { name: 'index', component: HomeI },        // Pantalla de inicio
  { name: 'Registro', component: RegisterI },    // Pantalla de solicitud
  { name: 'Test', component: TestI },    // Pantalla de Test
  // Pantalla de perfil
  // Agrega más rutas según necesites
  // { name: 'configuracion', component: SettingsIcon },
  // { name: 'notificaciones', component: BellIcon },
];

// Convertir el array a objeto para búsqueda rápida
const ICON_MAP: Record<string, IconComponent> = ICON_ARRAY.reduce((acc, { name, component }) => {
  acc[name] = component;
  return acc;
}, {} as Record<string, IconComponent>);

export default function TabBarButton({ 
  isFocused, 
  label, 
  routeName, 
  color, 
  onPress, 
  onLongPress,
  style 
}: TabBarButtonProps) {
  
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      isFocused ? 1 : 0,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [1, 1.5]
    );

    const top = interpolate(
      scale.value,
      [0, 1],
      [0, 7]
    );

    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scale.value,
      [0, 1],
      [1, 0]
    );

    return {
      opacity,
    };
  });

  // Obtener el icono correspondiente del mapa
  const IconComponent = ICON_MAP[routeName];

  return (
    <Pressable 
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, style]}
    >
      <Animated.View style={animatedIconStyle}>
        {IconComponent && <IconComponent color={color} size={24} />}
      </Animated.View>
      
      <Animated.Text style={[{ color }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});