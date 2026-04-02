import React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { IconSymbol, type IconSymbolName } from '@/src/components/ui/icon-symbol';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  icon?: IconSymbolName;
  containerStyle?: StyleProp<ViewStyle>;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  icon,
  containerStyle,
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundSecondary');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
  const iconColor = useThemeColor({ light: lightColor, dark: darkColor }, 'icon');
  const placeholderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textSecondary');

  return (
    <View style={[
      styles.container, 
      { backgroundColor, borderColor },
      containerStyle
    ]}>
      {icon && (
        <IconSymbol 
          name={icon} 
          size={20} 
          color={iconColor} 
          style={styles.icon} 
        />
      )}
      <TextInput
        style={[styles.input, { color }, style]}
        placeholderTextColor={placeholderColor}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
});
