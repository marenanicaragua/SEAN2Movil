// contexts/AuthContext.tsx
import { router } from "expo-router";
import { createContext, ReactNode, useState } from "react";

import { AuthContextType } from "@/src/models/types/AuthContext";
import { User } from "@/src/models/types/User";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    setIsLoading(true); // Usado por el botón de login para mostrar el spinner
    console.log("iniciando el login");

    if (!apiUrl) {
      throw new Error(
        "EXPO_PUBLIC_API_URL no está definida. Revisa tu archivo .env",
      );
    }

    try {
      const url = `${apiUrl}/api/Users/authenticate`;
      console.log("2. URL:", url);
      console.log("3. Body:", JSON.stringify({ name: email.trim(), password }));
      // URL de placeholder para tu API
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      // Validamos específicamente el estatus 200 y que venga el token
      if (response.status === 200 && data.token) {
        await setToken(data.token);
        await setRefreshToken(data.refreshToken);

        // Guardamos el usuario usando las credenciales del formulario
        setUser({ email } as User);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error en la petición de login:", error);
      return false;
    } finally {
      setIsAuthenticating(false);
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticating,
        isAuthenticated: !!token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
