import { User } from "@/src/types/User";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean; // Para mostrar loading mientras se autentica
  isAuthenticated: boolean; // Helper para saber si está logueado
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}