/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Aurora from "/src/Backgrounds/Aurora/Aurora";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Settings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        nombre: "",
        email: "",
        telefono: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    try {
      await axios.patch(
        "https://proyectodesarrollo-94d5.onrender.com/api/auth/update/",
        { id: currentUser.id, ...form }
      );
      setMensaje("Datos actualizados correctamente.");
      setCurrentUser && setCurrentUser({ ...currentUser, ...form });
    } catch (error) {
      setMensaje("Error al actualizar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-t from-[#386641] via-[#6A994E]">
      {/* Fondo Aurora */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#386641", "#6A994E", "#A7C957"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <div className="min-h-screen z-50 flex flex-col mt-15">
        <div className="flex flex-1 p-6 z-50 gap-6">
          <Sidebar />
          {/* Contenido principal */}
          <div className="relative z-10 container mx-auto pt-20 px-4 pb-10">
            <div className="rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                <div className="lg:col-span-3">
                  <form
                    onSubmit={handleGuardar}
                    className="bg-white/40 backdrop-blur-sm rounded-lg shadow mb-6 p-6 space-y-6"
                  >
                    <h2 className="text-white text-center text-6xl font-black mb-6">
                      Preferencias de la cuenta
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-100 text-lg font-semibold mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                          value={form.nombre}
                          onChange={handleChange}
                          placeholder={
                            currentUser?.nombre ||
                            currentUser?.user_id?.nombre ||
                            ""
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-100 text-lg font-semibold mb-2">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                          value={form.email}
                          onChange={handleChange}
                          placeholder={
                            currentUser?.email ||
                            currentUser?.user_id?.email ||
                            ""
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-100 text-lg font-semibold mb-2">
                          Número de Teléfono
                        </label>
                        <input
                          type="text"
                          name="telefono"
                          className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                          value={form.telefono}
                          onChange={handleChange}
                          placeholder={
                            currentUser?.telefono ||
                            currentUser?.user_id?.telefono ||
                            ""
                          }
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-green-800 rounded-lg cursor-pointer hover:scale-105 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                    {mensaje && (
                      <div className="mt-4 text-center text-lg text-red-600 font-bold">
                        {mensaje}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
