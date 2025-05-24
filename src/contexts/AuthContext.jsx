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

  // Helpers de roles
  const getRoles = (user) => {
    // Si el usuario viene de /api/cliente, el rol está en user.user_id.rol
    if (user?.rol) return user.rol;
    if (user?.user_id?.rol) return user.user_id.rol;
    return [];
  };
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
      // data: { id, puntos, user_id: { ...usuario, rol: [...] }, historial }
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
