import { User } from "@/src/models/types/User";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // Para la carga inicial de la app (Splash)
  isAuthenticating: boolean; // Para el ActivityIndicator del login
  isAuthenticated: boolean; // Helper para saber si está logueado
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}