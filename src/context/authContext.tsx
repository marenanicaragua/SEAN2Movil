// contexts/AuthContext.tsx
import React, { createContext, ReactNode, useState } from "react";

import { AuthContextType } from "@/src/models/types/AuthContext";
import { User } from "@/src/models/types/User";

import { VALID_CREDENTIALS } from "../services/database/creStatic";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simular delay de red (como si llamara a una API)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validar credenciales
    if (
      email === VALID_CREDENTIALS.email &&
      password === VALID_CREDENTIALS.password
    ) {
      setUser(VALID_CREDENTIALS.userData);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
