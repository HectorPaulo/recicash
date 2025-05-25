import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Registro
export const registerWithEmailAndPassword = async (
  nombre,
  email,
  password,
  telefono
) => {
  try {
    const credentials = { nombre, email, password, telefono };
    const response = await axios.post(`${API_URL}/auth/register`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error al crear cuenta: ", error);
    throw error;
  }
};

// Login
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
    return response.data; // Aquí debe venir el rol
  } catch (error) {
    console.error("Error al obtener usuario por token: ", error);
    throw error;
  }
};

export const getClienteByEmail = async (token, email) => {
  const response = await axios.get(`${API_URL}/cliente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Busca el cliente cuyo user_id.email coincida
  return response.data.find((cliente) => cliente.user_id.email === email);
};
