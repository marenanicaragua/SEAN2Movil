// src/services/database/creStatic.ts

interface UserCredential {
  email: string;
  password: string;
  userData: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user"; // Definimos los posibles roles
  };
}

export const VALID_CREDENTIALS: UserCredential[] = [
  {
    email: "admin@marena.com",
    password: "admin",
    userData: {
      id: "1",
      name: "Administrador",
      email: "admin@marena.com",
      role: "admin",
    },
  },
  {
    email: "user@marena.com",
    password: "user",
    userData: {
      id: "2",
      name: "Usuario",
      email: "user@marena.com",
      role: "user",
    },
  },
];
