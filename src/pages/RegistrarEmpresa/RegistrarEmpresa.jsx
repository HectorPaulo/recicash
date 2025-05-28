import { useState } from "react";
          import axios from "axios";
          import { useNavigate } from "react-router-dom";
          import { Building, User, Mail, Phone, Lock, MapPin, CheckCircle } from "lucide-react";

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
                if (!userId) throw new Error("No se pudo obtener el id del usuario empresa");

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
                setTimeout(() => navigate("/empresas"), 1200);
              } catch (error) {
                setMensaje("❌ Error al registrar la empresa y usuario.");
                console.error("Error detalle:", error.response?.data || error);
              }
            };

            return (
              <div className="min-h-screen flex items-center justify-center py-16">
                <div className="w-full max-w-4xl bg-white bg-opacity-95 rounded-2xl  p-10 space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Building className="h-10 w-10 text-green-700" />
                    <div>
                      <h1 className="text-3xl font-extrabold text-green-800">Registro Empresarial</h1>
                      <p className="text-gray-500 text-sm">Crea una nueva empresa y su responsable</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border-l-4 border-green-700 rounded-br-2xl rounded-t-2xl p-4 flex items-center gap-3">
                      <User className="h-7 w-7 text-green-700" />
                      <div>
                        <div className="font-bold text-green-900">Responsable</div>
                        <div className="text-xs text-green-700">Datos del usuario encargado</div>
                      </div>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-700 rounded-br-2xl rounded-t-2xl p-4 flex items-center gap-3">
                      <Building className="h-7 w-7 text-green-700" />
                      <div>
                        <div className="font-bold text-green-900">Empresa</div>
                        <div className="text-xs text-green-700">Información de la organización</div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Responsable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <User className="h-4 w-4" /> Nombre del responsable
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          placeholder="Nombre completo"
                          value={form.nombre}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <Mail className="h-4 w-4" /> Correo electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Correo electrónico"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <Phone className="h-4 w-4" /> Teléfono
                        </label>
                        <input
                          type="text"
                          name="telefono"
                          placeholder="Teléfono"
                          value={form.telefono}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <Lock className="h-4 w-4" /> Contraseña
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Contraseña"
                          value={form.password}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                    </div>
                    {/* Empresa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <Building className="h-4 w-4" /> Nombre de la empresa
                        </label>
                        <input
                          type="text"
                          name="empresa"
                          placeholder="Nombre de la empresa"
                          value={form.empresa}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> Ubicación
                        </label>
                        <input
                          type="text"
                          name="ubicacion"
                          placeholder="Ubicación"
                          value={form.ubicacion}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 transition-colors text-white font-bold py-3 rounded-lg text-lg shadow"
                    >
                      <CheckCircle className="h-5 w-5" /> Registrar Empresa
                    </button>
                  </form>
                  {mensaje && (
                    <div
                      className={`text-center text-base font-semibold mt-4 ${
                        mensaje.startsWith("✅")
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {mensaje}
                    </div>
                  )}
                </div>
              </div>
            );
          };

          export default RegistrarEmpresa;