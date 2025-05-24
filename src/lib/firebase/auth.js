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