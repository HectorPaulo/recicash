import { useEffect, useState } from "react";
                    import { useAuth } from "../../contexts/AuthContext";
                    import axios from "axios";
                    import Swal from "sweetalert2";
                    import backgroundImage from "/src/assets/Images/oxc.jpg"

                    const Settings = () => {
                      const { currentUser, setCurrentUser, logout } = useAuth();
                      const [form, setForm] = useState({
                        nombre: "",
                        email: "",
                        telefono: "",
                      });
                      const [loading, setLoading] = useState(false);

                      useEffect(() => {
                        if (currentUser) {
                          setForm({
                            nombre: currentUser?.nombre || currentUser?.user_id?.nombre || "",
                            email: currentUser?.email || currentUser?.user_id?.email || "",
                            telefono: currentUser?.telefono || currentUser?.user_id?.telefono || "",
                          });
                        }
                      }, [currentUser]);

                      const handleChange = (e) => {
                        setForm({ ...form, [e.target.name]: e.target.value });
                      };

                      const handleGuardar = async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        try {
                          await axios.patch("https://proyectodesarrollo-94d5.onrender.com/api/auth/update/", {
                            id: currentUser.id,
                            ...form,
                          });
                          setCurrentUser && setCurrentUser({ ...currentUser, ...form });
                          await Swal.fire("¡Listo!", "Datos actualizados correctamente.", "success");
                        } catch (error) {
                          await Swal.fire("Error", "Error al actualizar los datos.", "error");
                        } finally {
                          setLoading(false);
                        }
                      };

                      const handleEliminarCuenta = async () => {
                        const confirm = await Swal.fire({
                          title: "¿Estás seguro?",
                          text: "Esta acción eliminará tu cuenta permanentemente.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Sí, eliminar",
                          cancelButtonText: "Cancelar",
                        });
                        if (confirm.isConfirmed) {
                          setLoading(true);
                          try {
                            const clienteId = currentUser?.id || currentUser?.user_id?.id;
                            await axios.delete(`https://proyectodesarrollo-94d5.onrender.com/api/cliente/${clienteId}`);
                            await Swal.fire("Cuenta eliminada", "Tu cuenta ha sido eliminada.", "success");
                            await logout();
                            window.location.href = "/login";
                          } catch (error) {
                            await Swal.fire("Error", "No se pudo eliminar la cuenta.", "error");
                          } finally {
                            setLoading(false);
                          }
                        }
                      };

                      return (
                        <div className="flex flex-row min-h-screen " style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          <div className="w-1/2 max-w-screen backdrop-blur-2xl bg-amber-50/10 h-screen p-10 ">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                              Configuración de cuenta
                            </h2>
                            <form onSubmit={handleGuardar} className="space-y-6">
                              <div>
                                <label className="block text-gray-700 font-medium mb-1">Nombre</label>
                                <input
                                  type="text"
                                  name="nombre"
                                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  value={form.nombre}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  value={form.email}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
                                <input
                                  type="text"
                                  name="telefono"
                                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  value={form.telefono}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="flex flex-col md:flex-row gap-4 mt-6">
                                <button
                                  type="submit"
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-md disabled:opacity-60"
                                  disabled={loading}
                                >
                                  {loading ? "Guardando..." : "Guardar cambios"}
                                </button>
                                <button
                                  type="button"
                                  className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-md"
                                  onClick={handleEliminarCuenta}
                                  disabled={loading}
                                >
                                  Eliminar cuenta
                                </button>
                              </div>
                            </form>
                          </div>
                          {/*<img src={backgroundImage} alt="Fondo de configuración" className="h-screen w-full z-0 object-cover" />*/}
                        </div>
                      );
                    };

                    export default Settings;