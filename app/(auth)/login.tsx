import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { useAuth } from "@/src/hooks/useAuth";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { PassI } from "@/assets/icons/PassI";
import { MailI } from "@/assets/icons/MailI";
import { SendI } from "@/assets/icons/SendI";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuth();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Marena Móvil
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Ingrese sus credenciales para continuar
        </ThemedText>

        <ThemedInput
          placeholder="Correo electrónico (admin@marena.com)"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          icon={MailI}
          keyboardType="email-address"
        />

        <ThemedInput
          placeholder="Contraseña"
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
          style={styles.button}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.7,
  },
  button: {
    marginTop: 10,
    borderRadius: 25,
    height: 55, // Mantenemos el alto para consistencia con los inputs
  },
});
