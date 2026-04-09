import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useAuth } from "@/src/hooks/useAuth";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { MailI } from "@/assets/icons/MailI";
import { PassI } from "@/assets/icons/PassI";
import { SendI } from "@/assets/icons/SendI";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atención", "Por favor complete todos los campos");
      return;
    }
    
    // Intentamos iniciar sesión con las credenciales del contexto
    const success = await signIn(email.trim(), password);
    
    if (!success) {
      Alert.alert(
        "Error",
        "Credenciales incorrectas. Verifique su correo y contraseña.",
      );
    }
    // Si el login es exitoso, el RootLayout detectará el cambio en isAuthenticated
    // y nos redirigirá automáticamente a (tabs).
  };

  const shadowColor = useThemeColor({}, "text");
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <HeaderBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Bienvenido a Transporte Marena
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Ingrese sus credenciales para continuar por favor
          </ThemedText>

          <ThemedView
            variant="secondary"
            style={[styles.card, { boxShadow: `0px 5px 15px ${shadowColor}33` }]}
          >
            <ThemedInput
              label="Correo Electrónico"
              placeholder="admin@marena.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              icon={MailI}
              keyboardType="email-address"
            />

            <ThemedInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              icon={PassI}
              secureTextEntry
            />

            <ThemedButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              icon={SendI}
              iconPosition="right"
              size="medium"
              style={styles.button}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: width * 0.08,
    alignItems: "center",
  },
  title: {
    marginVertical: height * 0.03,
    marginHorizontal: width * 0.05,
    textAlign: "left",
    fontFamily: "Manrope-Bold",
  },
  subtitle: {
    marginTop: height * 0.01,
    marginBottom: height * 0.03,
    marginHorizontal: width * 0.05,
    textAlign: "left",
    opacity: 0.6,
  },
  card: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    width: "100%",
  },
});
