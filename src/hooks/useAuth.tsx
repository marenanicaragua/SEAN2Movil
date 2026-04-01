import { useContext } from "react";
import { AuthContext } from "@/src/context/authContext";

// Hook personalizado con validación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
