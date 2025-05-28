/* eslint-disable no-unused-vars */
import { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrarEmpresa = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    empresa: "",
    ubicacion: "",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      console.log("Datos del formulario:", form);
      // 1. Registrar usuario de empresa
      const token = localStorage.getItem("recicash_token");
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/register/empresa",
        {
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          password: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userId = res.data?.id || res.data?.user?.id;
      if (!userId)
        throw new Error("No se pudo obtener el id del usuario empresa");

      // 2. Registrar la empresa asociada al usuario creado (con token)
      await axios.post(
        import.meta.env.VITE_API_URL + "/empresa",
        {
          user_id: userId,
          empresa: form.empresa,
          ubicacion: form.ubicacion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje("✅ Empresa y usuario registrados correctamente.");
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        password: "",
        empresa: "",
        ubicacion: "",
      });
      navigate('/empresas');
    } catch (error) {
      setMensaje("❌ Error al registrar la empresa y usuario.");
      console.error("Error detalle:", error.response?.data || error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-t from-[#6A994E] to-[#A7C957] flex items-center justify-center pt-20">
      <Sidebar />
      <div className="mx-60 bg-white bg-opacity-90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-xl space-y-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-800">
          Registrar Empresa
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del responsable"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico de la empresa"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="text"
            name="empresa"
            placeholder="Nombre de la empresa"
            value={form.empresa}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-700 hover:bg-green-800 transition-colors text-white font-semibold py-2 rounded-lg"
          >
            Registrar
          </button>
        </form>
        {mensaje && (
          <div className="text-center text-sm font-medium text-gray-700 mt-2">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarEmpresa;
