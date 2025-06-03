import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Registro de usuario
export const registerWithEmailAndPassword = async (
  nombre,
  email,
  password,
  telefono
) => {
  try {
    const credentials = { email, password, nombre, telefono };
    const response = await axios.post(`${API_URL}/auth/register`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error al crear cuenta: ", error);
    throw error;
  }
};

// Login de usuario
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    throw error;
  }
};

// Obtener usuario autenticado por token
export const getUserFromToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw { code: error.response.status, message: "Sesión expirada o permisos insuficientes" };
    }
    console.error("Error al obtener usuario por token: ", error);
    throw error;
  }
};

// Buscar cliente por email (requiere token)
export const getClienteByEmail = async (token, email) => {
  try {
    if (!token) throw { code: 401, message: "Token no presente. Inicia sesión de nuevo." };
    const response = await axios.get(`${API_URL}/cliente`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.find((cliente) => cliente.user_id.email === email);
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw { code: error.response.status, message: "Sesión expirada o permisos insuficientes" };
    }
    console.error("Error al buscar cliente por email: ", error);
    throw error;
  }
};

// Buscar empresa por email (requiere token)
export const getEmpresaByEmail = async (token, email) => {
  try {
    if (!token) throw { code: 401, message: "Token no presente. Inicia sesión de nuevo." };
    const response = await axios.get(`${API_URL}/empresa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.find((empresa) => empresa.user_id.email === email);
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw { code: error.response.status, message: "Sesión expirada o permisos insuficientes" };
    }
    console.error("Error al buscar empresa por email: ", error);
    throw error;
  }
};
