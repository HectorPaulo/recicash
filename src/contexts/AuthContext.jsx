/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "../lib/firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("recicash_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("recicash_user");
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const TIMEOUT_MS = 8000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject({ message: "Tiempo de espera agotado. Intenta de nuevo." }),
        TIMEOUT_MS
      )
    );
    try {
      const data = await Promise.race([
        loginWithEmailAndPassword(email, password),
        timeoutPromise,
      ]);
      console.log("Login response:", data);

      if (data.token) {
        const { token, ...user } = data;
        setCurrentUser(user);
        localStorage.setItem("recicash_user", JSON.stringify(user));
        localStorage.setItem("recicash_token", token);
        return { user };
      }
      return { error: { message: "No se recibió token del servidor" } };
    } catch (error) {
      return { error };
    }
  };

  // Registro
  const register = async (nombre, email, password, telefono) => {
    const TIMEOUT_MS = 8000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject({
            message:
              "Tiempo de espera agotado para el registro. Intentalo de nuevo màs tarde.",
          }),
        TIMEOUT_MS
      )
    );
    try {
      const data = await Promise.race([
        registerWithEmailAndPassword(nombre, email, password, telefono),
        timeoutPromise,
      ]);
      console.log("Register response:", data); // <-- Mira aquí la estructura
      const { token, ...user } = data;
      setCurrentUser(user);
      localStorage.setItem("recicash_user", JSON.stringify(user));
      localStorage.setItem("recicash_token", token);
      return { user };
    } catch (error) {
      return { error };
    }
  };


  const handleLogout = async () => {
    const token = localStorage.getItem("recicash_token");
    try {
      if (token) {
        localStorage.removeItem("recicash_token");
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      localStorage.removeItem("recicash_user");
      localStorage.removeItem("recicash_token");
      navigate("/login");
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    handleLogout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
