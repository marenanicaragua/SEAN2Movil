import React from 'react';
import { TextInputProps, StyleProp, ViewStyle } from 'react-native';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  icon?: React.ComponentType<{ color?: string; size?: number }>;
  containerStyle?: StyleProp<ViewStyle>;
};