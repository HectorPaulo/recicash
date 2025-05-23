/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "../lib/firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const TIMEOUT_MS = 8000; // 8 segundos
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
      setCurrentUser(data);
      localStorage.setItem("recicash_user", JSON.stringify(data));
      return { user: data };
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
        reject({message: "Tiempo de espera agotado para el registro. Intentalo de nuevo màs tarde." }),
      TIMEOUT_MS
    )
  );
    try {
      const data = await Promise.race([
        registerWithEmailAndPassword(
          nombre,
          email,
          password,
          telefono
        ),
        timeoutPromise,
      ]);
      setCurrentUser(data);
      localStorage.setItem("recicash_user", JSON.stringify(data));
      return { user: data };
    } catch (error) {
      return { error };
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("recicash_user");
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
