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
    // Cargar usuario desde localStorage al iniciar, con manejo de errores
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

  // Login
  const login = async (email, password) => {
    try {
      const data = await loginWithEmailAndPassword(email, password);
      setCurrentUser(data.user);
      localStorage.setItem("recicash_user", JSON.stringify(data.user));
      return { user: data.user };
    } catch (error) {
      return { error };
    }
  };

  // Registro
  const register = async (nombre, email, password, telefono) => {
    try {
      const data = await registerWithEmailAndPassword(
        nombre,
        email,
        password,
        telefono
      );
      setCurrentUser(data.user);
      localStorage.setItem("recicash_user", JSON.stringify(data.user));
      return { user: data.user };
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
