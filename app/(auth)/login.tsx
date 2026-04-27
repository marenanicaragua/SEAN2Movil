import { HeaderBar } from "@/src/components/layout/HeaderBar";
import { ThemedButton } from "@/src/components/ui/ThemedButton";
import { ThemedInput } from "@/src/components/ui/ThemedInput";
import { ThemedText } from "@/src/components/ui/ThemedText";
import { ThemedView } from "@/src/components/ui/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { SlideInDown, SlideInUp } from "react-native-reanimated";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { EyeI } from "@/assets/icons/EyeI";
import { MailI } from "@/assets/icons/MailI";
import { PassI } from "@/assets/icons/PassI";
import { SendI } from "@/assets/icons/SendI";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const backgroundColor = useThemeColor({}, "background");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin: SubmitHandler<FormData> = async (data: FormData) => {
    const { email, password } = data;

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

  const shadowColor = useThemeColor({}, "primary");

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
        <ThemedView
          entering={SlideInDown.duration(300).delay(100)}
          exiting={SlideInUp.duration(300)}
          style={styles.container}
        >
          <ThemedText type="title" style={styles.title}>
            Bienvenido a SEAN
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Ingrese sus credenciales para continuar por favor
          </ThemedText>

          <ThemedView
            variant="secondary"
            style={[
              styles.card,
              { boxShadow: `0px 5px 15px ${shadowColor}33` },
            ]}
          >
            <Controller
              control={control}
              name="email"
              rules={{
                required: "El correo electrónico es requerido",
                //pattern: {
                // value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //message: "Ingrese un correo electrónico válido",
                //},
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Correo Electrónico"
                  placeholder="admin@marena.com"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  icon={MailI}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: "La contraseña es requerida",
                minLength: {
                  value: 4,
                  message: "La contraseña debe tener al menos 4 caracteres",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedInput
                  label="Contraseña"
                  placeholder="Ingrese su contraseña"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  icon={PassI}
                  secureTextEntry={!isPasswordVisible}
                  rightIcon={EyeI}
                  onRightIconPress={() =>
                    setIsPasswordVisible(!isPasswordVisible)
                  }
                  error={errors.password?.message}
                />
              )}
            />

            <ThemedButton
              title="Iniciar Sesión"
              onPress={handleSubmit(handleLogin)}
              loading={isLoading}
              icon={SendI}
              iconPosition="right"
              size="medium"
              style={styles.button}
            />
          </ThemedView>
        </ThemedView>
        <ThemedText type="body" style={styles.footerText}>
          Si tiene problema algun con su usuario o contraseña solicite ayuda al
          area de desarrollo.
        </ThemedText>
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
    marginVertical: height * 0.05,
    marginHorizontal: width * 0.05,
    textAlign: "left",
    fontFamily: "Manrope-Bold",
  },
  subtitle: {
    marginTop: height * 0.025,
    marginBottom: height * 0.04,
    marginHorizontal: width * 0.05,
    textAlign: "left",
    opacity: 0.6,
  },
  card: {
    width: width * 0.7,
    height: height * 0.28,
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    width: "60%",
  },
  footerText: {
    marginVertical: height * 0.03,
    marginHorizontal: width * 0.05,
    textAlign: "center",
    opacity: 0.4,
    fontFamily: "Manrope-Light",
    fontSize: width * 0.028,
    lineHeight: 30,
  },
});
