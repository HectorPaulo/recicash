/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";

const RegistrarEmpresa = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      await axios.post(
        "https://proyectodesarrollo-94d5.onrender.com/api/auth/register",
        {
          ...form,
          rol: ["empresa"], 
        }
      );
      setMensaje("Empresa registrada correctamente.");
      setForm({ nombre: "", email: "", password: "", telefono: "" });
    } catch (error) {
      setMensaje("Error al registrar la empresa.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Empresa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Registrar
        </button>
      </form>
      {mensaje && <div className="mt-4">{mensaje}</div>}
    </div>
  );
};

export default RegistrarEmpresa;
