import { User } from "@/src/types/User";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean; // Para la carga inicial de la app (Splash)
  isAuthenticating: boolean; // Para el ActivityIndicator del login
  isAuthenticated: boolean; // Helper para saber si está logueado
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}