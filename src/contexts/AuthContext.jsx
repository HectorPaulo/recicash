/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  getClienteByEmail,
    getEmpresaByEmail
} from "../lib/firebase/auth";
import axios from "axios";
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
    const token = localStorage.getItem("recicash_token");
    if (storedUser && token) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("recicash_user");
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Helpers de roles
  const isAdmin =
    currentUser?.rol?.includes("admin") ||
    currentUser?.user_id?.rol?.includes("admin");
  const isCliente =
    currentUser?.rol?.includes("cliente") ||
    currentUser?.user_id?.rol?.includes("cliente");
  const isEmpresa =
    currentUser?.rol?.includes("empresa") ||
    currentUser?.user_id?.rol?.includes("empresa");

  const login = async (email, password) => {
    const TIMEOUT_MS = 20000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject({ message: "Tiempo de espera agotado. Intenta de nuevo." }),
        TIMEOUT_MS
      )
    );
    try {
      const data = await Promise.race([
        loginWithEmailAndPassword(email, password),
        timeoutPromise,
      ]);
      if (data.token) {
        localStorage.setItem("recicash_token", data.token);

        // Buscar cliente por email
        let usuario = await getClienteByEmail(data.token, email);

        // Si no es cliente, buscar empresa por email
        if (!usuario) {
          usuario = await getEmpresaByEmail(data.token, email);
        }

        if (usuario) {
          setCurrentUser(usuario);
          localStorage.setItem("recicash_user", JSON.stringify(usuario));
          return { user: usuario };
        } else {
          return { error: { message: "Usuario no encontrado" } };
        }
      }
      return { error: { message: "No se recibió token del servidor" } };
    } catch (error) {
      return { error };
    }
  };

  const register = async (nombre, email, password, telefono) => {
    const TIMEOUT_MS = 12000;
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
      if (data.token) {
        localStorage.setItem("recicash_token", data.token);

        // Buscar cliente por email (igual que en login)
        const cliente = await getClienteByEmail(data.token, email);

        setCurrentUser(cliente);
        localStorage.setItem("recicash_user", JSON.stringify(cliente));
        return { user: cliente };
      }
      return { error: { message: "No se recibió token del servidor" } };
    } catch (error) {
      return { error };
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("recicash_user");
      localStorage.removeItem("recicash_token");
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin,
    isCliente,
    isEmpresa,
    login,
    register,
    handleLogout,
    loading,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
